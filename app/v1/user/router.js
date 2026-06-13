const express = require('express');
const router = express.Router();
const controller = require('./controller');
const {
    createUserValidator,
    updateUserValidator,
    getUserByIdValidator,
    deleteUserValidator
} = require('./validator');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');
const { isAdmin } = require('../../../middleware/isAdmin');

router.use(verifyTokenMiddleware, isAdmin);

router.get('/', controller.getAllUsers);
router.get('/:id', getUserByIdValidator, controller.getUserById);
router.post('/', createUserValidator, controller.createUser);
router.patch('/:id', updateUserValidator, controller.updateUser);
router.delete('/:id', deleteUserValidator, controller.deleteUser);

module.exports = router;
