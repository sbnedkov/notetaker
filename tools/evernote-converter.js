var _ = require('lodash');
var async = require('async');
var fs = require('fs');
var parseString = require('xml2js').parseString;


module.exports = function (evernoteStream, callback) {
    evernoteStream.on('data', function (chunk) {
        parseString(chunk, function (err, json) {
            if (err) {
                return console.log(err);
            }

            async.map(json['en-export'].note, function (entry, cb) {
                entry.content = JSON.stringify(entry.content).match(/<\?xml.*<en-note>(.*)<\/en-note>/)[1];
                cb(null, entry);
            }, callback);
        });
    });
};
