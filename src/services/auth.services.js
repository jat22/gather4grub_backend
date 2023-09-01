"use strict"

const tokenService = require("../services/token.services");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { BadRequestError } = require("../expressError");

/**
 * get a token
 * @param {string} username 
 * @param {string} password 
 * @returns {string} token
 */
const getToken = async (username, password) => {
	const credentials = await checkUsernamePassword(username, password);
	if(!credentials) throw new BadRequestError("Invalid username/password");

	const token = tokenService.generateToken(credentials);

	return token;
}

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