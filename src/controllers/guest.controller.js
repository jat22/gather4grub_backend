"use strict";

const guestServices = require("../services/guests.services");

const getGatheringGuests = async(req,res,next) => {
	try{
		const gatheringId = req.params.gatheringId;
		const guests = await guestServices.getGatheringGuests(gatheringId)
		return res.json({ guests })
	} catch(err){
		return next(err)
	}
};

const addGuestsToGathering = async(req,res,next) => {
	try{
		const guestUsername = req.body.guest
		const gatheringId = req.params.gatheringId
		const guest = await guestServices.addGuestToGathering(gatheringId, guestUsername)
		return res.json({ guest })
	} catch(err){
		return next(err)
	}
};

const removeGuestFromGathering = async(req,res,next) => {
	try{
		await guestServices.removeGuestFromGathering(req.params.username)
		return res.status(204).send()
	} catch(err){
		return next(err)
	}
};

const updateRSVP = async(req,res,next) => {
	try{
		const gatheringId = req.params.gatheringId;
		const guestUsername = req.params.username;
		const rsvp = req.body.rsvp
		const guest = 
			await guestServices.updateGatheringRSVP(gatheringId, guestUsername, rsvp);
		return res.json({ guest })
	} catch(err){
		return next(err)
	}
};

module.exports = {
	getGatheringGuests,
	addGuestsToGathering,
	removeGuestFromGathering,
	updateRSVP
}