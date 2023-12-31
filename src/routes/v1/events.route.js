"use strict";

const express = require("express");

const { ensureCorrectUser, ensureLoggedIn } = require('../../middleware/auth.middleware');
const { ensureParticipant, ensureHost, ensureCommentAuthor, ensureCommentAuthorOrHost } = require('../../middleware/event.middleware');
const { validate } = require("../../middleware/validate.middleware");
const eventControllers = require("../../controllers/events.controller");
const guestControllers = require("../../controllers/guest.controller")
const commentControllers = require('../../controllers/comment.controller');
const newEventSchema = require("../../validators/newEvent.schema.json");
const updateEventSchema = require('../../validators/updateEvent.schema.json');
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
		eventControllers.deleteEvent);

router
	.route('/:eventId/full')
	.get(
		ensureParticipant, 
		eventControllers.getFullDetailsOfEvent);

router
	.route('/:eventId/guests')
	.get(
		ensureParticipant,
		guestControllers.getEventGuests)
	.post(
		ensureHost,
		guestControllers.addGuestsToEvent);

router
	.route('/:eventId/guests/:username')
	.delete(
		ensureHost, 
		guestControllers.removeGuestFromEvent);

router
	.route('/:eventId/menu')
	.get(
		ensureParticipant,
		eventControllers.getMenu)
	.post(
		ensureParticipant,
		eventControllers.addMenuItem);

router
	.route('/:eventId/menu/categories')
	.get(
		ensureParticipant,
		eventControllers.getMenuCategories)
	.post(
		ensureParticipant,
		eventControllers.addMenuCategory)
	.delete(
		ensureHost,
		eventControllers.removeMenuCategory);

router
	.route('/:eventId/menu/:itemId')
	.delete(eventControllers.deleteMenuItem);

router
	.route('/:eventId/comments')
	.all(ensureParticipant)
	.get(commentControllers.getEventComments)
	.post(commentControllers.createComment);
	
router
	.route('/:eventId/comments/:commentId')
	.all(ensureParticipant)
	.put(
		commentControllers.editComment)
	.delete(
		commentControllers.deleteComment);

// 
router
	.route('/invitations/:username/:inviteId')
	.put(
		ensureCorrectUser,
		validate(rsvpSchema), 
		guestControllers.updateRSVP)
	.delete(
		ensureHost, 
		guestControllers.removeGuestFromEvent);

module.exports = router;

// router
// 	.route('/:eventId/dishes')
// 	.all(ensureParticipant)
// 	.get(dishControllers.getEventDishes)

// router
// 	.route('/:eventId/dishes/:dishId')
// 	.post(
// 		ensureParticipant, 
// 		dishControllers.addDishToEvent)
// 	.delete(
// 		ensureDishOwnerOrHost,
// 		dishControllers.removeDishFromEvent);;

// router
// 	.route('/:eventId/posts/:postId/comments')
// 	.all(ensureParticipant)
// 	.post(commentControllers.createComment)

// router
// 	.route('/:eventId/posts/:postId/comments/:commentId')
// 	.put(
// 		ensureCommentAuthor,
// 		postControllers.editComment)
// 	.delete(
// 		ensureCommentAuthorOrHost,
// 		postControllers.deleteComment)

	// .put(
	// 	ensureCorrectUser,
	// 	validate(rsvpSchema), 
	// 	guestControllers.updateRSVP)