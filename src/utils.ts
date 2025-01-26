import crypto from 'crypto';

import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

export const FORBIDDEN = 'Forbidden';
export const ACCESS_DENIED = 'Access Denied';

export async function loginUser (req: Request, res: Response, next: NextFunction) {
    const user = await auth(req);

    if (user) {
        req.session.user = user._id;
        res.json({ ok: true });
    } else {
        next(new Error(ACCESS_DENIED));
    }
}

export function logoutUser (req: Request, res: Response, next: NextFunction) {
    req.session.user = '';
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }

        req.session.regenerate(function (err) {
            if (err) {
                next(err)
            }

            res.json({ ok: true });
        });
    });
}

function passwordHash (password: string, salt: string) {
    const shaSum = crypto.createHash('sha1');
    shaSum.update([password, ':', salt].join(''));
    return shaSum.digest('base64');
}

export async function checkUser (req: Request, res: Response, next: NextFunction) {
    if (req.session.user) {
        return next();
    }

    next(new Error(FORBIDDEN));
}

async function auth (req: Request) {
    const User = mongoose.model('User');
    const user = await User.findOne({ username: req.body.username });

    if (user) {
        const hash = passwordHash(req.body.password, user.salt);
        delete req.body.password;

        if (hash === user.passwordHash) {
            return user;
        }
    }
}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    switch (err.message) {
        case ACCESS_DENIED:
            res.status(401);
        break;
        case FORBIDDEN:
            res.status(403);
        break;
        default:
            res.status(500);
    }

    res.end();
}
