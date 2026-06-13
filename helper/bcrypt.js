const bcrypt = require('bcryptjs');

const saltRounds = 10;

module.exports = {
    hashPassword: async (password) => {
        try {
            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(password, salt);
            return hash;
        } catch (err) {
            console.error('Error hashing password:', err);
            throw err;
        }
    },
    comparePassword: async (password, hash) => {
        try {
            const match = await bcrypt.compare(password, hash);
            return match;
        } catch (err) {
            console.error('Error comparing password:', err);
            throw err;
        }
    }
};
