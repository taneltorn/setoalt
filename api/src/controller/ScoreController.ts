import express, {Request, Response} from "express";
import log4js from "log4js";
import {verifyToken} from "../utils/verifyToken";
import scoreService from "../service/ScoreService";

const logger = log4js.getLogger("UserController");

class ScoreController {

    router = express.Router();
    logger = log4js.getLogger("ScoreController");

    constructor() {
        this.logger.level = 'info';
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get("/", this.getScores.bind(this));
        this.router.get("/:id", this.getScore.bind(this));
        this.router.post("/", verifyToken, this.createScore.bind(this));
        this.router.put("/:id", verifyToken, this.updateScore.bind(this));
        this.router.delete("/:id", verifyToken, this.deleteScore.bind(this));
    }

    async getScore(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            logger.info(`GET /api/scores/${id}`);

            if (isNaN(id)) {
                logger.info(`Invalid ID: ${id}`);
                res.status(400).json({error: "Invalid ID"});
                return;
            }

            const result = await scoreService.findScoreById(id);
            if (!result.success) {
                if (result.error === "Not found") {
                    res.status(404).json({error: `Score ${id} not found`});
                    return;
                }
                res.status(500).json({error: result.error});
                return;
            }
            res.status(200).json(result.data);
        } catch (err) {
            logger.error(err);
            res.status(500).json({error: "An unexpected error occurred."});
        }
    }

    async getScores(req: Request, res: Response): Promise<void> {
        try {
            logger.info("GET /api/scores");

            // @ts-ignore todo use custom type
            const user = req.user;

            const result = await scoreService.findAllScores(user);
            if (!result.success) {
                res.status(500).json({error: result.error});
                return;
            }
            res.status(200).json(result.data);
        } catch (err) {
            logger.error(err);
            res.status(500).json({error: "An unexpected error occurred."});
        }
    }

    async createScore(req: Request, res: Response): Promise<void> {
        try {
            // @ts-ignore todo use custom type
            const user = req.user;
            const data = req.body;

            logger.info(`POST /api/scores as ${user.username}:`)
            logger.info(req.body);

            if (!data) {
                logger.info(`Request body is null`);
                res.status(400).json({error: "Missing score information"});
                return;
            }

            const result = await scoreService.insertScore(data, user);
            if (!result.success) {
                res.status(500).json({error: result.error});
                return;
            }
            res.status(200).json(result.data);
        } catch (err) {
            logger.error(err);
            res.status(500).json({error: "An unexpected error occurred."});
        }
    }

    async updateScore(req: Request, res: Response): Promise<void> {
        try {
            // @ts-ignore todo use custom type
            const user = req.user;
            const data = req.body;

            const id = parseInt(req.params.id);
            logger.info(`PUT /scores/${id} as ${user.username}:`);
            logger.info(req.body);

            if (isNaN(id)) {
                logger.info(`Invalid ID: ${id}`);
                res.status(400).json({error: "Invalid ID"});
                return;
            }

            if (!data) {
                logger.info(`Request body is null`);
                res.status(400).json({error: "Missing score information"});
                return;
            }

            const result = await scoreService.updateScore(id, data, user);
            if (!result.success) {
                res.status(500).json({error: result.error});
                return;
            }
            res.status(200).json(result.data);
        } catch (err) {
            logger.error(err);
            res.status(500).json({error: "An unexpected error occurred."});
        }
    }

    async deleteScore(req: Request, res: Response): Promise<void> {
        try {
            // @ts-ignore todo use custom type
            const user = req.user;

            const id = parseInt(req.params.id);
            logger.info(`DELETE /api/scores/${id} as ${user.username}`);

            if (isNaN(id)) {
                logger.info(`Invalid ID: ${id}`);
                res.status(400).json({error: "Invalid ID"});
                return;
            }

            const result = await scoreService.deleteScore(id);
            if (!result.success) {
                res.status(500).json({error: result.error});
                return;
            }
            res.status(200).json(result.data);
        } catch (err) {
            logger.error(err);
            res.status(500).json({error: "An unexpected error occurred."});
        }
    }
}

export default new ScoreController().router;