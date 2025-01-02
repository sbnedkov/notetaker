import mongoose from 'mongoose';

import note from './note';
import user from './user';

export default async function db({ dburi }: { dburi: string|undefined }) {
    if (!dburi) {
        throw new Error('Please supply a "dburi" env variable');
    }
    await mongoose.connect(dburi);
    const db = mongoose.connection;
    db.on('error', console.error);

    return db.getClient();
};

