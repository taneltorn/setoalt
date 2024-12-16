import {Request, Response, NextFunction} from "express";
import log4js from "log4js";

const logger = log4js.getLogger("requestLogger");
logger.level = process.env.LOG_LEVEL || "info";

export const logRequest = (req: Request, res: Response, next: NextFunction, logBody: boolean = false) => {
    // @ts-ignore todo use custom type for req.user
    logger.info(`${req.method} request to ${req.protocol}://${req.hostname}${req.originalUrl} from ${req.ip || req.socket.remoteAddress || "unknown"} authenticated as ${req.user?.username || "anonymous user"}`);
    if (logBody) {
        logger.info(JSON.stringify(req.body));
    }
    next();
};

export const logRequestWithBody = (req: Request, res: Response, next: NextFunction) => {
    logRequest(req, res, next, true);
};

