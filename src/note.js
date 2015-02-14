var mongoose = require('mongoose');

var noteSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.ObjectId},
    title: {type: String, default: ''},
    content: {type: String, default: ''},
    creation_date: {type: Date, default: Date.now},
    tags: [String]
});

module.exports = mongoose.model('Note', noteSchema);

console.log('Note model registered.');
