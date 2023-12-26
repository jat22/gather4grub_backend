"user strict";

const userServices = require("../services/user.services");


/**
 * @route GET '/users/:username'
 * @desc get user's account information
 * @access Owner 
 */
const getUserAccount = async(req,res,next) => {
	try{
		const user = await userServices.getUserAccount(req.params.username);
		return res.json({ user });
	}catch(err){
		return next(err);
	};
};

/**
 * @route GET '/users/:username/profile'
 * @desc get user's public information
 * @access Token 
 */
const getUserProfile = async(req,res,next) => {
	try{
		const profile = await userServices.getUserProfile(req.params.username);
		return res.json({ profile });
	} catch (err){
		return next(err);
	};
};

/**
 * @route PATCH '/users/:username'
 * @desc update user information
 * @access Owner
 */
const updateUser = async(req,res,next) => {
	try{
		const user = await userServices.updateUser(req.params.username, req.body);
		return res.json({ user });
	} catch(err){
		return next(err);
	};
};


/**
 * @route GET 'users/find/:input'
 * @desc search for users based on relation to curr user.
 * @access Token
 */
const findPotentialConnections = async(req,res,next) => {
	try{
		const searchInput = req.params.input;
		const currUser = req.query.currUser;
		const users = 
			await userServices.findUsersByEmailOrUsername(searchInput, currUser);
		return res.json({ users });
	}catch(err){
		return next(err);
	};
};

/**
 * @route PATCH '/users/:username/password
 * @desc update user password
 * @access Owner
 */
const updatePassword = async(req,res,next) => {
	try{
		const username = req.params.username;
		const result = await userServices.updatePassword(username, req.body);
		return res.json({result: result.username});
	} catch(err) {
		return next(err);
	}	;
};

/**
 * @route GET '/users/avatars'
 * @desc get all avaliable user avatars
 * @access Token
 */
const getAllAvatars = async(req,res,next) => {
	try{
		const avatars = await userServices.getAllAvatars();
		return res.json({ avatars });
	}catch(err){
		return next(err);
	};
};

/**
 * @route GET 'users/:username/avatar'
 * @desc get a users' avatar
 * @access Token
 */
const getAvatar = async(req,res,next) => {
	try{
		const username = req.params.username;
		const avatar = await userServices.getAvatar(username);
		return res.json({ avatar });
	}catch(err){
		return next(err);
	};
};

/**
 * @route PATCH 'users/:username/avatar'
 * @desc update a users' avatar
 * @access Restricted - user only
 */
const updateAvatar = async(req,res,next) => {
	try{
		const username = req.params.username;
		const avatarId = req.body.avatarId;
		const avatar = await userServices.updateAvatar(username, avatarId);
		return res.status(201).json({ avatar });
	}catch(err){
		return next(err);
	};
};

module.exports = {
	getUserAccount,
	getUserProfile,
	updateUser,
	updatePassword,
	getAllAvatars,
	getAvatar,
	updateAvatar,
	findPotentialConnections
};


// /**
//  * @route 
//  * @desc 
//  * @access 
//  */
// const deleteUser = async(req,res,next) => {
// 	try{
// 		await userServices.deleteUser(req.params.username, req.body.password)
// 		return res.status(204).send();
// 	} catch(err){
// 		return next(err);
// 	};
// };

// /**
//  * @route 
//  * @desc 
//  * @access 
//  */
// const findUsers = async(req,res,next) => {
// 	try{
// 		const users = await userServices.findUsers(req.params.input)
// 		return res.json({ users })
// 	} catch(err) {
// 		return next(err)
// 	}
// }