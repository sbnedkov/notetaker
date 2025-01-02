import crypto from 'crypto';

import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

const User = mongoose.model('User');
export default {
    loginUser: async function (req: Request, res: Response) {
        const user = await auth(req);

        if (user) {
            req.session.user = user._id;
            res.redirect('/');
        } else {
            res.sendStatus(401);
        }
    },

    logoutUser: function (req: Request, res: Response) {
        delete req.session.user;
        res.redirect('/login');
    },
};

function passwordHash (password: string, salt: string) {
    var shaSum = crypto.createHash('sha1');
    shaSum.update([password, ':', salt].join(''));
    return shaSum.digest('base64');
}

async function checkUser (req: Request, res: Response, next: NextFunction) {
    await auth(req);
}

async function auth (req: Request) {
    const user = await User.findOne({username: req.body.username});

    if (user) {
        var hash = passwordHash(req.body.password, user.salt);
        delete req.body.password;

        if (hash === user.passwordHash) {
            return user;
        }
    }

    throw new Error('Forbidden');
}
