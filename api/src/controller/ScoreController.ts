import express, {Request, Response} from "express";
import log4js from "log4js";
import {verifyToken} from "../utils/verifyToken";
import scoreService from "../service/ScoreService";
import {checkUser} from "../utils/checkUser";
import {Score} from "../model/Score";

class ScoreController {

    router = express.Router();
    logger = log4js.getLogger("ScoreController");

    constructor() {
        this.logger.level = process.env.LOG_LEVEL;
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get("/", checkUser, this.getScores.bind(this));
        this.router.get("/:id", checkUser, this.getScore.bind(this));
        this.router.post("/", verifyToken, this.createScore.bind(this));
        this.router.put("/:id", verifyToken, this.updateScore.bind(this));
        this.router.delete("/:id", verifyToken, this.deleteScore.bind(this));
    }

    async getScores(req: Request, res: Response): Promise<Score[]> {
        try {
            this.logger.info("GET /api/scores");

            // @ts-ignore todo use custom type
            const user = req.user;

            const result = await scoreService.find(user?.role !== 'ADMIN' ? user?.username : undefined);

            if (!result.success) {
                res.status(500).json({error: result.error});
                return;
            }
            res.status(200).json(result.data);
        } catch (err) {
            this.logger.error(err);
            res.status(500).json({error: "An unexpected error occurred."});
        }
    }

    async getScore(req: Request, res: Response): Promise<Score> {
        try {
            const id = parseInt(req.params.id);
            this.logger.info(`GET /api/scores/${id}`);

            // @ts-ignore todo use custom type
            const user = req.user;

            if (isNaN(id)) {
                this.logger.info(`Invalid ID: ${id}`);
                res.status(400).json({error: "Invalid ID"});
                return;
            }

            const result = await scoreService.findById(id, user?.role !== 'ADMIN' ? user?.username : undefined);
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
            this.logger.error(err);
            res.status(500).json({error: "An unexpected error occurred."});
        }
    }

    async createScore(req: Request, res: Response): Promise<Score> {
        try {
            // @ts-ignore todo use custom type
            const user = req.user;
            const data = req.body;

            this.logger.info(`POST /api/scores as ${user.username}:`)
            this.logger.info(req.body);

            if (!data) {
                this.logger.info(`Request body is null`);
                res.status(400).json({error: "Missing score information"});
                return;
            }

            const result = await scoreService.insert(data, user);
            if (!result.success) {
                res.status(500).json({error: result.error});
                return;
            }
            res.status(200).json(result.data);
        } catch (err) {
            this.logger.error(err);
            res.status(500).json({error: "An unexpected error occurred."});
        }
    }

    async updateScore(req: Request, res: Response): Promise<Score> {
        try {
            // @ts-ignore todo use custom type
            const user = req.user;
            const data = req.body;

            const id = parseInt(req.params.id);
            this.logger.info(`PUT /scores/${id} as ${user.username}:`);
            this.logger.info(req.body);

            if (isNaN(id)) {
                this.logger.info(`Invalid ID: ${id}`);
                res.status(400).json({error: "Invalid ID"});
                return;
            }

            if (!data) {
                this.logger.info(`Request body is null`);
                res.status(400).json({error: "Missing score information"});
                return;
            }

            const result = await scoreService.update(id, data, user);
            if (!result.success) {
                res.status(500).json({error: result.error});
                return;
            }
            res.status(200).json(result.data);
        } catch (err) {
            this.logger.error(err);
            res.status(500).json({error: "An unexpected error occurred."});
        }
    }

    async deleteScore(req: Request, res: Response): Promise<void> {
        try {
            // @ts-ignore todo use custom type
            const user = req.user;

            const id = parseInt(req.params.id);
            this.logger.info(`DELETE /api/scores/${id} as ${user.username}`);

            if (isNaN(id)) {
                this.logger.info(`Invalid ID: ${id}`);
                res.status(400).json({error: "Invalid ID"});
                return;
            }

            const result = await scoreService.delete(id, user);
            if (!result.success) {
                res.status(500).json({error: result.error});
                return;
            }
            res.status(200).json(result.data);
        } catch (err) {
            this.logger.error(err);
            res.status(500).json({error: "An unexpected error occurred."});
        }
    }
}

export default new ScoreController().router;