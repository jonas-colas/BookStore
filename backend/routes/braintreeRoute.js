const express = require('express');
const router = express.Router();

const {requireLogin, isAuth} = require('../controllers/authController');
const {userById} = require('../controllers/userController');
const {generateToken, processPayment} = require('../controllers/braintreeController');

router.get('/braintree/getToken/:userId', requireLogin, isAuth, generateToken);
router.post('/braintree/payment/:userId', requireLogin, isAuth, processPayment);

router.param('userId', userById);

module.exports = router;