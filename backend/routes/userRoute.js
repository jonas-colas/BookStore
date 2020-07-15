const express = require('express');
const router = express.Router();

const {requireLogin, isAuth, isAdmin} = require('../controllers/authController');
const {userById, getProfile, updateProfile, purchaseHistory} = require('../controllers/userController');

router.get('/secret/:userId', requireLogin, isAuth, isAdmin, (req, res) => {
	res.json({
		user: req.profile
	});
});

router.get('/user/:userId', requireLogin, isAuth, getProfile);
router.put('/user/:userId', requireLogin, isAuth, updateProfile);
router.get('/orders/by/user/:userId', requireLogin, isAuth, purchaseHistory);

router.param('userId', userById);
//router.post('/signup', userSignupValidator, signup);


module.exports = router;