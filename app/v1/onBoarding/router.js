const express = require('express');
const router = express.Router();
const controller = require('./controller');
const {registerValidator, loginValidator} = require('./validator');

router.post('/register', registerValidator, controller.register);
router.post('/login', loginValidator, controller.login);

module.exports = router;