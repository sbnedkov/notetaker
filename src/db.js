var mongoose = require('mongoose');

module.exports = function (config) {
    var db = mongoose.connection;

    db.on('error', console.error);

    db.on('open', function () {
        require('./note');
        require('./user');
    });

    mongoose.connect(config.dburi);
};
