import 'source-map-support/register'

import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from 'express-cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import { doubleCsrf } from 'csrf-csrf';

import db from './db';
import { ACCESS_DENIED, FORBIDDEN, checkUser, errorHandler, loginUser, logoutUser } from './utils';

async function init() {
    if (!process.env.cookieSecret || !process.env.sessionSecret || !process.env.csrfSecret) {
        throw new Error('Please supply env variables "cookieSecret", "sessionSecret" and "csrfSecret".');
    }
    const csrfSecret = process.env.csrfSecret

    const app = express();

    const mongooseClient = await db({ dburi: process.env.dburi });
    const User = mongoose.model('User');
    const Note = mongoose.model('Note');

    const {
        generateToken,
        doubleCsrfProtection,
    } = doubleCsrf({
        getSecret: () => csrfSecret,
        cookieName: 'x-csrf-token',
        cookieOptions: {
            sameSite: 'lax',
            secure: process.env.NODE_ENV !== 'dev',
        },
    })

    app.use(morgan('combined'));
    app.use(cors({
        allowedOrigins: [
            'http://localhost:4200',
            'https://notetaker.sbnedkov.com',
        ],
        allowedMethods: [
            'POST',
            'PUT',
            'DELETE',
        ],
        headers: [
            'X-Requested-With',
            'Content-Type',
            'X-Csrf-Token',
        ],
    }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(cookieParser(process.env.cookieSecret));
    app.use(session({
        secret: process.env.sessionSecret,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ client: mongooseClient }),
    }));
    app.get('/csrf', function (req, res) {
        const csrf = generateToken(req, res);
        res.json(csrf)
    })
    app.use(doubleCsrfProtection);

    app.post('/login', loginUser);
    app.get('/logout', checkUser, logoutUser);

    app.get('/notes', checkUser, async function (req, res) {
        const notes = await Note.find({ user_id: req.session.user }).sort({ creation_date: 1 });
        res.json(notes);
    });

    app.get('/notes/:id', checkUser, async function (req, res) {
        const note = await Note.findOne({ user_id: req.session.user, _id: req.params.id });
        res.json(note);
    });

    app.post('/notes', checkUser, async function (req, res) {
        const note = new Note({
            user_id: req.session.user
        });
        await note.save();
        res.json(note._id);
    });

    app.put('/notes', checkUser, async function (req, res) {
        const note = await Note.findOne({ _id: req.body._id, user_id: req.session.user });
        if (!note) {
            throw new Error('Could not create note.');
        }
        Object.assign(note, {
            title: req.body.title || note.title,
            content: req.body.content || note.content,
            tags: req.body.tags || note.tags
        });
        await note.save();
        res.json({ ok: true });
    });

    app.delete('/notes/:id', checkUser, async function (req, res) {
        const note = await Note.findOne({ _id: req.params.id, user_id: req.session.user });
        if (!note) {
            throw new Error('Could not find note.');
        }
        await note.deleteOne();
        res.json({ ok: true });
    });

    app.use(errorHandler);

    const port = process.env.PORT || process.argv[2];
    app.listen(port, () => console.log(`Server listening on ${port}.`));
}

init().then(() => console.log('Initialization of server done.')).catch(console.error);
