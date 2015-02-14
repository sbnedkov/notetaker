var crypto = require('crypto');

var User = require('./user');

module.exports = {
    loginUser: function (req, res) {
        checkUser(req, res, function (err, user) {
            if (err) {
                return res.sendStatus(500, {err: err});
            }

            if (user) {
                req.session.user = user._id;
                res.redirect('/');
            } else {
                res.sendStatus(401);
            }
        });
    },

    logoutUser: function (req, res) {
        delete req.session.user;
        res.redirect('/login');
    },

    registerUser: function (req, res) {
        User.findOne({username: req.body.username}, function (err, u) {
            if (u) {
                return res.sendStatus(409, {err: 'Username taken'});
            }

            var salt = Math.round(Math.random() * 1e12).toString(36);
            var user = new User({
                username: req.body.username,
                passwordHash: passwordHash(req.body.password, salt),
                salt: salt
            });

            delete req.body.password;

            user.save(function (err, user) {
                if (err) {
                    return res.redirect('/login');
                }

                req.session.user = user._id;
                res.redirect('/');
            });
        });
    }
};

function passwordHash (password, salt) {
    var shaSum = crypto.createHash('sha1');
    shaSum.update([password, ':', salt].join(''));
    return shaSum.digest('base64');
}

function checkUser (req, res, callback) {
    User.findOne({username: req.body.username}, function (err, user) {
        if (err) {
            return callback(err);
        }

        if (user) {
            var hash = passwordHash(req.body.password, user.salt);
            delete req.body.password;

            if (hash === user.passwordHash) {
                return callback(null, user);
            }

            callback();
        } else {
            callback();
        }
    });
}
