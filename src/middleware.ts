import express, { Request, Response, NextFunction } from 'express';

export function checkUser(req: Request, res: Response, next: NextFunction) {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    next();
}

export function checkNoUser (req: Request, res: Response, next: NextFunction) {
    if (req.session.user) {
        return res.redirect('/');
    }

    next();
}

function forbidHttp (req: Request, res: Response, next: NextFunction) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.status(403);
    }

    next();
}
