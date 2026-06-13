var express = require('express');
var router = express.Router();
const onBoardingRouter = require('../app/v1/onBoarding/router');
const blogRouter = require('../app/v1/blog/router');
const userRouter = require('../app/v1/user/router');

router.use('/onBoarding', onBoardingRouter);
router.use('/blog', blogRouter);
router.use('/users', userRouter);

module.exports = router;
