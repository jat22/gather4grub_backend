"use strict";

const express = require("express")

const { ensureCorrectUser, ensureLoggedIn } = require("../../middleware/auth.middleware");
const userControllers = require("../../controllers/user.controller");
const connectionControllers = require("../../controllers/connections.controller");
const eventControllers = require("../../controllers/events.controller");
const userUpdateSchema = require("../../validators/userUpdate.schema.json")
const { validate } = require("../../middleware/validate.middleware");

const router = express.Router()

router
	.route('/find/:input')
	.get(userControllers.findPotentialConnections);

router
	.route('/avatars')
	.get(userControllers.getAllAvatars);

router
	.route('/:username/avatar')
	.get(userControllers.getAvatar)
	.patch(ensureCorrectUser, userControllers.updateAvatar);

router
	.route('/:username')
	.all(ensureCorrectUser)
	.get(userControllers.getUserAccount)
	.patch(
		validate(userUpdateSchema), 
		userControllers.updateUser);

router
	.route('/:username/password')
	.patch(
		userControllers.updatePassword);

router
	.route('/:username/profile')
	.get(userControllers.getUserProfile);

router
	.route('/:username/connections')
	.get(
		ensureCorrectUser, 
		connectionControllers.listConnections);

router
	.route('/:username/connections/:connectionId')
	.delete(
		ensureCorrectUser,
		connectionControllers.removeConnection);

router
	.route('/:username/connections/requests')
	.all(ensureCorrectUser)
	.get(connectionControllers.listConnectionRequests)
	.post(connectionControllers.newConnectionRequest);

router
	.route('/:username/connections/requests/:reqId')
	.all(ensureCorrectUser)
	.put(connectionControllers.requestAcceptance)
	.delete(connectionControllers.requestDenial);

router
	.route('/:username/events/upcoming')
	.all(ensureCorrectUser)
	.get(eventControllers.getUpcomingEvents);

router
	.route('/:username/invitations')
	.all(ensureCorrectUser)
	.get(eventControllers.getUserInvitations);

module.exports = router;

// router
// 	.route('/:username/events/all')
// 	.all(ensureCorrectUser)
// 	.get(eventControllers.getUsersEvents)

// router
// 	.route('/:username/events/hosting')
// 	.all(ensureCorrectUser)
// 	.get(eventControllers.getUpcomingHosting)

// router
// 	.route('/:username/dishes')
// 	.all(ensureLoggedIn)
// 	.get(dishControllers.getUsersDishes)