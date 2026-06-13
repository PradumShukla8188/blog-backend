const mongoose = require('mongoose');
const DB = require('../connection');
const { createRoles } = require('./role');
const { createAdminUser } = require('./admin');
const { createUsers } = require('./user');
const { createBlogs } = require('./blog');

async function seedDatabase() {
    try {
        await DB.connect();
        await createRoles();
        await createAdminUser();
        await createUsers();
        await createBlogs();
        console.log('Database seeded successfully.');
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
}

seedDatabase();
