"use strict";

const guestServices = require("../services/guests.services");

const getGatheringGuests = async(req,res,next) => {
	try{
		const guests = guestServices.getGatheringGuests(res.params.gatheringId)
		return res.json({ guests })
	} catch(err){
		return next(err)
	}
};

const addGuestsToGathering = async(req,res,next) => {
	try{
		const guest = guestServices.addGuestToGathering(req.body.guest)
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
		const guest = 
			await guestServices.updateGatheringRSVP(req.params.username, req.body.rsvp);
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