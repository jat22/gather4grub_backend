"use strict";

const { BCRYPT_WORK_FACTOR } = require("../config")
const { UnauthorizedError, BadRequestError, NotFoundError } = require("../expressError")
const User = require("../models/user.model")
const authSerivces = require("../services/auth.services")
const bcrypt = require("bcrypt")

/**
 * @typedef {Object} User
 * @property {string} username 
 * @property {string} firstName 
 * @property {string} lastName
 * @property {string} email
 * @property {string} role
 * @property {string} phone - can be null
 * @property {string} streetAddress - can be null
 * @property {string} city - can be null
 * @property {string} state - can be null
 * @property {string} zip - can be null
 * @property {string} tagLine - can be null
 * @property {string} bio - can be null
 * @property {string} birthdate - can be null
 * @property {string} avatarUrl - can be null
 */

/**
 * @typedef {Object} UserRegistration
 * @property {string} username 
 * @property {string} password
 * @property {string} firstName 
 * @property {string} lastName
 * @property {string} email
 * @property {string} phone - can be null
 * @property {string} streetAddress - can be null
 * @property {string} city - can be null
 * @property {string} state - can be null
 * @property {string} zip - can be null
 * @property {string} tagLine - can be null
 * @property {string} bio - can be null
 * @property {string} birthdate - can be null
 * @property {string} avatarUrl - can be null
 */

/**
 * @typedef {Object} UserUpdateInput
 * @property {string} currentPassword
 * @property {string} newPassword - can be null
 * @property {string} confirmNewPassword - can be null
 * @property {string} firstName - can be null
 * @property {string} lastName - can be null
 * @property {string} email - can be null
 * @property {string} phone - can be null
 * @property {string} streetAddress - can be null
 * @property {string} city - can be null
 * @property {string} state - can be null
 * @property {string} zip - can be null
 * @property {string} tagLine - can be null
 * @property {string} bio - can be null
 * @property {string} birthdate - can be null
 * @property {string} avatarUrl - can be null
 */

/**
 * Get user's account information
 * @param {string} username
 * @return {User} The user object.
 */
const getUserAccount = async(username) => {
	const user = await User.getAccount(username);
	if(!user) throw new NotFoundError(`User: ${username}, does not exist`);
	return user;
}

/**
 * 
 * @param {Object} UserRegistration 
 * @returns {User} The user object.
 */
const createUser = async(userInput) => {
	const hashedPassword = await bcrypt.hash(
									userInput.password, BCRYPT_WORK_FACTOR);

	userInput.password = hashedPassword;
	delete userInput.role;

	const user = await User.create(userInput);

	return user;
};

/**
 * Update user information
 * @param {string} username 
 * @param {UserUpdateInput} body 
 * @returns {User}
 */
const updateUser = async(username, body) => {
	if(!authSerivces.checkUsernamePassword(username, body.currentPassword)){
		throw new BadRequestError("Invalid password");
	};
	delete body.currentPassword;

	if(body.email){
		const checkEmail = await User.emailExists(body.email);
		if(checkEmail && checkEmail.username !== username){
			throw new BadRequestError(`${body.email} is already associated with an account`);
		};
	};

	if(body.newPassword && body.newPassword !== body.confirmNewPassword){
		throw new BadRequestError(`New Password does not match.`);
	};

	if(body.newPassword){
		const hashedPassword = await bcrypt.hash(
						body.newPassword, BCRYPT_WORK_FACTOR);
		delete body.confirmNewPassword;
		delete body.newPassword;

		body.password = hashedPassword;
	}
	
	const user = await User.update(username, body);
	
	return user;
};

/**
 * delete user
 * @param {string} username 
 * @param {string} password 
 * @returns {boolean} true user deleted
 */

const deleteUser = async(username, password) => {
	if(! await authSerivces.checkUsernamePassword(username, password)){
		throw new BadRequestError("Invalid password");
	};

	const user = await User.remove(username);

	if(user.username === username) return true;
	
	return false;
};

/**
 * check if username exists
 * @param {string} username 
 * @returns {boolean} true if does exist
 */
const checkIfUserExists = async(username) => {
	if(!(await User.usernameExists(username))) {
		throw new NotFoundError(`${username} does not exist`);
	};
	return true;
}

module.exports = {
	getUserAccount,
	createUser,
	updateUser,
	deleteUser,
	checkIfUserExists
}