var async = require('async');
var fs = require('fs');
var parseString = require('xml2js').parseString;


module.exports = function (evernoteStream, callback) {
    var buffers = [];
    evernoteStream.on('data', function (chunk) {
        buffers.push(chunk);
    });

    evernoteStream.on('end', function () {
        parseString(Buffer.concat(buffers).toString(), function (err, json) {
            if (err) {
                return callback(err);
            }

            async.map(json['en-export'].note, function (entry, cb) {
                entry.content = JSON.stringify(entry.content).match(/<\?xml.*<en-note>(.*)<\/en-note>/)[1];
                cb(null, entry);
            }, callback);
        });
    });
};
