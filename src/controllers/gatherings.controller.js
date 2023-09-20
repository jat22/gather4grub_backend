"use strict";

const gatheringServices = require('../services/gatherings.services');

/** Handle Post request to create a new gathering.
 * Request Data - 
 * 		body
 * 			{
 * 				title:<string>, REQ
 * 				date:<YYYY/MM/DD> , REQ
 * 				startTime:<HH:MM:SS>,
 * 				endTime:<HH:MM:SS>,
 * 				location:<string>,
 * 				theme:<string>,
 * 				description:<string>,
 * 				coverImg:<string>
 * 			}
 * Return response with json body.
 * 		{
 * 			"gathering": {
				"id":<num>,
				"host": <string>,
				"title": "<string>,
				"date": <string>,
				"startTime": <string>,
				"endTime": <string>,
				"location": <string>,
				"theme": <string>,
				"description": <string>,
				"coverImg": <string>
			}
 * 		}
 */
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

/** Handle get request for basic details of a gathering, ie. date, time, location,etc.
 * 
 * Request Data - 
 * 		params.gatheringId
 * Return response with json body
 */
const getBasicDetailsOfGathering = async(req,res,next) => {
	try{
		const gatheringId = req.params.gatheringId
		const gathering = 
			await gatheringServices.getBasicDetailsOfGathering(gatheringId);
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