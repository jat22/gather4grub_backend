"use strict";

const connectionServices = require("../services/connection.services")

/**
 *  Handles get request for a specific user's connections
 * 	Request data - 
 * 		params: username:<string>
 * 
 * 	Returns response with json body
 * 		{
 * 			connections : [
 * 				{
 * 					connectionId:<num>,
 * 					username:<string>,
 * 					firstName:<string>,
 * 					lastName:<string>,
 * 					email:<string>,
 * 					avatarUrl:<string>,
 * 					tagLine:<string>
 * 				}
 * 			]
 * 		}
 */
const listConnections = async(req,res,next) => {
	try{
		const username = req.params.username
		const connections = 
			await connectionServices.getConnectionsForUser(username);
		return res.json({ connections });
	} catch(err) {
		return next(err);
	};
};

/** Handles get route for a specific users' pending connection requests.
 * 	Request data - 
 * 		params: username
 * 
 * 	Return response with json body
 * 	{
 * 		connectionRequests : [
 * 			{
 * 				requestId:<num>,
 * 				username:<string>,
 * 				firstName:<string>,
 * 				lastName:<string>,
 * 				email:<string>,
 * 				avatarUrl:<string>,
 * 				tagLine:<string>
 * 			}
 * 		]
 * 	}
 */

const listConnectionRequests = async(req,res,next) => {
	try {
		const connectionRequests = 
			await connectionServices.getConnectionRequestsForUser(req.params.username);
		return res.json({ connectionRequests })
	} catch(err) {
		return next(err);
	}
};

/** Handles post request for a connection request
 * 	Request data - 
 * 		params - username:<string>
 * 		body - {toUsername:<string>}
 * 
 * 	Returns response with json body
 * 	{
		"connectionRequestId" : <num>
	}
 */

const newConnectionRequest = async(req, res, next) => {
	try {
		const connectionRequestId = 
			await connectionServices.createConnectionRequest(req.params.username, req.body.toUsername)
		return res.json({ connectionRequestId })
	} catch(err) {
		return next(err)
	}
};

/** Handles put request to accept connection request.
 * 	Request Data - 
 * 		params : 	{
 * 						username: <string> (of the accepting user),
 * 						reqId:<num> (id of connection request)
 * 					}
 * 	Returns response with status 200 and empty body.
 */
const requestAcceptance = async(req,res,next) => {
	try {
		await connectionServices.handleRequestAccepted(req.params.username, req.params.reqId);
		return res.status(204).send()
	} catch(err) {
		return next(err)
	}
};

/** Handles delete request to decline a connection request
 * 	Request Data - 
 *		params : 	{
 * 						username: <string> (of the accepting user),
 * 						reqId:<num> (id of connection request)
 * 					}
 * 	Returns response with status 204 and empty body.
 */
const requestDenial = async(req,res,next) => {
	try {
		await connectionServices.handleRequestDenial(req.params.username, req.params.reqId)
		return res.status(204).send()
	} catch(err){
		next(err)
	}
};

/** Handles delete route to remove a connection 
 * Request Data - 
 * 		params: 	{
 * 						connectionId:<num>,
 * 						username:<string>
 * 					}
 * Returns response with status 204 and empty body.
*/
const removeConnection = async(req,res,next) => {
	try{
		await connectionServices.deleteExistingConnection(req.params.connectionId, req.params.username);
		return res.status(204).send();
	} catch(err) {
		return next(err);
	};
};


module.exports = {
	listConnections,
	listConnectionRequests,
	newConnectionRequest,
	requestAcceptance,
	requestDenial,
	removeConnection
}