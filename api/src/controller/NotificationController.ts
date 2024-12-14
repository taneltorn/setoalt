import express, {Request, Response} from "express";
import log4js from "log4js";
import {verifyToken} from "../middleware/verifyToken";
import {checkUser} from "../middleware/checkUser";
import notificationService from "../service/NotificationService";
import {Notification} from "../model/Notification";
import {logRequest, logRequestWithBody} from "../middleware/requestLogger";

class NotificationController {

    router = express.Router();
    logger = log4js.getLogger("NotificationController");

    constructor() {
        this.logger.level = process.env.LOG_LEVEL;
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get("/", checkUser, logRequest, this.getNotifications.bind(this));
        this.router.get("/active", checkUser, logRequest, this.getActiveNotifications.bind(this));
        this.router.get("/:id", checkUser, logRequest, this.getNotification.bind(this));
        this.router.post("/", verifyToken, logRequestWithBody, this.createNotification.bind(this));
        this.router.put("/:id", verifyToken, logRequestWithBody, this.updateNotification.bind(this));
        this.router.delete("/:id", verifyToken, logRequest, this.deleteNotification.bind(this));
    }

    async getNotification(req: Request, res: Response): Promise<Notification> {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                this.logger.info(`Invalid ID: ${id}`);
                res.status(400).json({error: "Invalid ID"});
                return;
            }

            const result = await notificationService.findById(id);
            if (!result.success) {
                if (result.error === "Not found") {
                    res.status(404).json({error: `Notification ${id} not found`});
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

    async getNotifications(req: Request, res: Response): Promise<Notification[]> {
        try {
            const result = await notificationService.find();
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

    async getActiveNotifications(req: Request, res: Response): Promise<Notification[]> {
        try {
            const result = await notificationService.find(true);
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

    async createNotification(req: Request, res: Response): Promise<Notification> {
        try {
            const data = req.body;

            if (!data) {
                this.logger.info(`Request body is null`);
                res.status(400).json({error: "Missing notification information"});
                return;
            }

            const result = await notificationService.insert(data);
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

    async updateNotification(req: Request, res: Response): Promise<Notification> {
        try {
            const data = req.body;
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                this.logger.info(`Invalid ID: ${id}`);
                res.status(400).json({error: "Invalid ID"});
                return;
            }

            if (!data) {
                this.logger.info(`Request body is null`);
                res.status(400).json({error: "Missing notification information"});
                return;
            }

            const result = await notificationService.update(id, data);
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

    async deleteNotification(req: Request, res: Response): Promise<number> {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                this.logger.info(`Invalid ID: ${id}`);
                res.status(400).json({error: "Invalid ID"});
                return;
            }

            const result = await notificationService.delete(id);
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

export default new NotificationController().router;