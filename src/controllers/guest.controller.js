"use strict";

const guestServices = require("../services/guests.services");

/** Handle get request to retrieve all guests for a gathering.
 * Request data -
 * 		params.gatheringId
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
const getGatheringGuests = async(req,res,next) => {
	try{
		const gatheringId = req.params.gatheringId;
		const guests = await guestServices.getGatheringGuests(gatheringId)
		return res.json({ guests })
	} catch(err){
		return next(err)
	}
};
/** Handle post request to add a guest to a gathering.
 * Request Data - 
 * 		params.gatheringId,
 * 		body: {guest:<string: username>}
 * Return response with json body
 * 		{
 * 			"guest": {
				"id": <num>,
				"gatheringId": <num>,
				"username": <string>,
				"rsvp": <string: pending(default), accept, decline>
			}
 * 		}
 */
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
/** Handle delete request to remove guest from gathering.
 * Request data - 
 * 		params.username
 * 		params.gatheringId
 * Returns response status 204 with empty body
 */
const removeGuestFromGathering = async(req,res,next) => {
	try{
		const gatheringId = req.params.gatheringId;
		const username = req.params.username
		await guestServices.removeGuestFromGathering(gatheringId, username)
		return res.status(204).send()
	} catch(err){
		return next(err)
	}
};
/** Handle put request for updating guest RSVP
 * Request data - 
 * 		params.gatheringId,
 * 		params.username
 * Return response with json body.
 * 		{
 * 			"guest": {
				"id": <num>,
				"gatheringId":<num>,
				"username": <string>,
				"rsvp": <string>
			}
 * 		}
 */
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