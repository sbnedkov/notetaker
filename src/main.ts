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

import db from './db';
import { loginUser, logoutUser, csrf, checkCsrf } from './utils';
import { checkUser } from './middleware';

async function init() {
    if (!process.env.cookieSecret || !process.env.sessionSecret) {
        throw new Error('Please supply env variables "cookieSecret", "sessionSecret".');
    }

    const app = express();

    const mongooseClient = await db({ dburi: process.env.dburi });
    const User = mongoose.model('User');
    const Note = mongoose.model('Note');

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'pug');

    app.use(cors({
        allowedOrigins: [
            'notetaker.sbnedkov.com',
        ]
    }));
    app.use(morgan('combined'));
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
    app.use(csrf());
    app.use(checkCsrf());

    app.post('/login', loginUser);

    app.get('/logout', checkUser, logoutUser);

    app.get('/', checkUser, function (req, res) {
        res.render('main.pug');
    });

    app.get('/shownote/:id', checkUser, function (req, res) {
        res.render('note.pug', {
            noteid: req.params.id
        });
    });

    app.get('/note', checkUser, async function (req, res) {
        const notes = await Note.find({ user_id: req.session.user }).sort({ creation_date: 1 });
        res.json(notes);
    });

    app.get('/note/:id', checkUser, async function (req, res) {
        const note = await Note.findOne({ user_id: req.session.user, _id: req.params.id });
        res.json(note);
    });

    app.post('/note', checkUser, async function (req, res) {
        const note = new Note({
            user_id: req.session.user
        });
        await note.save();
        res.redirect(['/shownote/', note._id].join(''));
    });

    app.post('/note/:id', checkUser, async function (req, res) {
        const note = await Note.findOne({ _id: req.params.id, user_id: req.session.user });
        if (!note) {
            throw new Error('Could not create note.');
        }
        Object.assign(note, {
            title: req.body.title || note.title,
            content: req.body.content || note.content,
            tags: req.body.tags || note.tags
        });
        await note.save();
        res.sendStatus(200);
    });

    app.delete('/note/:id', checkUser, async function (req, res) {
        const note = await Note.findOne({ _id: req.params.id, user_id: req.session.user });
        if (!note) {
            throw new Error('Could not find note.');
        }
        await note.deleteOne();
        res.sendStatus(200);
    });

    const port = process.env.PORT || process.argv[2];
    app.listen(port, () => console.log(`Server listening on ${port}.`));
}
init().then(() => console.log('Initialization of server done.')).catch(console.error);
