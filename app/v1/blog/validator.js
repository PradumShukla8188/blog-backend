const {body, param, query, validationResult} = require('express-validator');

function validator(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

module.exports = {
    createBlogValidator: [
        body('title').notEmpty().withMessage('Title is required'),
        body('content').notEmpty().withMessage('Content is required'),
        validator
    ],
    updateBlogValidator: [
        param('id').isMongoId().withMessage('Valid blog ID is required'),
        body('title').optional().notEmpty().withMessage('Title cannot be empty'),
        body('content').optional().notEmpty().withMessage('Content cannot be empty'),
        body('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive'),
        validator
    ],
    deleteBlogValidator: [
        param('id').isMongoId().withMessage('Valid blog ID is required'),
        validator
    ],
    getBlogByIdValidator: [
        param('id').isMongoId().withMessage('Valid blog ID is required'),
        validator
    ]
    }