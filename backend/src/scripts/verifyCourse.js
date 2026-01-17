// Verify course data in database
const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://melm:melm@cluster0.b5kfivm.mongodb.net/melmDB?appName=Cluster0';

async function verify() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected!\n');

        const db = mongoose.connection.db;

        // Check courses
        const courses = await db.collection('courses').find({}).toArray();
        console.log('=== COURSES ===');
        console.log('Total:', courses.length);
        for (const c of courses) {
            console.log(`\n📚 ${c.title}`);
            console.log(`   Slug: ${c.slug}`);
            console.log(`   Price: ৳${c.discountPrice} (Regular: ৳${c.price})`);
            console.log(`   Modules: ${c.totalModules}, Lessons: ${c.totalLessons}`);
            console.log(`   Status: ${c.status}`);
        }

        // Check modules
        const modules = await db.collection('modules').find({}).toArray();
        console.log('\n\n=== MODULES ===');
        console.log('Total:', modules.length);
        for (const m of modules) {
            console.log(`  📦 ${m.order}. ${m.title}`);
        }

        // Check lessons
        const lessons = await db.collection('lessons').find({}).toArray();
        console.log('\n\n=== LESSONS ===');
        console.log('Total:', lessons.length);
        for (const l of lessons) {
            console.log(`  📖 ${l.order}. ${l.title} (${l.isFree ? 'FREE' : 'Paid'})`);
        }

        console.log('\n✅ Verification complete!');

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

verify();
