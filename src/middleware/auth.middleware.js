"use strict";

const jwt = require('jsonwebtoken');
const jsonschema = require("jsonschema")
const { SECRET_KEY } = require("../config")
const { UnauthorizedError, BadRequestError } = require("../expressError");
const dishServices = require("../services/dishes.services")

/** Authenticates token passed on request header.
 * 	If authenticates set user on res.locals
 * 	otherwise does nothing
 * 	return next
 */
const authenticateToken = async (req, res, next) => {
	try {

		const authHeader = req.headers && req.headers.authorization;
		console.log('authHeader');
		console.log(authHeader)
		if (authHeader) {
		  const token = authHeader.replace(/^[Bb]earer /, "").trim();
		  res.locals.user = await jwt.verify(token, SECRET_KEY);
		  console.log('locals.user')
		  console.log(res.locals.user)
		}
		return next();
	} catch (err) {
		return next();
	}
}

/** ensures that the user is logged-in
 * 	returns next
 */
const ensureLoggedIn = (req, res, next) => {
	try {
	  	if(!res.locals.user) throw new UnauthorizedError();
	  	return next();
	} catch (err) {
	  	return next(err);
	}
}

/** Checks that current user matches username in req parameters
 * 	returns next
 */
const ensureCorrectUser = (req, res, next) => {
	try {
		const currUser = res.locals.user;
		console.log('currUser')
		console.log(currUser)
		const paramUsername = req.params.username
		if (!(currUser && currUser.username === paramUsername)){
			throw new UnauthorizedError();
		}
		return next();
	} catch (err) {
	  	return next(err);
	}
}

const ensureCorrectUserOrAdmin = (req, res, next) => {
	try{
		const user = res.locals.user;
		if (!(user && (user.role === "admin" || user.username === req.params.username))){
			throw new UnauthorizedError();
		}
		return next()
	} catch(err){
		return next(err)
	}
}

const ensureAdmin = (req, res, next) => {
	try{
		const user = res.locals.user;
		if(!(user && user.role === "admin")){
			throw new UnauthorizedError()
		}
		return next()
	} catch(err){
		return next(err)
	}
}

const ensureDishAddedByOrHost = async (req,res,next) => {
	try{
		const user = res.locals.user.username;
		const dishId = req.params.dishId
		const dishAddedBy = await dishServices.dishAddedBy(dishId)
		if(user !== dishAddedBy) throw new UnauthorizedError();
		return next();
	} catch(err){
		return next(err)
	}
}

module.exports = {
	authenticateToken,
	ensureLoggedIn,
	ensureCorrectUser,
	ensureCorrectUserOrAdmin,
	ensureAdmin
}