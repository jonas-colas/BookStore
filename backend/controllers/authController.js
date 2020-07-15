const User = require('../models/userModel');
const jwt = require('jsonwebtoken'); // to generate logged token
const expressJwt = require('express-jwt'); // for authorization check


exports.signup = (req, res, next) => {
	User.find({email: req.body.email}).exec().then(user => {
		if (user.length >= 1) {
			return res.status(409).json({
				message: 'Email already exist!'
			});
		}else{
			const user = new User(req.body);
			user.save().then(user => {
				//console.log(user);
				user.salt = undefined;
				user.hashed_password = undefined;
				res.status(201).json({
					user,
					message: 'User created successfully!'
				});
			}).catch(err =>{
				res.status(500).json({
					error: err
				});
			});
		}
	});
}

exports.login = (req, res, next) => {
	const {email, password}  = req.body;
	User.findOne({email}, (err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "User with that email does not exist. Please signup !"
			});
		}
		//if user is found make sure the email and password match
		//create authenticate method in user model
		if (!user.authenticate(password)) {
			return res.status(401).json({
				error: "Email and password dont match"
			});
		}

		//generate a signed token with her secret
		const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
		
		//persist the token as 't' in cookie with expiry date
		res.cookie('t', token, {expire: new Date() + 9999});

		//return response with user and token to frontend client
		const {_id, name, email, role} = user;
		return res.json({token, user: {_id, email, name, role}});

	});
}


exports.logout = (req, res) => {
	res.clearCookie('t');
	res.json({message: 'Sign out successfully!'});
}

exports.requireLogin = expressJwt({
	secret: process.env.JWT_SECRET,
	userProperty: 'auth'
})

exports.isAuth = (req, res, next) => {
	let user = req.profile && req.auth && req.profile._id == req.auth._id;
	if (!user) {
		return res.status(403).json({
			error: 'Access denied'
		})
	}
	next();
}

exports.isAdmin = (req, res, next) => {
	if (req.profile.role === 0) {
		return res.status(403).json({
			error: 'Admin resource ! Access denied'
		})
	}
	next();
}