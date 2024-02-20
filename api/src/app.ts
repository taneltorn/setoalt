import express, {Request, Response} from 'express';
import cors from "cors";

import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import {config} from 'dotenv';
import * as path from 'path';

import AuthController from './controller/AuthController';
import UserController from "./controller/UserController";
import ScoreController from "./controller/ScoreController";
import log4js from "log4js";
import * as process from "process";

const app = express();
const port = 3000;

config({path: path.resolve(__dirname, '../../.env')});

const logger = log4js.getLogger();
logger.level = process.env.LOG_LEVEL;

logger.info(`Log level: ${process.env.LOG_LEVEL}`)
logger.info(`Allowed origin: ${process.env.ALLOWED_ORIGIN}`)

// todo seems this is not supported:
// const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost"];

// todo try this instead
// var allowedOrigins = ['http://localhost:3000',
//     'http://yourapp.com'];app.use(cors({
//     origin: function(origin, callback){    // allow requests with no origin
//         // (like mobile apps or curl requests)
//         if(!origin) return callback(null, true);    if(allowedOrigins.indexOf(origin) === -1){
//             var msg = 'The CORS policy for this site does not ' +
//                 'allow access from the specified Origin.';
//             return callback(new Error(msg), false);
//         }    return callback(null, true);
//     }
// }));

app.use(cors({
    credentials: true,
    origin: process.env.ALLOWED_ORIGIN,
}));

// app.use(function (req, res, next) {
//     const origin = req.headers.origin;
//     if(allowedOrigins.indexOf(origin) > -1){
//         res.setHeader('Access-Control-Allow-Origin', origin);
//     }
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Accept');
//     // @ts-ignore
//     res.setHeader('Access-Control-Allow-Credentials', true);
//
//     next();
// })

// todo something to try:
// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "https://yoursite.com");
//     res.header(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept"
//     );
//     next();
// });

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
