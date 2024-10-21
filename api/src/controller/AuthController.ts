import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/verifyToken";
import userService from "../service/UserService";
import log4js from "log4js";

class AuthController {
    public router = express.Router();
    logger = log4js.getLogger("AuthController");

    constructor() {
        this.logger.level = process.env.LOG_LEVEL;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post("/login", this.login);
        this.router.post("/logout", this.logout);
        this.router.get("/verify", verifyToken, this.verifySession);
    }

    private login = async (req: Request, res: Response) => {
        try {
            const { username, password } = req.body;

            this.logger.info(`POST /login from ${req.hostname} as user ${username}`)

            const result = await userService.findByUsername(username);
            if (result.data) {
                const user = result.data;

                const isValid = await bcrypt.compare(password, user.password);
                if (isValid) {
                    this.logger.info(`Password is valid`);

                    const token = jwt.sign({
                        id: user.id,
                        username: user.username,
                        role: user.role,
                    }, process.env.JWT_SECRET_KEY!, { expiresIn: "30d" });
                    res.cookie("token", token, {
                        httpOnly: true,
                        secure: false, // todo: set true in production, when https is enabled
                    });
                    res.json({
                        token,
                        user: {
                            id: user.id,
                            username: user.username,
                            firstname: user.firstname,
                            lastname: user.lastname,
                            role: user.role
                        }
                    });
                } else {
                    this.logger.info(`Invalid credentials`);
                    res.status(401).json({ error: "Invalid credentials" });
                }
            } else {
                this.logger.info(`User not found`);
                res.status(404).json({ error: "User not found" });
            }
        } catch (err) {
            this.logger.error(err);
            res.status(500).json({error: "An unexpected error occurred."});
        }
    };

    private logout = (req: Request, res: Response) => {
        // @ts-ignore todo use custom type
        const user = req.user;

        this.logger.info(`POST /logout from ${req.hostname} as user ${user}`);

        res.clearCookie("token");
        res.status(200).json({ message: "Logged out successfully" });
    };

    private verifySession = (req: Request, res: Response) => {
        // @ts-ignore todo use custom type
        const user = req.user;

        this.logger.info(`GET /verify from ${req.hostname} as user ${user?.username}`);

        // @ts-ignore
        res.json({ message: "Session is valid", user: req.user });
    };
}

export default new AuthController().router;