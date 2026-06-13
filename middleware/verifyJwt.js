const { verifyToken } = require('../helper/jwt');
const { UserModel } = require('../databaseModels/users');

module.exports = {
    verifyTokenMiddleware: async (req, res, next) => {
        try {
            const authHeader = req.headers['authorization'];
            if (!authHeader) {
                return res.status(401).json({ message: 'Authorization header missing' });
            }
            const token = authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Token missing' });
            }
            const decoded = verifyToken(token);
            if (!decoded) {
                return res.status(401).json({ message: 'Invalid token' });
            }
            const user = await UserModel.findById(decoded.id).populate('roleId');
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }
            req.user = user;
            next();
        } catch (err) {
            return res.status(500).send({ message: 'Internal server error' });
        }
    }
};
