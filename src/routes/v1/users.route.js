"use strict";

const express = require("express")

const authMiddleware = require("../../middleware/auth.middleware");
const userControllers = require("../../controllers/user.controller");
const userUpdateSchema = require("../../validators/userUpdate.schema.json")
const { validate } = require("../../middleware/validate.middleware")


const router = express.Router()

router
	.route('/:username')
	.all(authMiddleware.ensureCorrectUser)
	.get(userControllers.getUserAccount)
	.patch(validate(userUpdateSchema), userControllers.updateUser)
	.delete(userControllers.deleteUser);

router
	.route('/:username/connections')
	.all(authMiddleware.ensureCorrectUser)
	.get(userControllers.listConnections)
	.post(userControllers.createConnection)
	.patch(userControllers.updateConnection)
	.delete(userControllers.deleteConnection)


module.exports = router