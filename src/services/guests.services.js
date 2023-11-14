"use strict";

const { BadRequestError, NotFoundError } = require("../expressError");
const Guest = require("../models/guest.model")

/**
 * Guest object
 * @typedef {Object} Guest
 * @property {number} id
 * @property {number} gatheringId
 * @property {string} username
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} rsvp
 */

/**
 * 
 * @param {number} gatheringId 
 * @returns {Array.<Guest>} guests
 */
const getGatheringGuests = async(gatheringId) => {
	const guests =
		await Guest.findForGathering(gatheringId);
	return guests;
};


/**
 * Add a guest to a gathering.
 * @param {number} gatheringId 
 * @param {string} username 
 * @returns {Guest}
 */
const addGuestToGathering = async(gatheringId, username) => {
	const guest = await Guest.addToGathering(gatheringId, username);
	return guest
};

/**
 * 
 * @param {number} gatheringId 
 * @param {string} username 
 * @returns {undefined}
 */
const removeGuestFromGathering = async(gatheringId, username) => {
	const result = await Guest.removeFromGathering(gatheringId, username);
	if(!result) throw new NotFoundError()
	return
};

/**
 * Update a guest's RSVP
 * @param {number} gatheringId 
 * @param {number} guestId 
 * @param {string} rsvp 
 * @returns {Guest}
 */
const updateGatheringRSVP = async(inviteId, rsvp) => {
	const result = await Guest.updateRsvp(inviteId, rsvp);
	return result
};

const checkIfGuestExistsOnGathering = async(username, gatheringId) => {
	const guest = await Guest.getGatheringGuestId(username, gatheringId);
	if(!guest) return false;
	return true;
}

module.exports = {
	getGatheringGuests,
	addGuestToGathering,
	removeGuestFromGathering,
	updateGatheringRSVP,
	checkIfGuestExistsOnGathering
}