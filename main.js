var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var multiparty = require('multiparty');
var session = require('express-session');
var async = require('async');

// var environment = process.env.NODE_ENV;

require('./src/db')(process.env);
var utils = require('./src/utils');
var Note = require('./src/note');

var evernote = require('./tools/evernote-driver');

var checkUser = require('./src/middleware').checkUser;
var checkNoUser = require('./src/middleware').checkNoUser;
// var forbidHttp = require('./src/middleware').forbidHttp;

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: process.env.sessionsecret,
    resave: false,
    saveUninitialized: false
}));

// if (environment === 'production') {
//     app.use(forbidHttp);
// }

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

app.get('/note', checkUser, function (req, res) {
    Note.find({user_id: req.session.user}).sort({creation_date: 1}).exec(function (err, notes) {
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

app.post('/evernote', checkUser, function (req, res) {
    var form = new multiparty.Form();

    form.on('part', function (part) {
        if (part.name === 'enex') {
            evernote(part, req.session.user, function (err) {
                if (err) {
                    return console.log(err);
                }
            });
        }

        part.on('error', function (err) {
            if (err) {
                return console.log(err);
            }
        });
    });

    form.on('error', function (err) {
        return res.status(500).send({err: err});
    });

    form.on('close', function () {
        return res.redirect('/');
    });

    form.parse(req);
});

app.listen(process.env.PORT || process.argv[2]);
