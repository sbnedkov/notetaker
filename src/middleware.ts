import express, { Request, Response, NextFunction } from 'express';

export function checkUser(req: Request, res: Response, next: NextFunction) {
    if (!req.session.user) {
        res.sendStatus(403);
        next(new Error('Forbidden'));
    } else {
        next();
    }
}
