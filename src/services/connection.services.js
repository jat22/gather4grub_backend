"user strict";

const Connections = require("../models/connection.model")
const User = require("../models/user.model")
const userServices = require("../services/user.services")
const { UnauthorizedError, BadRequestError, NotFoundError, InternalServerError } = require("../expressError");
const { connect } = require("http2");

const getConnectionsForUser = async (username) => {
	const connectionList = 
		await Connections.listUserConnections(username);
	return connectionList.length > 0 ? connectionList : null
};

const getConnectionRequestsForUser = async (username) => {
	const pendingList = 
		await Connections.listConnectionRequests(username);
	return pendingList.length > 0 ? pendingList : null
};

const createConnectionRequest = async (fromUsername, toUsername) => {
	userServices.checkIfUserExists(toUsername)
	const connectionRequest = 
		await Connections.createConnectionRequest(fromUsername, toUsername);	
	if(!connectionRequest) {
		throw new InternalServerError("Connection request not sent.")
	};
	return connectionRequest	
};

const handleRequestAccepted = async (username, reqId) => {
	const connectionRequest = await Connections.getRequest(reqId);
	if(connectionRequest.toUsername !== username){
		throw new BadRequestError();
	};
	const result = 
		await Connections.createConnection(username, connectionRequest.fromUsername);
	if(!result) throw new InternalServerError();

	await Connections.deleteConnectionRequest(reqId);

	return result;
};

const handleRequestDenial = async(username, reqId) => {
	const connectionRequest = await Connections.getRequest(reqId);
	if(!(connectionRequest.toUsername === username 
		|| connectionRequest.fromUsername === username)){
			throw new BadRequestError();
	}

	const result = await Connections.deleteConnectionRequest(reqId);
	if(!result) throw new InternalServerError();

	return result
}

const deleteExistingConnection = async (connectionId, username) => {
	const result = await Connections.deleteConnectionWithId(connectionId, username)
	if(!result) throw new BadRequestError();

	return result
};


module.exports = {
	getConnectionsForUser,
	getConnectionRequestsForUser,
	createConnectionRequest,
	handleRequestAccepted,
	deleteExistingConnection
}