import mongoose from 'mongoose';

export default function user () {
    const userSchema = new mongoose.Schema({
        username: String,
        passwordHash: String,
        salt: String
    });

    console.log('User model registered.');

    return mongoose.model('User', userSchema);
}
