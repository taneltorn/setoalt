import express, {Request, Response} from "express";
import {pool} from "../config/dbConfig";
import {verifyToken} from "../utils/verifyToken";
import log4js from "log4js";
import {toCamelCase} from "../utils/helpers";

const logger = log4js.getLogger();
logger.level = 'info';

const router = express.Router();

router.get("/", async (req: Request, res: Response): Promise<any> => {
    logger.info("GET /api/scores");

    try {
        const query = "SELECT * FROM setoalt.scores";
        const result = await pool.query(query);

        const data = toCamelCase(result.rows);
        res.json(data);
    } catch (err) {
        logger.error(err);
        res.status(500).json({error: err});
    }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    logger.info(`GET /api/scores/${id}`);

    if (isNaN(id)) {
        res.status(400).json({error: "Invalid ID"});
        return;
    }

    try {
        logger.info(`Querying score with id = ${id} in database`);

        const query = "SELECT * FROM setoalt.scores WHERE id = $1";
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            logger.info(`Score with id = ${id} not found`);

            res.status(404).json({error: "Score not found"});
            return;
        }

        const data = toCamelCase(result.rows[0]);
        res.json(data);
    } catch (err) {
        logger.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
});

router.post("/", verifyToken, async (req: Request, res: Response): Promise<void> => {
    logger.info("POST /scores")
    logger.info(req.body);

    // @ts-ignore todo use custom type
    const user = req.user;
    const score = req.body;

    if (!score || !user) {
        res.status(400).json({error: "Missing score or user information"});
        return;
    }

    try {
        logger.info(`Inserting new score`);
        logger.info(user.id);

        const query = `INSERT INTO setoalt.scores(name, user_id, description, data, default_tempo, text, visibility)
                       VALUES($1, $2, $3, $4, $5, $6, $7) 
                       RETURNING *`;
        const result = await pool.query(query, [
            score.name,
            1, // todo => user.id
            score.description,
            score.data,
            score.defaultTempo,
            score.text,
            score.visibility
        ]);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        logger.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
});

router.put("/:id", verifyToken, async (req: Request, res: Response): Promise<void> => {
    logger.info("PUT /scores/:id");
    logger.info(req.body);

    const scoreId = req.params.id;

    // @ts-ignore todo use custom type
    const user = req.user;
    const updatedScore = req.body;

    if (!updatedScore || !user) {
        res.status(400).json({ error: "Missing updated score data or user information" });
        return;
    }

    try {
        logger.info(`Updating score with id = ${scoreId}`);
        const query = `
            UPDATE setoalt.scores
            SET name = $1, 
                description = $2, 
                data = $3, 
                default_tempo = $4, 
                text = $5, 
                visibility = $6
            WHERE id = $7 AND user_id = $8
            RETURNING *;
        `;
        const result = await pool.query(query, [
            updatedScore.name,
            updatedScore.description,
            updatedScore.data,
            updatedScore.defaultTempo,
            updatedScore.text,
            updatedScore.visibility,
            scoreId,
            user.id,
        ]);

        if (result.rows.length === 0) {
            res.status(404).json({ error: "Score not found or you're not the owner" });
            return;
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        logger.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete("/:id", verifyToken, async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    logger.info(`DELETE /api/scores/${id}`);

    if (isNaN(id)) {
        res.status(400).json({error: "Invalid ID"});
        return;
    }

    try {
        logger.info(`Deleting score with id = ${id}`);

        const query = "DELETE FROM setoalt.scores WHERE id = $1 RETURNING id";
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            logger.info(`Score with id = ${id} not found in database`);

            res.status(404).json({error: "Score not found"});
            return;
        }

        logger.info(`Score with id = ${id} removed from database`);
        res.status(200).json({message: "Score deleted successfully", deletedScore: result.rows[0]});
    } catch (err) {
        logger.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
});

export default router;