"use strict";
const { BadRequestError } = require("../expressError");
const authServices = require("../services/auth.services");
const tokenServices = require("../services/token.services");
const userServices = require("../services/user.services")

/** Handles "auth/token" route
 *	sends json response
	{ "token" : <token string> }
*/
const token = async (req, res, next) => {
	try {
		const username = req.body.username;
		const password = req.body.password;
		const token = await authServices.getToken(username, password);

		return res.json({ token })
	} catch(err){
		return next(err)
	}
	
}

/** Handles auth/register route.
 * 	Allows new user to register
 * 	sends json response
 * { "token" : <token string> }
 */
const register = async (req, res, next) => {
	try{
		const newUserInfo = req.body
		const user = await userServices.createUser(newUserInfo);
		const token = tokenServices.generateToken(user);

		return res.status(201).json({ token })
	} catch(err){
		return next(err)
	}
}

const checkUsername = async(req,res,next) => {
	try{
		const usernameToCheck = req.query.username
		const usernameExists = await userServices.checkIfUserExists(usernameToCheck)
		return res.json({usernameExists})
	} catch(err){
		return next(err)
	}
}

const checkEmail = async(req,res,next) => {
	try{
		const emailToCheck = req.query.email
		const emailExists = await userServices.checkIfEmailExists(emailToCheck)
		return res.json({emailExists})
	} catch(err){
		return next(err)
	}
}

module.exports = {
	token,
	register,
	checkUsername,
	checkEmail
}