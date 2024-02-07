import express, {Request, Response} from 'express';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import {verifyToken} from "../utils/verifyToken";
import { pool } from '../config/dbConfig';

const router = express.Router();

router.post('/login', async (req, res) => {
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

router.post('/logout', (req, res) => {
    res.clearCookie("token");
    res.status(200).json({message: "Logged out successfully"});
});

router.get('/verify', verifyToken, (req: Request, res: Response) => {
    // @ts-ignore
    res.json({message: 'Session is valid', user: req.user});
});

export default router;