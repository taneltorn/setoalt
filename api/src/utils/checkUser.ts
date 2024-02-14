import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';

export const checkUser = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token || '';
    if (token) {
        try {
            // @ts-ignore todo use custom type
            req.user = jwt.verify(token, process.env.JWT_SECRET_KEY!);
        } catch (err) {}
    }
    return next();
};
