module.exports = {
    checkUser: function (req, res, next) {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        next();
    },

    checkNoUser: function (req, res, next) {
        if (req.session.user) {
            return res.redirect('/');
        }

        next();
    },

    forbidHttp: function (req, res, next) {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.status(403);
        }

        next();
    }
};
