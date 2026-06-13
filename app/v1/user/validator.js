const { body, param, validationResult } = require('express-validator');

function validator(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

module.exports = {
    createUserValidator: [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('role').isIn(['admin', 'user']).withMessage('Role must be admin or user'),
        validator
    ],
    updateUserValidator: [
        param('id').isMongoId().withMessage('Valid user ID is required'),
        body('name').optional().notEmpty().withMessage('Name cannot be empty'),
        body('email').optional().isEmail().withMessage('Valid email is required'),
        body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('role').optional().isIn(['admin', 'user']).withMessage('Role must be admin or user'),
        validator
    ],
    getUserByIdValidator: [
        param('id').isMongoId().withMessage('Valid user ID is required'),
        validator
    ],
    deleteUserValidator: [
        param('id').isMongoId().withMessage('Valid user ID is required'),
        validator
    ]
};
