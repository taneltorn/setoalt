import express, {Request, Response} from 'express';
import cors from "cors";

import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import {config} from 'dotenv';
import * as path from 'path';

import AuthController from './controller/AuthController';
import UserController from "./controller/UserController";
import ScoreController from "./controller/ScoreController";
import NotificationController from "./controller/NotificationController";
import log4js from "log4js";
import * as process from "process";

const app = express();
const port = 4000;

config({path: path.resolve(__dirname, '../../.env')});

const logger = log4js.getLogger();
logger.level = process.env.LOG_LEVEL;

logger.info(`Starting API service`)
logger.info(`Log level: ${process.env.LOG_LEVEL}`)
logger.info(`Allowed origin: ${process.env.ALLOWED_ORIGIN}`)

app.use(cors({
    credentials: true,
    origin: process.env.ALLOWED_ORIGIN,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/api/auth', AuthController);
app.use('/api/scores', ScoreController);
app.use('/api/users', UserController);
app.use('/api/notifications', NotificationController);

app.get('/api/status', async (req: Request, res: Response): Promise<void> => {
    logger.info("GET /api/status");
    try {
        logger.info("OK");
        res.json("OK");
    } catch (err) {
        logger.error(err);
        res.status(500).json({error: err});
    }
});

app.listen(port, () => {
    logger.info(`Application started`);
    logger.info(`Server running on port ${port}`);
});
