"use strict";

const connectionServices = require("../services/connection.services")

/**
 * @route GET 'users/:username/connections'
 * @desc get a user's connections
 * @access Owner
 */
const listConnections = async(req,res,next) => {
	try{
		const username = req.params.username;
		const connections = 
			await connectionServices.getConnectionsForUser(username);
		return res.json({ connections });
	} catch(err) {
		return next(err);
	};
};

/**
 * @route GET '/users/:username/connections/requests'
 * @desc get a user's connections requests
 * @access Owner
 */
const listConnectionRequests = async(req,res,next) => {
	try {
		const connectionRequests = 
			await connectionServices.getConnectionRequestsForUser(req.params.username);
		return res.json({ connectionRequests });
	} catch(err) {
		return next(err);
	};
};

/**
 * @route POST '/users/:username/connections/requests
 * @desc create a user connection request
 * @access Owner
 */
const newConnectionRequest = async(req, res, next) => {
	try {
		const connectionRequestId = 
			await connectionServices.createConnectionRequest(req.params.username, req.body.toUsername);
		return res.json({ connectionRequestId });
	} catch(err) {
		return next(err);
	};
};

/**
 * @route PUT '/users/:username/connections/requests/:reqId'
 * @desc accept a connection request
 * @access Owner
 */
const requestAcceptance = async(req,res,next) => {
	try {
		await connectionServices.handleRequestAccepted(req.params.username, req.params.reqId);
		return res.status(204).send();
	} catch(err) {
		return next(err);
	}
};

/**
 * @route DELETE '/users/:username/connections/requests/:reqId'
 * @desc delete/deny a connection request
 * @access Owner
 */
const requestDenial = async(req,res,next) => {
	try {
		await connectionServices.handleRequestDenial(req.params.username, req.params.reqId);
		return res.status(204).send();
	} catch(err){
		next(err);
	};
};

/**
 * @route DELETE '/users/:username/connections/:connectionId'
 * @desc remove user connection
 * @access Owner
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