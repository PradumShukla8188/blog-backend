const jwt = require('jsonwebtoken');
const { config } = require('../config');

const getJwtSecret = () => {
  return config.env?.jwt?.secret || global.secret || 'blogs';
};

module.exports = {
    generateToken: (payload) => {
        const secret = getJwtSecret();
        const safePayload = {
            id: payload.id?.toString ? payload.id.toString() : String(payload.id),
            role: payload.role,
        };
        return jwt.sign(safePayload, secret, { expiresIn: '7d' });
    },

    verifyToken: (token) => {
        try {
            return jwt.verify(token, getJwtSecret());
        } catch (err) {
            console.error('Error verifying token:', err);
            return null;
        }
    }
};
