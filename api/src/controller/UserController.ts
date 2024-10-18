import express, {Request, Response} from "express";
import bcrypt from "bcrypt";
import log4js from "log4js";
import {verifyToken} from "../utils/verifyToken";
import userService from '../service//UserService';
import {User} from "../model/User";
import {UserDTO} from "../model/UserDTO";
import Mapper from "../utils/Mapper";

class UserController {

    router = express.Router();
    logger = log4js.getLogger("UserController");

    constructor() {
        this.logger.level = process.env.LOG_LEVEL;
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get("/", verifyToken, this.getUsers.bind(this));
        this.router.post("/", verifyToken, this.createUser.bind(this));
        this.router.patch("/:id", verifyToken, this.updateUser.bind(this));
        this.router.delete("/:id", verifyToken, this.deleteUser.bind(this));
    }

    async getUsers(req: Request, res: Response): Promise<UserDTO> {
        try {
            // @ts-ignore todo use custom type
            const user = req.user;

            this.logger.info(`GET /api/users from ${req.hostname} as user ${user?.username}`);
            if (user?.role !== 'ADMIN') {
                this.logger.info(`Not authorized: ${user.username}`);
                res.status(403).json({error: "Not authorized"});
                return;
            }

            const result = await userService.findAll();
            if (!result.success) {
                res.status(500).json({error: result.error});
                return;
            }

            const users = result.data.map((u: User) => Mapper.toUserDTO(u));
            res.status(200).json(users);
        } catch (err) {
            this.logger.error(err)
            res.status(500).json({error: "An unexpected error occurred."});
        }
    }

    async createUser(req: Request, res: Response): Promise<void> {
        try {
            // @ts-ignore todo use custom type
            const user = req.user;

            this.logger.info(`POST /api/users from ${req.hostname} as user ${user?.username}`);
            const data = req.body;

            if (user?.role !== 'ADMIN') {
                this.logger.info(`Not authorized: ${user.username}`);
                res.status(403).json({error: "Not authorized"});
                return;
            }

            if (!data) {
                this.logger.info(`Request body is null`);
                res.status(400).json({error: "Missing user information"});
                return;
            }

            data.password = await bcrypt
                .genSalt(10)
                .then(salt => {
                    return bcrypt.hash(data.password, salt);
                })
                .catch(err => console.error(err.message));

            const result = await userService.insert(data, user);
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
            this.logger.error(err);
            res.status(500).json({error: "An unexpected error occurred."});
        }
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            // @ts-ignore todo use custom type
            const user = req.user;

            const id = parseInt(req.params.id);
            this.logger.info(`PATCH /api/users/${id} from ${req.hostname} as user ${user?.username}`);


            const data = req.body;

            if (user?.role !== 'ADMIN') {
                this.logger.info(`Not authorized: ${user.username}`);
                res.status(403).json({error: "Not authorized"});
                return;
            }

            if (!data) {
                this.logger.info(`Request body is null`);
                res.status(400).json({error: "Missing user information"});
                return;
            }

            const result = await userService.update(id, data, user);
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

    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            // @ts-ignore todo use custom type
            const user = req.user;

            const userId = parseInt(req.params.id);
            this.logger.info(`DELETE /api/users/${userId} from ${req.hostname} as user ${user?.username}`);


            if (user?.role !== 'ADMIN') {
                this.logger.info(`Not authorized: ${user.username}`);
                res.status(403).json({error: "Not authorized"});
                return;
            }

            if (isNaN(userId)) {
                this.logger.info(`Invalid ID: ${userId}`);
                res.status(400).json({error: "Invalid ID"});
                return;
            }

            const result = await userService.delete(userId);
            if (!result.success) {
                res.status(500).json({error: result.error});
                return;
            }
            res.status(200).json({message: "User deleted successfully", deletedUser: result});
        } catch (err) {
            this.logger.error(err);
            res.status(500).json({error: "An unexpected error occurred."});
        }
    }
}

export default new UserController().router;