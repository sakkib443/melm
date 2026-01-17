// Drop the problematic text index and recreate course
const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://melm:melm@cluster0.b5kfivm.mongodb.net/melmDB?appName=Cluster0';

async function fixIndex() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected!');

        // Drop the text index on courses collection
        const db = mongoose.connection.db;
        const coursesCollection = db.collection('courses');

        console.log('Getting current indexes...');
        const indexes = await coursesCollection.indexes();
        console.log('Current indexes:', indexes.map(i => i.name));

        // Find and drop text index
        for (const index of indexes) {
            if (index.name && index.name.includes('text')) {
                console.log('Dropping text index:', index.name);
                await coursesCollection.dropIndex(index.name);
                console.log('Dropped!');
            }
        }

        console.log('Done!');
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

fixIndex();
