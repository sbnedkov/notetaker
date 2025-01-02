import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import multiparty from 'multiparty';
import session from 'express-session';
import cors from 'express-cors';
import async from 'async';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import csurf from 'tiny-csrf';
import MongoStore from 'connect-mongo';

import db from './db';
import utils from './utils';
import Note from './note';
import { checkUser, checkNoUser } from './middleware';

const mongooseClient = await db(process.env);
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors({
    allowedOrigins: [
        'notetaker.sbnedkov.com'
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

app.use(csurf(
    process.env.csurfSecret,
));

app.get('/login', checkNoUser, function (req, res) {
    res.render('login.pug');
});

app.post('/login', checkNoUser, function (req, res) {
    utils.loginUser(req, res);
});

app.get('/logout', checkUser, function (req, res) {
    utils.logoutUser(req, res);
});

app.get('/register', checkNoUser, function (req, res) {
    res.render('register.pug');
});

app.post('/register', checkNoUser, function (req, res) {
    utils.registerUser(req, res);
});

app.get('/', checkUser, function (req, res) {
    res.render('main.pug');
});

app.get('/shownote/:id', checkUser, function (req, res) {
    res.render('note.pug', {
        noteid: req.params.id
    });
});

app.get('/note', checkUser, async function (req, res) {
    const notes = await Note.find({user_id: req.session.user}).sort({creation_date: 1});
    res.json(notes);
});

app.get('/note/:id', checkUser, function (req, res) {
    Note.findOne({user_id: req.session.user, _id: req.params.id}, function (err, note) {
        if (err) {
            return res.send(500, {err: err});
        }
        res.json(note);
    });
});

app.post('/note', checkUser, function (req, res) {
    const note = new Note({
        user_id: req.session.user
    });

    note.save(function (err) {
        if (err) {
            return res.send(500, {err: err});
        }

        res.redirect(['/shownote/', note._id].join(''));
    });
});

app.post('/note/:id', checkUser, function (req, res) {
    async.waterfall([function (cb) {
        Note.findOne({_id: req.params.id, user_id: req.session.user}, cb);
    }, function (note, cb) {
        Object.assign(note, {
            title: req.body.title || note.title,
            content: req.body.content || note.content,
            tags: req.body.tags || note.tags
        });
        note.save(cb);
    }], function (err) {
        if (err) {
            return res.status(500).send({err: err});
        }

        return res.sendStatus(200);
    });
});

app.delete('/note/:id', checkUser, function (req, res) {
    async.waterfall([function (cb) {
        Note.findOne({_id: req.params.id, user_id: req.session.user}, cb);
    }, function (note, cb) {
        note.remove(cb);
    }], function (err) {
        if (err) {
            return res.status(500).send({err: err});
        }

        return res.sendStatus(200);
    });
});

app.listen(process.env.PORT || process.argv[2]);
