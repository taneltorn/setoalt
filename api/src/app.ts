import express, {NextFunction, Request, Response} from 'express';
import cors from "cors";
import {config} from 'dotenv';
import * as path from 'path';
import bcrypt from "bcrypt";

import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app = express();
const port = 3000;


app.use(cors({
    origin: "http://localhost:5173",
    // origin: process.env.ALLOWED_ORIGIN,
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

config({path: path.resolve(__dirname, '../../.env')});

const Pool = require('pg').Pool
const pool = new Pool({
    // docker:
    // connectionString: process.env.DATABASE_URL

    // local dev, remove later:
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT || 5432,
});
const saltRounds = 10
const password = "adminsetoalt"
import jwt from 'jsonwebtoken';


const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token || '';
    if (!token) {
        return res.status(403).json({error: "A token is required for authentication"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);
        // @ts-ignore
        req.user = decoded;
    } catch (err) {
        return res.status(401).json({error: "Invalid or expired token"});
    }

    return next();
};

app.get('/api/verify', verifyToken, (req: Request, res: Response) => {
    console.log("VEVVVV")
    // @ts-ignore
    res.json({message: 'Session is valid', user: req.user});
});

app.post('/api/login', async (req, res) => {
    const {username, password} = req.body;
    try {
        const users = await pool.query('SELECT * FROM setoalt.users WHERE username = $1', [username]);

        const user = users.rows?.[0];
        if (user) {
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid) {
                const token = jwt.sign({
                    id: user.id,
                    username: user.username,
                    role: user.role,
                }, process.env.JWT_SECRET_KEY, {expiresIn: '7d'});
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: true,
                });
                res.json({
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        role: user.role
                    }
                });
            } else {
                res.status(401).json({error: "Invalid credentials"});
            }
        } else {
            res.status(404).json({error: "User not found"});
        }
    } catch (error) {
        res.status(500).json({error: "Error logging in"});
    }
});

app.post('/api/logout', (req, res) => {
    res.clearCookie("token");
    res.status(200).json({message: "Logged out successfully"});
});

app.get('/api/scores', verifyToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query('SELECT * FROM setoalt.scores');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({error: 'Internal Server Error'});
    }
});

app.get('/api/scores/:id', async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({error: 'Invalid ID'});
        return;
    }

    try {
        const result = await pool.query('SELECT * FROM setoalt.scores WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            res.status(404).json({error: 'Score not found'});
            return;
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
