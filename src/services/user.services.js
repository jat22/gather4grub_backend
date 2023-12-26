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
 * @property {string} streetAddress - can be null
 * @property {string} city - can be null
 * @property {string} state - can be null
 * @property {string} zip - can be null
 * @property {string} tagLine - can be null
 * @property {string} avatarUrl - can be null
 */

/**
 * @typedef {Object} UserRegistration
 * @property {string} username 
 * @property {string} password
 * @property {string} firstName 
 * @property {string} lastName
 * @property {string} email
 */

/**
 * @typedef {Object} UserUpdateInput
 * @property {string} firstName - can be null
 * @property {string} lastName - can be null
 * @property {string} email - can be null
 * @property {string} streetAddress - can be null
 * @property {string} city - can be null
 * @property {string} state - can be null
 * @property {string} zip - can be null
 * @property {string} tagLine - can be null
 */

/**
 * Get user's account information
 * @param {string} username
 * @return {User} user
 */
const getUserAccount = async(username) => {
	const user = await User.getAccount(username);
	if(!user) throw new NotFoundError(`User: ${username}, does not exist`);
	return user;
};

/**
 * Get public information
 * @param {string} username 
 * @returns {Object} profile
 */
const getUserProfile = async(username) => {
	const profile = await User.getUserProfile(username);
	return profile
}

/**
 * Create a new user account
 * @param {Object} UserRegistration 
 * @returns {User} user.
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
	delete body.avatarUrl
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
	const userExists = await User.usernameExists(username);
	return userExists;
};

/**
 * check if email exists
 * @param {string} email 
 * @returns {boolean} true if does exist
 */
const checkIfEmailExists = async(email) => {
	const userExists = await User.emailExists(email);
	return userExists;
};

/**
 * Update user's password
 * @param {string} username 
 * @param {Object} password 
 * @returns {Object} user
 */
const updatePassword = async (username, data) => {
	if(data.newPassword !== data.confirmNew){
		throw new BadRequestError("New password does not match")
	}
	delete data.confirmNew
	if(! await authSerivces.checkUsernamePassword(username, data.curPassword)){
		throw new UnauthorizedError("Invalid password");
	};
	delete data.curPassword;
	const hashedPassword = await bcrypt.hash(
					data.newPassword, BCRYPT_WORK_FACTOR);
	delete data.newPassword
	const result = await User.updatePassword(username, hashedPassword)
	return result
}

/**
 * Get all stored avatars
 * @returns {Array} avatars - array of avatar objects
 */
const getAllAvatars = async () => {
	const avatars = await User.getAllAvatars();
	return avatars
}

/**
 * get a user's avatar
 * @param {string} username 
 * @returns {Object} avatar
 */
const getAvatar = async(username) => {
	const avatar = await User.getAvatar(username);
	return avatar
}

/**
 * update a user's
 * @param {string} username 
 * @param {number} avatarId 
 * @returns {Object} avatar
 */
const updateAvatar = async(username, avatarId) => {
	await User.updateAvatar(username, avatarId);
	const avatar = await getAvatar(username)
	return avatar
}

/**
 * Find other users based on search input
 * @param {string} searchInput 
 * @param {string} currUsername 
 * @returns {Array} users - array of user objects.
 */
const findUsersByEmailOrUsername = async(searchInput, currUsername) => {
	const searchResults = await User.findUsers(searchInput);

	const connectionPromises = searchResults.map(r => {
		return User.getUsersConnectionId(r.username, currUsername)
	})

	const requestPromises = searchResults.map(r => {
		return User.getUsersRequestId(r.username, currUsername)
	})

	const results = await Promise.all([...connectionPromises, ...requestPromises])
	const relationMap = {};

	results.forEach(r=> {
		if(!r) return
		else {
			relationMap[r.searchedUser] = {type:r.type, id: r.id}
		};
	});


	const users = searchResults.map(r => {
		if(r.username === currUsername){
			return {...r, relation: {type:'self', id:null}}
		}
		const relation = relationMap[r.username];
		return {...r, relation: relation}
	})

	return users
}

module.exports = {
	getUserAccount,
	getUserProfile,
	createUser,
	updateUser,
	deleteUser,
	checkIfUserExists,
	updatePassword,
	checkIfEmailExists,
	getAllAvatars,
	getAvatar,
	updateAvatar,
	findUsersByEmailOrUsername
}

	// if(body.newPassword && body.newPassword !== body.confirmNewPassword){
	// 	throw new BadRequestError(`New Password does not match.`);
	// };
	// if(body.newPassword){
	// 	const hashedPassword = await bcrypt.hash(
	// 					body.newPassword, BCRYPT_WORK_FACTOR);
	// 	delete body.confirmNewPassword;
	// 	delete body.newPassword;

	// 	body.password = hashedPassword;
	// }


// const findUsers = async(input) => {
// 	const users = await User.findUsers(input)
// 	return users
// }