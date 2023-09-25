"user strict";

const Connections = require("../models/connection.model")
const userServices = require("../services/user.services")
const { BadRequestError, NotFoundError, InternalServerError, UnauthorizedError } = require("../expressError");

/**
 * Retrieves a user's list of connections.
 * @param {string} username 
 * @returns {array} connectionList
 */
const getConnectionsForUser = async (username) => {
	const connectionList = 
		await Connections.listUserConnections(username);
	return connectionList.length > 0 ? connectionList : null
};
/**
 * Retrieves a list containing requests to user from other uses to connect.
 * @param {*} username 
 * @returns {array} requestList
 */
const getConnectionRequestsForUser = async (username) => {
	const pendingList = 
		await Connections.listUserConnectionRequests(username);
	return pendingList.length > 0 ? pendingList : null
};

/**
 * Creates a connection request.
 * @param {string} fromUsername - user that initiated connection request
 * @param {string} toUsername - user that the request is sent to
 * @returns {num} connection request id
 */
const createConnectionRequest = async (fromUsername, toUsername) => {
	userServices.checkIfUserExists(toUsername)
	const connectionRequest = 
		await Connections.createConnectionRequest(fromUsername, toUsername);	
	if(!connectionRequest) {
		throw new InternalServerError("Database Error")
	};
	return connectionRequest.id	
};

/**
 * Creates connection and removes request.
 * @param {string} username - username of user that was requested
 * @param {id} reqId - id of the request
 * @returns {undefined}
 */
const handleRequestAccepted = async (username, reqId) => {
	const connectionRequest = await Connections.getRequest(reqId);
	if(!connectionRequest) throw new NotFoundError("request does not exist");
	if(connectionRequest.toUsername !== username) throw new UnauthorizedError();

	const acceptResult = 
		await Connections.createConnection(username, connectionRequest.fromUsername);
	if(!acceptResult) {
		throw new InternalServerError("database error: connection request acceptance not processed")
	};

	const removeRequestResult = await Connections.deleteConnectionRequest(reqId);
	if(!removeRequestResult) {
		throw new InternalServerError("database error: connection request not removed.")
	}

	return
};
/**
 * Removes connection request.
 * @param {string} username - username of user that was requested.
 * @param {num} reqId - id of the request
 * @returns {undefined}
 */
const handleRequestDenial = async(username, reqId) => {
	const connectionRequest = await Connections.getRequest(reqId);
	if(!connectionRequest) throw new NotFoundError("request does not exist");
	if(!connectionRequest.toUsername === username) throw new UnauthorizedError();

	const result = await Connections.deleteConnectionRequest(reqId);
	if(!result) throw new InternalServerError("database error: request not removed");

	return
}

/**
 * deletes an exisitng user to user connection.
 * @param {number} connectionId 
 * @param {string} username 
 * @returns {undefined}
 */
const deleteExistingConnection = async (connectionId, username) => {
	const connection = await Connections.getConnection(connectionId);
	if(connection.user1 !== username || connection.user2 !== username){
		throw new UnauthorizedError();
	}
	const result = await Connections.deleteConnectionWithId(connectionId, username)
	if(!result) throw new BadRequestError();

	return
};


module.exports = {
	getConnectionsForUser,
	getConnectionRequestsForUser,
	createConnectionRequest,
	handleRequestAccepted,
	handleRequestDenial,
	deleteExistingConnection
}