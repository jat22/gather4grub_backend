"user strict";
const Connections = require("../models/connection.model");
const { BadRequestError, NotFoundError, InternalServerError, UnauthorizedError, GeneralDatabaseError } = require("../expressError");
const { DatabaseError } = require("pg");

/**
 * Retrieves a user's list of connections.
 * @param {string} username 
 * @returns {array} connectionList
 */
const getConnectionsForUser = async (username) => {
	try{
		const connectionList = 
			await Connections.listUserConnections(username);
		return connectionList.length > 0 ? connectionList : null;
	}catch(err){
		throw err;
	};
};

/**
 * Retrieves a list containing requests to user from other uses to connect.
 * @param {*} username 
 * @returns {array} requestList
 */
const getConnectionRequestsForUser = async (username) => {
	try{
		const pendingList = 
			await Connections.listUserConnectionRequests(username);
		return pendingList.length > 0 ? pendingList : null;
	}catch(err){
		throw err;
	};

};

/**
 * Creates a connection request.
 * @param {string} fromUsername - user that initiated connection request
 * @param {string} toUsername - user that the request is sent to
 * @returns {num} requestId
 */
const createConnectionRequest = async (fromUsername, toUsername) => {
	if(fromUsername === toUsername){
		throw new BadRequestError('From and to user can not be the same user.');
	}
	try{
		const result = await Connections.checkExistingAssociations(fromUsername, toUsername);

		if(result.request){
			throw new BadRequestError('There is already a pending connection request.');
		};
		if(result.connection){
			throw new BadRequestError('Users are already connected');
		};

		const connectionRequest = 
			await Connections.createConnectionRequest(fromUsername, toUsername);

		if(!connectionRequest){
			throw new GeneralDatabaseError('Connection request failed.');
		}
		return connectionRequest.id;
	}catch(err){
		if(err.code === 'P0001'){
			throw new BadRequestError(err.message);
		} else throw err;
	};
};

/**
 * Creates connection and removes request.
 * @param {string} username - username of user that was requested
 * @param {id} reqId - id of the request
 * @returns {Object} - connection
 */
const handleRequestAccepted = async (username, reqId) => {
	try{
		const connectionRequest = await Connections.getRequest(reqId);
		if(!connectionRequest) {
			throw new BadRequestError('Connecttion request does not exist.');
		} else if(connectionRequest.fromUsername === username){
			throw new BadRequestError('User can not have a connection with itself.');
		};

		const acceptResult = 
			await Connections.createConnection(username, connectionRequest.fromUsername);
		if(!acceptResult) {
			throw new GeneralDatabaseError("DatabaseError: new connection not created.");
		};

		const removeRequestResult = await Connections.deleteConnectionRequest(reqId);
		if(!removeRequestResult) {
			throw new GeneralDatabaseError("DatabaseError: connection request not removed.");
		};
	
		return acceptResult;
	}catch(err){
		if(err.code === 'P0001'){
			throw new BadRequestError(err.message);
		} else throw err;
	};
};

/**
 * Removes connection request.
 * @param {string} username - username of user that was requested.
 * @param {num} reqId - id of the request
 * @returns {undefined}
 */
const handleRequestDenial = async(username, reqId) => {
	try{
		const connectionRequest = await Connections.getRequest(reqId);
		if(!connectionRequest) throw new NotFoundError("request does not exist");
		if(!connectionRequest.toUsername === username) throw new UnauthorizedError();

		const result = await Connections.deleteConnectionRequest(reqId);
		if(!result) throw new GeneralDatabaseError();

		return;
	}catch(err){
		throw err;
	};
};

/**
 * deletes an exisitng user to user connection.
 * @param {number} connectionId 
 * @param {string} username 
 * @returns {undefined}
 */
const deleteExistingConnection = async (connectionId, username) => {
	try{
		const result = await Connections.deleteConnectionWithId(connectionId, username);
		if(!result) throw new GeneralDatabaseError('Connection not deleted.');

		return;
	}catch(err){
		throw err;
	};
	
};

module.exports = {
	getConnectionsForUser,
	getConnectionRequestsForUser,
	createConnectionRequest,
	handleRequestAccepted,
	handleRequestDenial,
	deleteExistingConnection
};