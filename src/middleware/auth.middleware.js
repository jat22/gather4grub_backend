"use strict";

const jwt = require('jsonwebtoken');
const jsonschema = require("jsonschema")
const { SECRET_KEY } = require("../config")
const { UnauthorizedError, BadRequestError } = require("../expressError")

const authenticateToken = (req, res, next) => {
	try {
		const authHeader = req.headers && req.headers.authorization;
		if (authHeader) {
		  const token = authHeader.replace(/^[Bb]earer /, "").trim();
		  res.locals.user = jwt.verify(token, SECRET_KEY);
		}
		return next();
	} catch (err) {
		return next();
	}
}


const ensureLoggedIn = (req, res, next) => {
	try {
	  if (!res.locals.user) throw new UnauthorizedError();
	  return next();
	} catch (err) {
	  return next(err);
	}
}

const ensureCorrectUser = (req, res, next) => {
	try {
		const user = res.locals.user;
		if (!(user && user.username === req.params.username)){
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