import crypto from 'crypto';

import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

export async function loginUser (req: Request, res: Response) {
    try {
        const user = await auth(req);

        if (user) {
            req.session.user = user._id;
            return res.redirect('/');
        }
    } catch (err) {
        console.error(err);
    }

    res.sendStatus(401);
}

export function logoutUser (req: Request, res: Response) {
    delete req.session.user;
    res.redirect('/');
}

export function csrf () {
    return (req: Request, res: Response, next: NextFunction) => {
        const csrf = randomUUID();
        res.header('X-XSRF-TOKEN', csrf);
        if (!req.session.csrf) {
            res.locals.firstRequest = true;
        }
        req.session.csrf = csrf;
        next();
    }
}

export function checkCsrf () {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!res.locals.firstRequest && req.body.csrf !== req.session.csrf) {
            res.sendStatus(403);
            next(new Error('Forbidden'));
        } else {
            next();
        }
    }
}

function passwordHash (password: string, salt: string) {
    const shaSum = crypto.createHash('sha1');
    shaSum.update([password, ':', salt].join(''));
    return shaSum.digest('base64');
}

async function checkUser (req: Request, res: Response, next: NextFunction) {
    await auth(req);
}

async function auth (req: Request) {
    const User = mongoose.model('User');
    const user = await User.findOne({username: req.body.username});

    if (user) {
        const hash = passwordHash(req.body.password, user.salt);
        delete req.body.password;

        if (hash === user.passwordHash) {
            return user;
        }
    }

    throw new Error('Forbidden');
}
