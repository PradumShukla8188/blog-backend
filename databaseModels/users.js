const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    roleId: {
        type: mongoose.Types.ObjectId,
        ref: 'Role',
        required: true
        }
    }, { timestamps: true });

module.exports = {UserModel :mongoose.model('User', UserSchema)};