var async = require('async');
var converter = require('./evernote-converter');
var moment = require('moment');
var mongoose = require('mongoose');

var Note = require(__dirname + '/../src/note');

module.exports = function (istream, userId, callback) {
    converter(istream, function (err, notes) {
        if (err) {
            return callback(err);
        }

        async.each(notes, function (note, cb) {
            var date = note.created.toString().match(/([0-9]{4})([0-9]{2})([0-9]{2})T([0-9]{2})([0-9]{2})([0-9]{2})Z/);
            var isoString = [date[1], '-', date[2], '-', date[3], 'T', date[4], ':', date[5], ':', date[6], '.000Z'].join('');
            var newNote = new Note({
                user_id: userId,
                title: note.title,
                content: note.content,
                creation_date: moment(isoString).toDate(),
                tags: note.tag
            });

            newNote.save(function (err) {
                cb(null);
            });
        }, function (err) {
            if (err) {
                return callback(err);
            }
        });
    });
};
