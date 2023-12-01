"use strict";

const express = require("express")

const { ensureCorrectUser, ensureLoggedIn } = require("../../middleware/auth.middleware");
const userControllers = require("../../controllers/user.controller");
const connectionControllers = require("../../controllers/connections.controller");
const eventControllers = require("../../controllers/events.controller");
const dishControllers = require("../../controllers/dishes.controller")
const userUpdateSchema = require("../../validators/userUpdate.schema.json")
const { validate } = require("../../middleware/validate.middleware");

const router = express.Router()

router
	.route('/find/:input')
	.get(userControllers.findUsers)

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

router
	.route('/:username/events/all')
	.all(ensureCorrectUser)
	.get(eventControllers.getUsersEvents)

router
	.route('/:username/events/upcoming')
	.all(ensureCorrectUser)
	.get(eventControllers.getUpcomingEvents)

router
	.route('/:username/events/hosting')
	.all(ensureCorrectUser)
	.get(eventControllers.getUpcomingHosting)

router
	.route('/:username/invitations')
	.all(ensureCorrectUser)
	.get(eventControllers.getUserInvitations)

router
	.route('/:username/dishes')
	.all(ensureLoggedIn)
	.get(dishControllers.getUsersDishes)

module.exports = router