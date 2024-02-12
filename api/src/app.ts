import express, {Request, Response} from 'express';
import cors from "cors";
import {config} from 'dotenv';
import * as path from 'path';

import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import authRoutes from './routes/authRoutes';
import scoreRoutes from './routes/scoreRoutes';
import router from "./routes/scoreRoutes";

const app = express();
const port = 3000;

config({path: path.resolve(__dirname, '../../.env')});

app.use(cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://localhost"],
    // origin: process.env.ALLOWED_ORIGIN,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/scores', scoreRoutes);

app.get('/api/status', async (req: Request, res: Response): Promise<void> => {
    console.log("GET /api/status");
    try {
        res.json("ok");
    } catch (err) {
        res.status(500).json({error: err});
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
