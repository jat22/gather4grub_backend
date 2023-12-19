"use strict";

const guestServices = require("../services/guests.services");

/** Handle get request to retrieve all guests for a event.
 * Request data -
 * 		params.eventId
 * Return response with json body
 * 		{
 * 			guests: [
 * 				{
 * 					id:<num>,
 * 					username:<string>,
 * 					firstName: <string>,
 * 					lastName: <string>,
 * 					email:<string>,
 * 					rsvp:<string: pending(default), accept, decline>
 * 				}
 * 			]
 * 		}
 */
const getEventGuests = async(req,res,next) => {
	try{
		const eventId = req.params.eventId;
		const guests = await guestServices.getEventGuests(eventId)
		return res.json({ guests })
	} catch(err){
		return next(err)
	}
};
/** Handle post request to add a guest to a event.
 * Request Data - 
 * 		params.eventId,
 * 		body: {guest:<string: username>}
 * Return response with json body
 * 		{
 * 			"guest": {
				"id": <num>,
				"eventId": <num>,
				"username": <string>,
				"rsvp": <string: pending(default), accept, decline>
			}
 * 		}
 */
const addGuestsToEvent = async(req,res,next) => {
	try{
		const guestUsernames = req.body.usernames
		const eventId = req.params.eventId
		const updatedGuestList = await guestServices.addGuestsToEvent(eventId, guestUsernames)
		return res.json({ guests: updatedGuestList })
	} catch(err){
		return next(err)
	}
};
/** Handle delete request to remove guest from event.
 * Request data - 
 * 		params.username
 * 		params.eventId
 * Returns response status 204 with empty body
 */
const removeGuestFromEvent = async(req,res,next) => {
	try{
		const eventId = req.params.eventId;
		const username = req.params.username
		await guestServices.removeGuestFromEvent(eventId, username)
		return res.status(204).send()
	} catch(err){
		return next(err)
	}
};
/** Handle put request for updating guest RSVP
 * Request data - 
 * 		params.eventId,
 * 		params.username
 * Return response with json body.
 * 		{
 * 			"guest": {
				"id": <num>,
				"eventId":<num>,
				"username": <string>,
				"rsvp": <string>
			}
 * 		}
 */
const updateRSVP = async(req,res,next) => {
	try{
		const inviteId = req.params.inviteId;
		const rsvp = req.body.rsvp
		const result = await guestServices.updateEventRSVP(inviteId, rsvp);
		return res.status(201).json(result)
	} catch(err){
		return next(err)
	}
};

module.exports = {
	getEventGuests,
	addGuestsToEvent,
	removeGuestFromEvent,
	updateRSVP
}