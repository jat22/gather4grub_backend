"use strict";

const express = require("express");

const { ensureCorrectUser, ensureLoggedIn } = require('../../middleware/auth.middleware');
const { ensureParticipant, ensureHost, ensureDishOwnerOrHost,
		ensurePostAuthor, ensurePostAuthorOrHost, ensureCommentAuthor, ensureCommentAuthorOrHost } = require('../../middleware/event.middleware')
const { validate } = require("../../middleware/validate.middleware");
const eventControllers = require("../../controllers/events.controller");
const guestControllers = require("../../controllers/guest.controller")
const dishControllers = require('../../controllers/dishes.controller');
const postControllers = require('../../controllers/posts.controller');
const newEventSchema = require("../../validators/newEvent.schema.json");
const updateEventSchema = require('../../validators/updateEvent.schema.json')
const rsvpSchema = require("../../validators/rsvp.schema.json");

const router = express.Router();

router
	.route('/')
	.post(
		ensureLoggedIn,
		validate(newEventSchema), 
		eventControllers.createEvent);

router
	.route('/:eventId/basic')
	.get(
		ensureParticipant, 
		eventControllers.getBasicDetailsOfEvent)
	.put(
		ensureHost, 
		eventControllers.updateBasicDetails)
	.delete(
		ensureHost,
		validate(updateEventSchema),
		eventControllers.deleteEvent);

router
	.route('/:eventId/full')
	.get(
		ensureParticipant, 
		eventControllers.getFullDetailsOfEvent)

router
	.route('/:eventId/guests')
	.get(
		ensureParticipant,
		guestControllers.getEventGuests)
	.post(
		ensureHost,
		guestControllers.addGuestsToEvent)

router
	.route('/:eventId/guests/:username')
	.put(
		ensureCorrectUser,
		validate(rsvpSchema), 
		guestControllers.updateRSVP)
	.delete(
		ensureHost, 
		guestControllers.removeGuestFromEvent)

router
	.route('/:eventId/dishes')
	.all(ensureParticipant)
	.get(dishControllers.getEventDishes)

router
	.route('/:eventId/dishes/:dishId')
	.post(
		ensureParticipant, 
		dishControllers.addDishToEvent)
	.delete(
		ensureDishOwnerOrHost,
		dishControllers.removeDishFromEvent);;

router
	.route('/:eventId/posts')
	.all(ensureParticipant)
	.get(postControllers.getEventPosts)
	.post(postControllers.createPost)
	
router
	.route('/:eventId/posts/:postId')
	.all(ensureParticipant)
	.put(
		ensurePostAuthor,
		postControllers.editPost)
	.delete(
		ensurePostAuthorOrHost,
		postControllers.deletePost)

router
	.route('/:eventId/posts/:postId/comments')
	.all(ensureParticipant)
	.post(postControllers.createComment)

router
	.route('/:eventId/posts/:postId/comments/:commentId')
	.put(
		ensureCommentAuthor,
		postControllers.editComment)
	.delete(
		ensureCommentAuthorOrHost,
		postControllers.deleteComment)

router
	.route('/invitations/:username/:inviteId')
	.put(
		ensureCorrectUser,
		validate(rsvpSchema), 
		guestControllers.updateRSVP)
	.delete(
		ensureHost, 
		guestControllers.removeGuestFromEvent)

module.exports = router