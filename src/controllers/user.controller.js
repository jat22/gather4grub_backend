"user strict";

const userServices = require("../services/user.services");
const User = require("../models/user.model");

const getUserAccount = async(req,res,next) => {
	try{
		const user = await User.getAccount(req.params.username);
		return res.json({ user })
	}catch(err){
		return next(err);
	};
};

const updateUser = async(req,res,next) => {
	try{
		const user = await userServices.updateUser(req.params.username, req.body);
		return res.json({ user });
	} catch(err){
		return next(err);
	};
};

const deleteUser = async(req,res,next) => {
	try{
		await userServices.deleteUser(req.params.username, req.body.password)
		return res.status(204).send();
	} catch(err){
		return next(err);
	};
};

module.exports = {
	getUserAccount,
	updateUser,
	deleteUser
};