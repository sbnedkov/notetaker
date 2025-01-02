import mongoose from 'mongoose';

export default function note () {
    const noteSchema = new mongoose.Schema({
        user_id: {type: mongoose.Schema.ObjectId},
        title: {type: String, default: ''},
        content: {type: String, default: ''},
        creation_date: {type: Date, default: Date.now},
        tags: [String]
    });

    console.log('Note model registered.');

    return mongoose.model('Note', noteSchema);
}
