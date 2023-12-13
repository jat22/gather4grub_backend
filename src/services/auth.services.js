"use strict"

const tokenService = require("../services/token.services");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { BadRequestError, UnauthorizedError } = require("../expressError");
const jwt = require('jsonwebtoken');
const jsonschema = require("jsonschema")
const { SECRET_KEY } = require("../config")

/**
 * get a token
 * @param {string} username 
 * @param {string} password 
 * @returns {string} token
 */
const getToken = async (username, password) => {
	const credentials = await checkUsernamePassword(username, password);
	if(!credentials) throw new UnauthorizedError("Invalid username/password");

	const token = tokenService.generateToken(credentials);

	return token;
}

const setUserLocals = async(token) => {
	res.locals.user = await jwt.verify(token, SECRET_KEY);
	return 
}

/**
 * Check input password against stored password.
 * @param {string} username 
 * @param {string} password 
 * @returns {boolean|object} if password matches returns credential object, otherwise false
 * @param {string} username
 * @param {role} user or admin
 */

const checkUsernamePassword = async(username, password) => {
	const credentials = await User.getUserCredentials(username);

	if(!credentials) return false;
	const valid = await bcrypt.compare(password, credentials.password);

	delete credentials.password;
	if(valid) return credentials;

	return false
}

module.exports = {
	getToken,
	checkUsernamePassword
}