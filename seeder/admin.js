const { Roles } = require('../constants/roles');
const { UserModel } = require('../databaseModels/users');
const { RoleModel } = require('../databaseModels/role');
const { hashPassword } = require('../helper/bcrypt');

async function createAdminUser() {
    try {
        const adminRole = await RoleModel.findOne({ name: Roles.Admin.name });
        if (!adminRole) {
            return Promise.reject(new Error('Admin role not found. Please create the admin role first.'));
        }

        const existingAdmin = await UserModel.findOne({ email: 'admin12@yopmail.com' });
        if (existingAdmin) {
            console.log('Admin user already exists.');
            return;
        }

        const adminData = {
            name: 'Admin',
            email: 'admin12@yopmail.com',
            password: await hashPassword('Admin@123'),
            roleId: adminRole._id,
        };
        await UserModel.create(adminData);
        console.log('Admin user created successfully.');
    } catch (err) {
        console.error('Error creating admin user:', err);
        return Promise.reject(err);
    }
}

module.exports = { createAdminUser };
