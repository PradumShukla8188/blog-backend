const { Roles } = require('../constants/roles');
const { UserModel } = require('../databaseModels/users');
const { RoleModel } = require('../databaseModels/role');
const { hashPassword } = require('../helper/bcrypt');

const DEFAULT_PASSWORD = 'User@123';

const defaultUsers = [
    { name: 'John Smith', email: 'john@yopmail.com' },
    { name: 'Jane Doe', email: 'jane@yopmail.com' },
    { name: 'Mike Wilson', email: 'mike@yopmail.com' },
    { name: 'Sara Patel', email: 'sara@yopmail.com' },
    { name: 'David Lee', email: 'david@yopmail.com' },
];

async function createUsers() {
    try {
        const userRole = await RoleModel.findOne({ name: Roles.User.name });
        if (!userRole) {
            return Promise.reject(new Error('User role not found. Please run role seeder first.'));
        }

        const hashedPassword = await hashPassword(DEFAULT_PASSWORD);
        let created = 0;

        for (const userData of defaultUsers) {
            const exists = await UserModel.findOne({ email: userData.email });
            if (exists) {
                console.log(`User already exists: ${userData.email}`);
                continue;
            }

            await UserModel.create({
                name: userData.name,
                email: userData.email,
                password: hashedPassword,
                roleId: userRole._id,
            });
            created++;
            console.log(`User created: ${userData.email}`);
        }

        console.log(`User seeding done. ${created} new user(s) added.`);
        console.log(`Default password for all users: ${DEFAULT_PASSWORD}`);
    } catch (err) {
        console.error('Error creating users:', err);
        return Promise.reject(err);
    }
}

module.exports = { createUsers, defaultUsers, DEFAULT_PASSWORD };
