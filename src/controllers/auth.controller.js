"use strict";
const authServices = require("../services/auth.services");
const userServices = require("../services/user.services")


/**
 * @route POST  '/auth/token'
 * @desc Generate user auth token
 * @access Public
 */
const token = async (req, res, next) => {
	try {
		const username = req.body.username;
		const password = req.body.password;
		console.log(username, password)
		const token = await authServices.getToken(username, password);

		return res.json({ token });
	} catch(err){
		return next(err);
	};
	
};

/**
 * @route POST  '/auth/register'
 * @desc Register a new user
 * @access Public
 */
const register = async (req, res, next) => {
	try{
		const newUserInfo = req.body;
		const user = await userServices.createUser(newUserInfo);
		const token = await authServices.generateToken(user);

		return res.status(201).json({ token, user });
	} catch(err){
		return next(err);
	};
};

/**
 * @route GET 'auth/check/username'
 * @desc Check if a username already exists
 * @access Public
 */
const checkUsername = async(req,res,next) => {
	try{
		const usernameToCheck = req.query.username;
		const usernameExists = await userServices.checkIfUserExists(usernameToCheck);
		return res.json({usernameExists});
	} catch(err){
		return next(err);
	};
};

/**
 * @route GET 'auth/check/email
 * @desc Check if email address is already in use.
 * @access Public
 */
const checkEmail = async(req,res,next) => {
	try{
		const emailToCheck = req.query.email;
		const emailExists = await userServices.checkIfEmailExists(emailToCheck);
		return res.json({emailExists});
	} catch(err){
		return next(err);
	};
};

module.exports = {
	token,
	register,
	checkUsername,
	checkEmail
};