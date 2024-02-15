import express, {Request, Response} from 'express';
import cors from "cors";
import {config} from 'dotenv';
import * as path from 'path';

import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import AuthController from './controller/AuthController';
import UserController from "./controller/UserController";
import ScoreController from "./controller/ScoreController";
import log4js from "log4js";
import process from "process";

const app = express();
const port = 3000;

config({path: path.resolve(__dirname, '../../.env')});

const logger = log4js.getLogger();
logger.level = process.env.LOG_LEVEL;

app.use(cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://localhost"],
    // origin: process.env.ALLOWED_ORIGIN,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/api/auth', AuthController);
app.use('/api/scores', ScoreController);
app.use('/api/users', UserController);

app.get('/api/status', async (req: Request, res: Response): Promise<void> => {
    console.log("GET /api/status");
    try {
        res.json("ok");
    } catch (err) {
        res.status(500).json({error: err});
    }
});

app.listen(port, () => {
    logger.info(`Application started`);
    logger.info(`Server running on port ${port}`);
});
