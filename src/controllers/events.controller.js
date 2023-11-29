"use strict";

const eventServices = require('../services/events.services');

/** Handle Post request to create a new event.
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
 * 			"event": {
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
const createEvent = async(req,res,next) => {
	try{
		const host = res.locals.user.username;
		const partyDetails = req.body
		const event = await eventServices.createEvent(host, partyDetails)
		return res.json({ event })
	} catch(err){
		return next(err)
	}
};

/** Handle get request for basic details of a event, ie. date, time, location,etc.
 * 
 * Request Data - 
 * 		params.eventId
 * Return response with json body
 * 		{
 * 			"event": {
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
const getBasicDetailsOfEvent = async(req,res,next) => {
	try{
		const eventId = req.params.eventId
		const event = 
			await eventServices.getBasicDetailsOfEvent(eventId);
		return res.json({ event })
	} catch(err){
		return next(err)
	}
}

/** Handle get request for full details of a event, includes guest list, dishes, and posts.
 * 
 * Request Data - 
 * 		params.eventId
 * Return response with json body
 * 		{
 * 			"event": {
 * 				"basic: {
					"id": <num>,
					"host": <string>,
					"title": <string>,
					"date": <string: YYYY/MM/DD>,
					"startTime": <string: HH:MM:SS>,
					"endTime": <string: HH:MM:SS>,
					"location": <string>,
					"description": <string>,
 				},
				"guests": [
					{
						"id": <num>,
						"username": <string>,
						"rsvp": "rsvp": <string: pending(default), accept, decline>
					}
				],
				"menu" : [
					{
						courseName: <string>,
						courseId:<num>
						items: [
							{	
								id:<num>
								name:<string>,
								description:<string>,
								user:<string>
							}
						]
					}
				],
				"comments" : [
					{
						"id": <string>,
						"content": <string>,
						"user": <string>
					}
				]
			}
 * 		}
 */
const getFullDetailsOfEvent = async(req,res,next) => {
	try{
		const event = 
			await eventServices.getFullDetailsOfEvent(req.params.eventId);
		return res.json({ event })
	} catch(err){
		return next(err)
	}
};
/** Handle put request to edit basic details of a event.
 * Request Data -
 * 		params.eventId
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
 * 			"event": {
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
		const eventId = req.params.eventId;
		const input = req.body
		const event = 
			await eventServices.updateBasicDetails(eventId, input);
		return res.json({ event })
	} catch(err){
		return next(err)
	}
};
/** Handle delete request to delete a event.
 * Request data - 
 * 		params.eventId
 * Return response status 204 with empty body.
 */
const deleteEvent = async(req,res,next) => {
	try{
		const eventId = req.params.eventId;
		await eventServices.deleteEvent(eventId);
		return res.status(204).send()
	} catch(err){
		return next(err)
	}
};

/** Handles get request to retreive events that user is associated with.
 * Request data - 
 * 		params.username
 * Return response with json body
 * 		{
 * 			"events": {
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
const getUsersEvents = async(req,res,next) => {
	try{
		const user = req.params.username
		const events = await eventServices.getUsersEvents(user)
		return res.json({ events })
	} catch(err){
		return next(err)
	}
}

const getUpcomingEvents = async(req,res,next) => {
	try{
		const user = req.params.username
		const events = await eventServices.getUpcomingEvents(user)
		console.log(events)
		return res.json({ events })
	} catch(err){
		return next(err)
	}
}

const getUpcomingHosting = async(req,res,next) => {
	try{
		const user = req.params.username
		const events = await eventServices.getHostingUpcoming(user)
		return res.json({ events })
	} catch(err){
		return next(err)
	}
}

const getUserInvitations = async(req,res,next) => {
	try{
		const user = req.params.username;
		const invitations = await eventServices.getUserInvitations(user)
		return res.json({ invitations })
	} catch(err){
		return next(err)
	}
}

const getMenuCategories = async(req,res,next) => {
	try{
		const eventId = req.params.eventId
		const categories = await eventServices.getMenuCategories(eventId)
		return res.json({ categories})
	} catch(err){
		return next(err)
	}
}

const getMenu = async(req,res,next) => {
	try{
		const eventId = req.params.eventId
		const menu = await eventServices.getMenu(eventId)
		return res.json({menu})
	} catch(err){
		return next(err)
	}
}

const addMenuItem = async(req,res,next) => {
	try{
		const eventId = req.params.eventId
		const newItem = req.body.newItem
		await eventServices.addMenuItem({...newItem, eventId:eventId})
		const menu = await eventServices.getMenu(eventId)
		return res.json({menu})
	} catch(err){
		return next(err)
	}
}

const removeMenuItem = async(req,res,next) => {
	try{
		const eventId = req.params.eventId;
		const dishId = req.params.body.dishId;
		await eventServices.removeMenuItem(dishId)
		return res.status(204)
	} catch(err){
		return next(err)
	}
}


module.exports = {
	createEvent,
	getBasicDetailsOfEvent,
	getFullDetailsOfEvent,
	updateBasicDetails,
	deleteEvent,
	getUsersEvents,
	getUserInvitations,
	getUpcomingEvents,
	getUpcomingHosting,
	getMenuCategories,
	getMenu,
	addMenuItem
}