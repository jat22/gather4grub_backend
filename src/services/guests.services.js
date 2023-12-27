"use strict";

const { BadRequestError, NotFoundError, GeneralDatabaseError } = require("../expressError");
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
 * get guests for a particular event
 * @param {number} eventId 
 * @returns {Array} guests - array of guest objects.
 */
const getEventGuests = async(eventId) => {
	const guests =
		await Guest.findForEvent(eventId);
	return guests;
};


/**
 * Add a guest to a event.
 * @param {number} eventId 
 * @param {Array} usernames 
 * @returns {Array} guestList - updated guest list for event 
 */
const addGuestsToEvent = async(eventId, usernames) => {
	console.log(eventId, usernames)
	try{
		const guestPromises = usernames.map(u => Guest.addToEvent(eventId, u));
		const result = await Promise.all(guestPromises);
		if(result.length === 0){
			throw new GeneralDatabaseError()
		}
	}catch(err){
		throw new GeneralDatabaseError('Guests not added.')
	}

	try{
		const guestList = await Guest.findForEvent(eventId);
		return guestList
	}catch(err){
		throw new GeneralDatabaseError('Upable to retrieve updated guest list.')
	}

};

/**
 * Remove a guest from an event entirely
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
 * @returns {Object} updatedRsvp 
 */
const updateEventRSVP = async(inviteId, rsvp) => {
	const result = await Guest.updateRsvp(inviteId, rsvp);
	return result
};

/**
 * Check if a guests is associated with an event
 * @param {string} username 
 * @param {number} eventId 
 * @returns {Boolean}
 */
const checkIfGuestExistsOnEvent = async(username, eventId) => {
	const guest = await Guest.getEventGuestId(username, eventId);
	if(!guest) return false;
	return true;
}

/**
 * get a user's rsvp for a particular event
 * @param {string} username 
 * @param {number} eventId 
 * @returns {Object} rsvp
 */
const getUserRsvp = async(username, eventId) => {
	const rsvp = await Guest.getUserRsvp(username, eventId)
	return rsvp
}

module.exports = {
	getEventGuests,
	addGuestsToEvent,
	removeGuestFromEvent,
	updateEventRSVP,
	checkIfGuestExistsOnEvent,
	getUserRsvp
}