var async = require('async');
var fs = require('fs');
var converter = require('./evernote-converter');
var moment = require('moment');
var mongoose = require('mongoose');

var environment = process.env.NODE_ENV;
var config = require(__dirname + '/../config/config.json')[environment];
var db = require(__dirname + '/../src/db')(config);

var Note = require(__dirname + '/../src/note');

var istream = fs.createReadStream(__dirname + '/../evernote/input/My Notes.enex');

converter(istream, function (err, notes) {
    if (err) {
        return console.log(err);
    }

    console.log(notes.length + ' notes found');
    async.each(notes, function (note, cb) {
        var date = note.created.toString().match(/([0-9]{4})([0-9]{2})([0-9]{2})T([0-9]{2})([0-9]{2})([0-9]{2})Z/);
        var isoString = [date[1], '-', date[2], '-', date[3], 'T', date[4], ':', date[5], ':', date[6], '.000Z'].join('');
        var newNote = new Note({
            user_id: '54d789171b0a56354720a502',
            title: note.title,
            content: note.content,
            creation_date: moment(isoString).toDate(),
            tags: note.tag
        });

        newNote.save(function (err) {
            cb(null, note.title + ' saved.');
        });
    }, function (err) {
        if (err) {
            return console.log(err);
        }

        mongoose.disconnect();
    });
});
