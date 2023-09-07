"use strict";

const express = require("express")

const { ensureCorrectUser } = require("../../middleware/auth.middleware");
const userControllers = require("../../controllers/user.controller");
const connectionControllers = require("../../controllers/connections.controller")
const dietaryTagControllers = require("../../controllers/dietaryTag.controller")
const userUpdateSchema = require("../../validators/userUpdate.schema.json")
const { validate } = require("../../middleware/validate.middleware");

const router = express.Router()

router
	.route('/:username')
	.all(ensureCorrectUser)
	.get(userControllers.getUserAccount)
	.patch(
		validate(userUpdateSchema), 
		userControllers.updateUser)
	.delete(userControllers.deleteUser);

router
	.route('/:username/connections')
	.get(
		ensureCorrectUser, 
		connectionControllers.listConnections)

router
	.route('/:username/connections/:connectionId')
	.delete(
		ensureCorrectUser, 
		connectionControllers.removeConnection)

router
	.route('/:username/connections/requests')
	.all(ensureCorrectUser)
	.get(connectionControllers.listConnectionRequests)
	.post(connectionControllers.newConnectionRequest)

router
	.route('/:username/connections/requests/:reqId')
	.all(ensureCorrectUser)
	.put(connectionControllers.requestAcceptance)
	.delete(connectionControllers.requestDenial)


module.exports = router

// router
// 	.route('/:username/dietary')
// 	.get(dietaryTagControllers.getUserDietaryTags)

// router
// 	.route('/:username/dietary/allergies')
// 	.get()
// 	.post()
// 	.delete()

// router
// 	.route('/:username/dietary/preferences')

// 	.post(
// 		ensureCorrectUser, 
// 		dietaryTagControllers.addUserDietaryTags)
// 	.delete(
// 		ensureCorrectUser, 
// 		dietaryTagControllers.removeUserDietaryTags);