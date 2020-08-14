var mongoose = require('mongoose');

module.exports = function (config) {
    mongoose.connect(config.dburi);

    var db = mongoose.connection;

    db.on('error', console.error);

    db.on('open', function () {
        require('./note');
        require('./user');
    });
};
