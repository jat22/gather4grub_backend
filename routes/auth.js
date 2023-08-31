"use strict";
const express = require("express")
const jsonschema = require("jsonschema");

const User = require("../models/user");
const userAuthSchema = require("../schema/user/auth.json");
const userRegisterSchema = require("../schema/user/register.json");
const { BadRequestError } = require("../expressError");
const Token = require("../helpers/tokens")

const router = new express.Router();

router.post("/token", async function(req, res, next){
	try {
		const validator = jsonschema.validate(req.body, userAuthSchema);
		if(!validator.valid){
			const errs = validator.errors.map(e => e.stack);
			throw new BadRequestError(errs);
		}

		const { username, password } = req.body;

		const user = await User.authenticate(username, password);
		const token = Token.create(user);
		return res.json({ token })
	} catch(err) {
		return next(err)
	}
})

router.post("/register", async function(req, res, next) {
	try{
		const validator = jsonschema.validate(req.body, userRegisterSchema);
		if (!validator.valid){
			const errs = validator.errors.map(e => e.stack);
			throw new BadRequestError(errs);
		}
		const newUser = await User.register({...req.body});
		const token = Token.create(newUser)
		return res.status(201).json({ token });
	} catch (err) {
		return next(err)
	}
})

module.exports = router;