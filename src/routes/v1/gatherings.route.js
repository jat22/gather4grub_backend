"use strict";

const express = require("express");

const { ensureCorrectUser, ensureLoggedIn } = require('../../middleware/auth.middleware');
const { ensureParticipant, ensureHost, ensureDishOwnerOrHost,
		ensurePostAuthor, ensurePostAuthorOrHost, ensureCommentAuthor, ensureCommentAuthorOrHost } = require('../../middleware/gathering.middleware')
const { validate } = require("../../middleware/validate.middleware");
const gatheringControllers = require("../../controllers/gatherings.controller");
const guestControllers = require("../../controllers/guest.controller")
const dishControllers = require('../../controllers/dishes.controller');
const postControllers = require('../../controllers/posts.controller');
const newGatheringSchema = require("../../validators/newGathering.schema.json");
const updateGatheringSchema = require('../../validators/updateGathering.schema.json')
const rsvpSchema = require("../../validators/rsvp.schema.json");

const router = express.Router();

router
	.route('/')
	.post(
		ensureLoggedIn,
		validate(newGatheringSchema), 
		gatheringControllers.createGathering);

router
	.route('/gatherings/:gatheringId/basic')
	.get(
		ensureParticipant, 
		gatheringControllers.getBasicDetailsOfGathering)
	.put(
		ensureHost, 
		gatheringControllers.updateBasicDetails)
	.delete(
		ensureHost,
		validate(updateGatheringSchema),
		gatheringControllers.deleteGathering);

router
	.route('/gatherings/:gatheringId/full')
	.get(
		ensureParticipant, 
		gatheringControllers.getFullDetailsOfGathering)

router
	.route('/gatherings/:gatheringId/guests')
	.get(
		ensureParticipant,
		guestControllers.getGatheringGuests)
	.post(
		ensureHost,
		guestControllers.addGuestsToGathering)

router
	.route('/gatherings/:gatheringId/guests/:username')
	.put(
		ensureCorrectUser,
		validate(rsvpSchema), 
		guestControllers.updateRSVP)
	.delete(
		ensureHost, 
		guestControllers.removeGuestFromGathering)

router
	.route('/gatherings/:gatheringId/dishes')
	.all(ensureParticipant)
	.get(dishControllers.getGatheringDishes)

router
	.route('/gatherings/:gatheringId/dishes/:dishId')
	.post(
		ensureParticipant, 
		dishControllers.addDishToGathering)
	.delete(
		ensureDishOwnerOrHost,
		dishControllers.removeDishFromGathering);;

router
	.route('/gatherings/:gatheringId/posts')
	.all(ensureParticipant)
	.get(postControllers.getGatheringPosts)
	.post(postControllers.createPost)
	
router
	.route('/gatherings/:gatheringsId/posts/:postId')
	.all(ensureParticipant)
	.put(
		ensurePostAuthor,
		postControllers.editPost)
	.delete(
		ensurePostAuthorOrHost,
		postControllers.deletePost)

router
	.route('/gatherings/:gatheringId/posts/:postId/comments')
	.all(ensureParticipant)
	.post(postControllers.createComment)

router
	.route('/gatherings/:gatheringId/posts/:postId/comments/:commentId')
	.put(
		ensureCommentAuthor,
		postControllers.editComment)
	.delete(
		ensurePostAuthorOrHost,
		postControllers.deleteComment)

module.exports = router