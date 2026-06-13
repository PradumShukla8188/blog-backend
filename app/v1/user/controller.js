const { UserModel } = require('../../../databaseModels/users');
const { RoleModel } = require('../../../databaseModels/role');
const { Roles } = require('../../../constants/roles');
const { hashPassword } = require('../../../helper/bcrypt');

module.exports = {
    getAllUsers: async (req, res) => {
        try {
            const users = await UserModel.find()
                .select('-password')
                .populate('roleId', 'name displayValue');
            return res.status(200).send({ message: 'Users fetched successfully.', data: users });
        } catch (err) {
            console.log('getAllUsers err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    getUserById: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await UserModel.findById(id)
                .select('-password')
                .populate('roleId', 'name displayValue');
            if (!user) {
                return res.status(404).send({ message: 'User not found.' });
            }
            return res.status(200).send({ message: 'User fetched successfully.', data: user });
        } catch (err) {
            console.log('getUserById err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    createUser: async (req, res) => {
        try {
            const { name, email, password, role } = req.body;
            const lowerEmail = email.toLowerCase();
            const userExists = await UserModel.findOne({ email: lowerEmail });
            if (userExists) {
                return res.status(400).send({ message: 'User already exists with this email.' });
            }

            const roleName = role === 'admin' ? Roles.Admin.name : Roles.User.name;
            const roleDoc = await RoleModel.findOne({ name: roleName });
            if (!roleDoc) {
                return res.status(400).send({ message: 'Role not found.' });
            }

            const user = await UserModel.create({
                name,
                email: lowerEmail,
                password: await hashPassword(password),
                roleId: roleDoc._id,
            });

            const userResponse = await UserModel.findById(user._id)
                .select('-password')
                .populate('roleId', 'name displayValue');

            return res.status(201).send({ message: 'User created successfully.', data: userResponse });
        } catch (err) {
            console.log('createUser err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, email, password, role } = req.body;
            const user = await UserModel.findById(id);
            if (!user) {
                return res.status(404).send({ message: 'User not found.' });
            }

            if (name) user.name = name;
            if (email) {
                const lowerEmail = email.toLowerCase();
                const existing = await UserModel.findOne({ email: lowerEmail, _id: { $ne: id } });
                if (existing) {
                    return res.status(400).send({ message: 'Email already in use.' });
                }
                user.email = lowerEmail;
            }
            if (password) {
                user.password = await hashPassword(password);
            }
            if (role) {
                const roleName = role === 'admin' ? Roles.Admin.name : Roles.User.name;
                const roleDoc = await RoleModel.findOne({ name: roleName });
                if (!roleDoc) {
                    return res.status(400).send({ message: 'Role not found.' });
                }
                user.roleId = roleDoc._id;
            }

            await user.save();
            const userResponse = await UserModel.findById(user._id)
                .select('-password')
                .populate('roleId', 'name displayValue');

            return res.status(200).send({ message: 'User updated successfully.', data: userResponse });
        } catch (err) {
            console.log('updateUser err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;
            if (req.user._id.toString() === id) {
                return res.status(400).send({ message: 'Cannot delete your own account.' });
            }
            const user = await UserModel.findByIdAndDelete(id);
            if (!user) {
                return res.status(404).send({ message: 'User not found.' });
            }
            return res.status(200).send({ message: 'User deleted successfully.' });
        } catch (err) {
            console.log('deleteUser err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    }
};
