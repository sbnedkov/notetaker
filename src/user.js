var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    passwordHash: String,
    salt: String
});

module.exports = mongoose.model('User', userSchema);

console.log('User model registered.');
