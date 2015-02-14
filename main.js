var _ = require('lodash');
var path = require('path');
var express = require('express');
var jade = require('jade');
var bodyParser = require('body-parser');
var session = require('express-session');
var async = require('async');

var environment = process.env.NODE_ENV;
var config = require('./config/config.json')[environment];

var utils = require('./src/utils');
var db = require('./src/db')(config);
var Note = require('./src/note');

var checkUser = require('./src/middleware').checkUser;
var checkNoUser = require('./src/middleware').checkNoUser;

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/components', express.static(path.join(__dirname, 'bower_components')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: config.session,
    resave: false,
    saveUninitialized: false
}));

app.get('/login', checkNoUser, function (req, res) {
    res.render('login.jade');
});

app.post('/login', checkNoUser, function (req, res) {
    utils.loginUser(req, res);
});

app.get('/logout', checkUser, function (req, res) {
    utils.logoutUser(req, res);
});

app.get('/register', checkNoUser, function (req, res) {
    res.render('register.jade');
});

app.post('/register', checkNoUser, function (req, res) {
    utils.registerUser(req, res);
});

app.get('/', checkUser, function (req, res) {
    res.render('main.jade');
});

app.get('/shownote/:id', checkUser, function (req, res) {
    res.render('note.jade', {
        noteid: req.params.id
    });
});

app.get('/note', checkUser, function (req, res) {
    Note.find({user_id: req.session.user}).sort({'creation_date': 1}).exec(function (err, notes) {
        if (err) {
            return res.send(500, {err: err});
        }
        res.json(notes);
    });
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
    var note = new Note({
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
        _.extend(note, {
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

app.listen(config.port || process.argv[2]);
