"use strict";

const express = require("express")
const jsonschema = require("jsonschema");

const User = require("../models/user");

const router = express.Router()

router.get("/:username", async function(req, res, next){
	try{
		const user = await User.getDetails(req.params.username);
		return res.json({ user })
	}catch(err){
		return next(err);
	}
})

router.get("/:username")

module.exports = router

