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
 * 		{
 * 			"gathering": {
				"id": <num>,
				"host": <string>,
				"title": <string>,
				"date": <string: YYYY/MM/DD>,
				"startTime": <string: HH:MM:SS>,
				"endTime": <string: HH:MM:SS>,
				"location": <string>,
				"theme": <string>,
				"description": <string>,
				"coverImg": <string>
			}
 * 		}
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

/** Handle get request for full details of a gathering, includes guest list, dishes, and posts.
 * 
 * Request Data - 
 * 		params.gatheringId
 * Return response with json body
 * 		{
 * 			"gathering": {
 * 				"basic: {
					"id": <num>,
					"host": <string>,
					"title": <string>,
					"date": <string: YYYY/MM/DD>,
					"startTime": <string: HH:MM:SS>,
					"endTime": <string: HH:MM:SS>,
					"location": <string>,
					"theme": <string>,
					"description": <string>,
					"coverImg": <string>
 				},
				"guests": [
					{
						"id": <num>,
						"username": <string>,
						"firstName": <string>,
						"lastName": <string>,
						"email": <string>,
						"rsvp": "rsvp": <string: pending(default), accept, decline>
					}
				],
				"dishes" : [
					{
						"id": <num>,
						"name": <string>,
						"description": <string>,
						"imgUrl": <string>,
						"courseId": <string>,
						"ownerUsername": <string>
					}
				],
				"posts" : [
					{
						"id": <string>,
						"title": <string>,
						"body": <string>,
						"gatheringid": <num>,
						"author": <string>,
						"comments" : [
							{
								"id": <num>,
								"body": <string>,
								"post_id": <num>,
								"author": <string>
							}
						]
					}
				]
			}
 * 		}
 */
const getFullDetailsOfGathering = async(req,res,next) => {
	try{
		const gathering = 
			await gatheringServices.getFullDetailsOfGathering(req.params.gatheringId);
		return res.json({ gathering })
	} catch(err){
		return next(err)
	}
};
/** Handle put request to edit basic details of a gathering.
 * Request Data -
 * 		params.gatheringId
 * 		body:	{
 * 					title:<string>,
 * 					date:<string:YYYY/MM/DD>,
 * 					startTime:<string: HH:MM:SS>,
 * 					endTime:<string: HH:MM:SS>,
 * 					location:<string>,
 * 					theme:<string>,
 * 					description:<string>,
 * 					coverImg:<string>
 * 				} ALL OPTIONAL
 * Return response with json body
 * 		{
 * 			"gathering": {
				"id": <num>,
				"host": <string>,
				"title": <string>,
				"date": <string: YYYY/MM/DD>,
				"startTime": <string: HH:MM:SS>,
				"endTime": <string: HH:MM:SS>,
				"location": <string>,
				"theme": <string>,
				"description": <string>,
				"coverImg": <string>
			}
 * 		}
 */
const updateBasicDetails = async(req,res,next) => {
	try{
		const gatheringId = req.params.gatheringId;
		const input = req.body
		const gathering = 
			await gatheringServices.updateBasicDetails(gatheringId, input);
		return res.json({ gathering })
	} catch(err){
		return next(err)
	}
};
/** Handle delete request to delete a gathering.
 * Request data - 
 * 		params.gatheringId
 * Return response status 204 with empty body.
 */
const deleteGathering = async(req,res,next) => {
	try{
		const gatheringId = req.params.gatheringId;
		await gatheringServices.deleteGathering(gatheringId);
		return res.status(204).send()
	} catch(err){
		return next(err)
	}
};

/** Handles get request to retreive gatherings that user is associated with.
 * Request data - 
 * 		params.username
 * Return response with json body
 * 		{
 * 			"gatherings": {
				"guest": [
					{
						"id": <num>,
						"host": <string>,
						"title": <string>,
						"date": "<string: YYYY-MM-DD>,
						"startTime": <string: HH:MM:SS>,
						"location": <string>,
						"theme": <string,
						"description": <string>,
						"coverImg": <string,
						"rsvp": <string: pending(default), accept, decline>
					}
				],
				"host": [
					{
						"id": <num>,
						"host": <string>,
						"title": <string>,
						"date": "<string: YYYY-MM-DD>,
						"startTime": <string: HH:MM:SS>,
						"location": <string>,
						"theme": <string,
						"description": <string>,
						"coverImg": <string
					}
				]
			}
 * 		}
 */
const getUsersGatherings = async(req,res,next) => {
	try{
		const user = req.params.username
		const gatherings = await gatheringServices.getUsersGatherings(user)
		return res.json({ gatherings })
	} catch(err){
		return next(err)
	}
}

const getUpcomingEvents = async(req,res,next) => {
	try{
		const user = req.params.username
		const events = await gatheringServices.getUpcomingEvents(user)
		return res.json({ events })
	} catch(err){
		return next(err)
	}
}

const getUpcomingHosting = async(req,res,next) => {
	try{
		const user = req.params.username
		const events = await gatheringServices.getHostingUpcoming(user)
		return res.json({ events })
	} catch(err){
		return next(err)
	}
}

const getUserInvitations = async(req,res,next) => {
	try{
		const user = req.params.username;
		const invitations = await gatheringServices.getUserInvitations(user)
		return res.json({ invitations })
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
	getUsersGatherings,
	getUserInvitations,
	getUpcomingEvents,
	getUpcomingHosting
}