"use strict";

const express = require("express");

const { ensureCorrectUser, ensureLoggedIn } = require('../../middleware/auth.middleware');
const { ensureParticipant, ensureHost } = require('../../middleware/gatherings.middleware')
const { validate } = require("../../middleware/validate.middleware");
const gatheringControllers = require("../../controllers/gatherings.controller");
const dishControllers = require('../../controllers/dishes.controller');
const postControllers = require('../../controllers/posts.controller')
const createGatheringSchema = require("../../validators/createGathering.json")

const router = express.Router();

router
	.route('/')
	.post(
		ensureLoggedIn,
		validate(createGatheringSchema), 
		gatheringControllers.createGathering);

router
	.route('/gatherings/:gatheringId')
	.get(
		ensureParticipant, 
		gatheringControllers.getGatheringDetails)
	.put(
		ensureHost, 
		gatheringControllers.updateDetails)
	.delete(
		ensureHost,
		gatheringControllers.deleteGathering);

router
	.route('/gatherings/:gatheringId/guests')
	.get(
		ensureParticipant,
		gatheringControllers.getGatheringGuests)
	.post(
		ensureHost,
		gatheringControllers.addGuestsToGathering)
	.delete(
		ensureHost, 
		gatheringControllers.removeGuestFromGathering)

router
	.route('/gatherings/:gatheringId/guests/:username')
	.put(
		ensureCorrectUser, 
		gatheringControllers.updateRSVP)

router
	.route('/gatherings/:gatheringId/dishes')
	.all(ensureParticipant)
	.get(dishControllers.getGatheringDishes)
	.post(dishControllers.addDishToGathering)
	.delete(
		ensureDishOwnerOrHost,
		dishControllers.removeDishFromGathering)

router
	.route('/gatherings/:gatheringId/posts')
	.all(ensureParticipant)
	.get(postControllers.getGatheringPosts)
	.post(postControllers.createPost)
	.put(
		ensurePostOwnerOrHost,
		postControllers.updatePost)
	.delete(
		ensurePostOwnerOrHost,
		postControllers.deletePost)

router
	.route('/gatherings/:gatheringId/posts/:postId/comments')
	.all(ensureParticipant)
	.get(postControllers.getPostComments)
	.post(postControllers.createPostComment)
	.delete()

	
module.exports = router