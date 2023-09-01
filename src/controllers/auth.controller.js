"use strict";
const authSerivces = require("../services/auth.services");
const tokenServices = require("../services/token.services");
const userServices = require("../services/user.services")

const token = async (req, res, next) => {
	try {
		const username = req.body.username;
		const password = req.body.password;
		const token = await authSerivces.getToken(username, password);

		return res.json({ token })
	} catch(err){
		return next(err)
	}
	
}

const register = async (req, res, next) => {
	try{
		const user = await userServices.createUser(req.body);
		const token = tokenServices.generateToken(user);

		return res.status(201).json({ token })
	} catch(err){
		return next(err)
	}
}

module.exports = {
	token,
	register
}