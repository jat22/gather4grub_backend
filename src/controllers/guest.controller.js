"use strict";

const guestServices = require("../services/guests.services");

/**
 * @route GET '/events/:eventId/guests'
 * @desc get all guests for an event
 * @access Restricted - event participants only
 */
const getEventGuests = async(req,res,next) => {
	try{
		const eventId = req.params.eventId;
		const guests = await guestServices.getEventGuests(eventId);
		return res.json({ guests });
	} catch(err){
		return next(err);
	};
};

/**
 * @route POST '/events/:eventId/guests'
 * @desc add guests to an event
 * @access Restricted - event host only
 */
const addGuestsToEvent = async(req,res,next) => {
	try{
		const guestUsernames = req.body.usernames;
		const eventId = req.params.eventId;
		const updatedGuestList = await guestServices.addGuestsToEvent(eventId, guestUsernames);
		return res.json({ guests: updatedGuestList });
	} catch(err){
		return next(err);
	};
};

/**
 * @route DELETE '/events/:eventId/guests/:username'
 * @desc remove a guest from event
 * @access Restricted - event host only
 */
const removeGuestFromEvent = async(req,res,next) => {
	try{
		const eventId = req.params.eventId;
		const username = req.params.username;
		await guestServices.removeGuestFromEvent(eventId, username);
		return res.status(204).send();
	} catch(err){
		return next(err);
	};
};

/** Handle put request for updating guest RSVP
/**
 * @route PUT '/events/invitations/:username/:inviteId'
 * @desc change invitation rsvp.
 * @access Restrictied - invititee only
 */
const updateRSVP = async(req,res,next) => {
	try{
		const inviteId = req.params.inviteId;
		const rsvp = req.body.rsvp;
		const result = await guestServices.updateEventRSVP(inviteId, rsvp);
		return res.status(201).json(result);
	} catch(err){
		return next(err);
	};
};

module.exports = {
	getEventGuests,
	addGuestsToEvent,
	removeGuestFromEvent,
	updateRSVP
}