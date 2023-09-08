"use strict";

const { BCRYPT_WORK_FACTOR } = require("../config")
const { UnauthorizedError, BadRequestError, NotFoundError } = require("../expressError")
const User = require("../models/user.model")
const authSerivces = require("../services/auth.services")
const bcrypt = require("bcrypt")

/**
 * Get user's account information
 * @param {*} {string} username 
 */

const getUserAccount = async(username) => {
	const user = await User.getAccount(username);
	if(!user) throw new NotFoundError(`User: ${username}, does not exist`);
	return user;
}


const createUser = async(userInput) => {
	// if(await User.usernameExists(userInput.username)){
	// 	throw new BadRequestError(`${userInput.username} is already taken. Select another username.`);
	// };
	// if(await User.emailExists(userInput.email)){
	// 	throw new BadRequestError(`${userInput.email} is already associated with an account.`);
	// };

	const hashedPassword = await bcrypt.hash(
									userInput.password, BCRYPT_WORK_FACTOR);

	userInput.password = hashedPassword;
	delete userInput.role;

	const user = await User.create(userInput);

	return user;
};

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
	const hashedPassword = await bcrypt.hash(
									userInput.password, BCRYPT_WORK_FACTOR);
	delete body.confirmNewPassword;
	delete body.newPassword;

	body.password = hashedPassword;	
	const user = await User.update(username, body);
	
	return user;
};

const deleteUser = async(username, password) => {
	if(!await User.usernameExists()) throw new NotFoundError();
	if(!authSerivces.checkUsernamePassword(username, password)){
		throw new BadRequestError("Invalid password");
	};

	const user = await User.remove(username);

	if(user.username === username) return true;
	
	return false;
};

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