const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    displayValue: {
        type: String,
        required: true,
        trim:true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = {RoleModel :mongoose.model('Role', RoleSchema)};