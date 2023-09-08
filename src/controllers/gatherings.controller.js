"use strict";

const gatheringServces = require('../services/gatherings.services');
const guestServices = require('../services/guests.services')

const createGathering = async(req,res,next) => {
	try{
		const gathering = await gatheringServces.createGathering(req.body.details)
		return res.json({ gathering })
	} catch(err){
		return next(err)
	}
};

const getBasicDetailsOfGathering = async(req,res,next) => {
	try{
		const gathering = 
			await gatheringServces.getBasicDetailsOfGathering(req.params.gatheringId);
		return res.json({ gathering })
	} catch(err){
		return next(err)
	}
}

const getFullDetailsOfGathering = async(req,res,next) => {
	try{
		const gathering = 
			await gatheringServces.getFullDetailsOfGathering(req.params.gatheringId);
		return res.json({ gathering })
	} catch(err){
		return next(err)
	}
};

const updateBasicDetails = async(req,res,next) => {
	try{
		const gathering = 
			await gatheringServces.updateBasicDetails(req.params.gatheringId, req.params.data);
		return res.json({ gathering })
	} catch(err){
		return next(err)
	}
};

const deleteGathering = async(req,res,next) => {
	try{
		await gatheringServces.deleteGathering(req.params.gatheringId);
		return res.status(204).send()
	} catch(err){
		return next(err)
	}
};





module.exports = {
	createGathering,
	getBasicDetailsOfGathering,
	getFullDetailsOfGathering,
	updateBasicDetails,
	deleteGathering
}