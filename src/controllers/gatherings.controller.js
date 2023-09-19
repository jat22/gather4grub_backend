"use strict";

const gatheringServices = require('../services/gatherings.services');
const guestServices = require('../services/guests.services')

const createGathering = async(req,res,next) => {
	try{
		const host = res.locals.user.username;
		const partyDetails = req.body
		const gathering = await gatheringServices.createGathering(host, partyDetails)
		return res.json({ gathering })
	} catch(err){
		return next(err)
	}
};

const getBasicDetailsOfGathering = async(req,res,next) => {
	try{
		const gathering = 
			await gatheringServices.getBasicDetailsOfGathering(req.params.gatheringId);
		return res.json({ gathering })
	} catch(err){
		return next(err)
	}
}

const getFullDetailsOfGathering = async(req,res,next) => {
	try{
		const gathering = 
			await gatheringServices.getFullDetailsOfGathering(req.params.gatheringId);
		return res.json({ gathering })
	} catch(err){
		return next(err)
	}
};

const updateBasicDetails = async(req,res,next) => {
	try{
		const gathering = 
			await gatheringServices.updateBasicDetails(req.params.gatheringId, req.params.data);
		return res.json({ gathering })
	} catch(err){
		return next(err)
	}
};

const deleteGathering = async(req,res,next) => {
	try{
		await gatheringServices.deleteGathering(req.params.gatheringId);
		return res.status(204).send()
	} catch(err){
		return next(err)
	}
};

const getUsersGatherings = async(req,res,next) => {
	try{
		const user = req.params.username
		const gatherings = await gatheringServices.getUsersGatherings(user)
		return res.json({ gatherings })
	} catch(err){
		return next(err)
	}
}



module.exports = {
	createGathering,
	getBasicDetailsOfGathering,
	getFullDetailsOfGathering,
	updateBasicDetails,
	deleteGathering,
	getUsersGatherings
}