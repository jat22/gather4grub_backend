"use strict"

const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { UnauthorizedError } = require("../expressError");
const jwt = require('jsonwebtoken');
const { SECRET_KEY, TOKEN_EXPIRATION } = require('../config')

/**
 * Generate token
 * @param {Object} user
 * @param {string} user.username
 * @param {string} user.role
 * @returns {string} JWT Token
 */
const generateToken = (user) => {
	let payload = {
		username : user.username,
		role : user.role
	};

	return jwt.sign(payload, SECRET_KEY);
};


/**
 * get a token
 * @param {string} username 
 * @param {string} password 
 * @returns {string} token
 */
const getToken = async (username, password) => {
	const credentials = await checkUsernamePassword(username, password);
	if(!credentials){
		throw new UnauthorizedError("Invalid username/password");
	};
	const token = generateToken(credentials);

	return token;
};

/**
 * Check input password against stored password.
 * @param {string} username 
 * @param {string} password 
 * @returns {boolean|{username:string}} if password matches returns credential object, otherwise false
 */
const checkUsernamePassword = async(username, password) => {
	const credentials = await User.getUserCredentials(username);

	if(!credentials) return false;
	const valid = await bcrypt.compare(password, credentials.password);

	delete credentials.password;
	if(valid) return credentials;

	return false;
};

module.exports = {
	getToken,
	checkUsernamePassword,
	generateToken
};