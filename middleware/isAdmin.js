const { Roles } = require('../constants/roles');

const isAdmin = (req, res, next) => {
    try {
        const user = req.user;
        if (user && user.roleId && user.roleId.name === Roles.Admin.name) {
            next();
            return;
        }
        return res.status(401).send({ message: 'Unauthorized access.' });
    } catch (err) {
        next(err);
    }
};

module.exports = { isAdmin };
