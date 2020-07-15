const express = require('express');
const router = express.Router();

const {signup, login, logout, requireLogin} = require('../controllers/authController');
const {userSignupValidator} = require('../validator/');

router.post('/signup', userSignupValidator, signup);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;