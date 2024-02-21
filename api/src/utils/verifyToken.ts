import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';

import log4js from "log4js";
const logger = log4js.getLogger("AuthController");

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Verifying token`);

    const token = req.cookies.token || '';
    if (!token) {
        logger.info(`No token present`);
        return res.status(403).json({error: "A token is required for authentication"});
    }

    try {
        // @ts-ignore todo use custom type
        req.user = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    } catch (err) {
        return res.status(401).json({error: "Invalid or expired token"});
    }
    return next();
};
