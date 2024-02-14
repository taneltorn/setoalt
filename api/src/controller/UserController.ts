import express, {Request, Response} from "express";
import bcrypt from "bcrypt";
import log4js from "log4js";
import {verifyToken} from "../utils/verifyToken";
import userService from '../service//UserService';

const logger = log4js.getLogger("UserController");

class UserController {

    router = express.Router();
    logger = log4js.getLogger("UserController");

    constructor() {
        this.logger.level = 'info';
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get("/", verifyToken, this.getUsers.bind(this));
        this.router.post("/", verifyToken, this.createUser.bind(this));
        this.router.delete("/:id", verifyToken, this.deleteUser.bind(this));
    }

    async getUsers(req: Request, res: Response): Promise<void> {
        try {
            // @ts-ignore todo use custom type
            const user = req.user;

            logger.info(`GET /api/users as user ${user.username}`);
            if (user?.role !== 'ADMIN') {
                logger.info(`Not authorized: ${user.username}`);
                res.status(403).json({error: "Not authorized"});
                return;
            }

            const result = await userService.findAllUsers();
            if (!result.success) {
                res.status(500).json({error: result.error});
                return;
            }
            res.status(200).json(result.data);
        } catch (err) {
            logger.error(err)
            res.status(500).json({error: "An unexpected error occurred."});
        }
    }

    async createUser(req: Request, res: Response): Promise<void> {
        try {
            // @ts-ignore todo use custom type
            const user = req.user;

            logger.info(`POST /api/users as user ${user.username}`);
            const data = req.body;

            if (user?.role !== 'ADMIN') {
                logger.info(`Not authorized: ${user.username}`);
                res.status(403).json({error: "Not authorized"});
                return;
            }

            if (!data) {
                logger.info(`Request body is null`);
                res.status(400).json({error: "Missing user information"});
                return;
            }

            data.password = await bcrypt
                .genSalt(10)
                .then(salt => {
                    return bcrypt.hash(data.password, salt);
                })
                .catch(err => console.error(err.message));

            const result = await userService.insertUser(data, user);
            if (!result.success) {
                if (result.error === "Duplicate username") {
                    res.status(409).json({error: "Username already exists"});
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

    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.id);
            logger.info(`DELETE /api/users/${userId}`);

            // @ts-ignore todo use custom type
            const user = req.user;
            if (user?.role !== 'ADMIN') {
                logger.info(`Not authorized: ${user.username}`);
                res.status(403).json({error: "Not authorized"});
                return;
            }

            if (isNaN(userId)) {
                logger.info(`Invalid ID: ${userId}`);
                res.status(400).json({error: "Invalid ID"});
                return;
            }

            const result = await userService.deleteUser(userId);
            if (!result.success) {
                res.status(500).json({error: result.error});
                return;
            }
            res.status(200).json({message: "User deleted successfully", deletedUser: result});
        } catch (err) {
            logger.error(err);
            res.status(500).json({error: "An unexpected error occurred."});
        }
    }
}

export default new UserController().router;