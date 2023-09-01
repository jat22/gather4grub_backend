"use strict";

const express = require("express")

const authMiddleware = require("../../middleware/auth.middleware");
const userController = require("../../controllers/user.controller");
const userUpdateSchema = require("../../validators/userUpdate.schema.json")
const { validate } = require("../../middleware/validate.middleware")


const router = express.Router()

router
	.route('/:username')
	.get(authMiddleware.ensureCorrectUser, 
			userController.getUserAccount)
	.patch(authMiddleware.ensureCorrectUser, 
			validate(userUpdateSchema),
			userController.updateUser)
	.delete(authMiddleware.ensureCorrectUser, userController.deleteUser);


module.exports = router