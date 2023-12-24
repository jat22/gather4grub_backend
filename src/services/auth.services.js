"use strict"

const tokenService = require("../services/token.services");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { UnauthorizedError } = require("../expressError");

/** USED
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
	const token = tokenService.generateToken(credentials);

	return token;
}

/** USED
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
	checkUsernamePassword
};