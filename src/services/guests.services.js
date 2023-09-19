"use strict";

const { BadRequestError } = require("../expressError");
const Guest = require("../models/guest.model")
const userServices = require('../services/user.services');
const gatheringServices = require("../services/gatherings.services")


const getGatheringGuests = async(gatheringId) => {
	const guests =
		await Guest.findForGathering(gatheringId);
	return guests;
};

const addGuestToGathering = async(gatheringId, username) => {
	const guest = await Guest.addToGathering(gatheringId, username);
	return guest
};

const removeGuestFromGathering = async(guestId, gatheringId) => {
	if(!(await checkIfGuestExistsOnGathering(guestId, gatheringId))){
		throw new BadRequestError("guest does not exist")
	};
	const result = await Guest.removeFromGathering(gatheringId, guestId);
	return result
};

const updateGatheringRSVP = async(gatheringId, guestId, rsvp) => {
	if(!(await checkIfGuestExistsOnGathering(guestId, gatheringId))){
		throw new BadRequestError("guest does not exist")
	};
	const result = await Guest.updateRsvp(guestId, rsvp);
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