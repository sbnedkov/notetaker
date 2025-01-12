import crypto from 'crypto';

import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

export async function loginUser (req: Request, res: Response) {
    try {
        const user = await auth(req);

        if (user) {
            req.session.user = user._id;
            res.json({ ok: true });
        } else {
            res.sendStatus(401);
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(401);
    }
}

export function logoutUser (req: Request, res: Response) {
    delete req.session.user;
    res.json({ ok: true });
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
