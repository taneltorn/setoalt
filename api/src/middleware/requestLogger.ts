import {Request, Response, NextFunction} from "express";
import log4js from "log4js";

const logger = log4js.getLogger("requestLogger");
logger.level = process.env.LOG_LEVEL || "info";

export const logRequest = (req: Request, res: Response, next: NextFunction, logBody: boolean = false) => {
    // @ts-ignore todo use custom type for req.user
    const user = req.user?.username ? `user '${req.user.username}'` : "anonymous user";
    
    logger.info(`Received ${req.method} ${req.protocol}://${req.hostname}${req.path} request by ${user}`);
    if (logBody) {
        logger.info(req.body);
    }
    next();
};

export const logRequestWithBody = (req: Request, res: Response, next: NextFunction) => {
    logRequest(req, res, next, true);
};

