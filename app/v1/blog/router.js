const express = require('express');
const router = express.Router();
const controller = require('./controller');
const {
    createBlogValidator,
    updateBlogValidator,
    deleteBlogValidator,
    getBlogByIdValidator
} = require('./validator');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');

router.get('/', controller.getAllBlogs);
router.get('/active', controller.getActiveBlogs);
router.get('/my', verifyTokenMiddleware, controller.getAllBlogsByUser);
router.get('/:id', getBlogByIdValidator, controller.getBlogById);
router.post('/', verifyTokenMiddleware, createBlogValidator, controller.createBlog);
router.patch('/:id', verifyTokenMiddleware, updateBlogValidator, controller.updateBlog);
router.delete('/:id', verifyTokenMiddleware, deleteBlogValidator, controller.deleteBlog);

module.exports = router;
