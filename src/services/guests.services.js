"use strict";

const { BadRequestError, NotFoundError } = require("../expressError");
const Guest = require("../models/guest.model")

/**
 * Guest object
 * @typedef {Object} Guest
 * @property {number} id
 * @property {number} eventId
 * @property {string} username
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} rsvp
 */

/**
 * 
 * @param {number} eventId 
 * @returns {Array.<Guest>} guests
 */
const getEventGuests = async(eventId) => {
	const guests =
		await Guest.findForEvent(eventId);
		

	return guests;
};


/**
 * Add a guest to a event.
 * @param {number} eventId 
 * @param {string} username 
 * @returns {Guest}
 */
const addGuestsToEvent = async(eventId, usernames) => {
	const guestPromises = usernames.map(u => Guest.addToEvent(eventId, u));
	await Promise.all(guestPromises);
	
	const guestList = await Guest.findForEvent(eventId);
	return guestList
};

/**
 * 
 * @param {number} eventId 
 * @param {string} username 
 * @returns {undefined}
 */
const removeGuestFromEvent = async(eventId, username) => {
	const result = await Guest.removeFromEvent(eventId, username);
	if(!result) throw new NotFoundError()
	return
};

/**
 * Update a guest's RSVP
 * @param {number} eventId 
 * @param {number} guestId 
 * @param {string} rsvp 
 * @returns {Guest}
 */
const updateEventRSVP = async(inviteId, rsvp) => {
	const result = await Guest.updateRsvp(inviteId, rsvp);
	return result
};

const checkIfGuestExistsOnEvent = async(username, eventId) => {
	const guest = await Guest.getEventGuestId(username, eventId);
	if(!guest) return false;
	return true;
}

module.exports = {
	getEventGuests,
	addGuestsToEvent,
	removeGuestFromEvent,
	updateEventRSVP,
	checkIfGuestExistsOnEvent
}