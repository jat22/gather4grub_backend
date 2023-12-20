"user strict";

const userServices = require("../services/user.services");


/** Handles single user get route
 * 	send response with json body
 * { user : 
 * 		{
 * 			username:<string>,
 * 			firstName:<string>,
 * 			lastName:<string>,
 * 			email:<string>,
 * 			role:<string>,
 * 			phone:<string>,
 * 			streetAddress:<string>,
 * 			city:<string>,
 * 			state:<string>,
 * 			zip:<string>,
 * 			tagLine:<string>,
 * 			bio:<string>,
 * 			birthdate:<string>,
 * 			avatarUrl:<string>
 * 		}
 * }
 */
const getUserAccount = async(req,res,next) => {
	try{
		const user = await userServices.getUserAccount(req.params.username);
		return res.json({ user })
	}catch(err){
		return next(err);
	};
};

const getUserProfile = async(req,res,next) => {
	try{
		const profile = await userServices.getUserProfile(req.params.username);
		return res.json({ profile })
	} catch (err){
		return next(err)
	}
}

/** Handles single user put route.
 * 	returns response with json body
 * *{ user : 
 * 		{
 * 			username:<string>,
 * 			firstName:<string>,
 * 			lastName:<string>,
 * 			email:<string>,
 * 			role:<string>,
 * 			phone:<string>,
 * 			streetAddress:<string>,
 * 			city:<string>,
 * 			state:<string>,
 * 			zip:<string>,
 * 			tagLine:<string>,
 * 			bio:<string>,
 * 			birthdate:<string>,
 * 			avatarUrl:<string>
 * 		}
 * }
 */
const updateUser = async(req,res,next) => {
	try{
		const user = await userServices.updateUser(req.params.username, req.body);
		return res.json({ user });
	} catch(err){
		return next(err);
	};
};


/** Hanldes single user delete route.
 * 	returns response with code 204, no body.
 */
const deleteUser = async(req,res,next) => {
	try{
		await userServices.deleteUser(req.params.username, req.body.password)
		return res.status(204).send();
	} catch(err){
		return next(err);
	};
};

const findUsers = async(req,res,next) => {
	try{
		const users = await userServices.findUsers(req.params.input)
		return res.json({ users })
	} catch(err) {
		return next(err)
	}
}

const updatePassword = async(req,res,next) => {
	try{
		const username = req.params.username;
		const result = await userServices.updatePassword(username, req.body);
		return res.json({result: result.username})
	} catch(err) {
		return next(err)
	}	
}

const getAllAvatars = async(req,res,next) => {
	try{
		const avatars = await userServices.getAllAvatars();
		return res.json({ avatars })
	}catch(err){
		return next(err)
	};
};

const getAvatar = async(req,res,next) => {
	try{
		const username = req.params.username
		const avatar = await userServices.getAvatar(username);
		return res.json({ avatar })
	}catch(err){
		return next(err)
	};
};

const updateAvatar = async(req,res,next) => {
	try{
		const username = req.params.username;
		const avatarId = req.body.avatarId;
		const avatar = await userServices.updateAvatar(username, avatarId);
		return res.status(201).json({ avatar })
	}catch(err){
		return next(err)
	}
}

module.exports = {
	getUserAccount,
	getUserProfile,
	updateUser,
	deleteUser,
	findUsers,
	updatePassword,
	getAllAvatars,
	getAvatar,
	updateAvatar
};