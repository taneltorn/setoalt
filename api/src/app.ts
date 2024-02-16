import express, {Request, Response} from 'express';
import cors from "cors";

import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import AuthController from './controller/AuthController';
import UserController from "./controller/UserController";
import ScoreController from "./controller/ScoreController";
import log4js from "log4js";
import * as process from "process";

const app = express();
const port = 3000;

const logger = log4js.getLogger();
logger.level = process.env.LOG_LEVEL;

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost"];

app.use(cors({
    credentials: true,
    origin: allowedOrigins,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/api/auth', AuthController);
app.use('/api/scores', ScoreController);
app.use('/api/users', UserController);

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
