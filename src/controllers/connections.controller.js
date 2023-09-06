"use strict";

const connectionServices = require("../services/connection.services")

const listConnections = async(req,res,next) => {
	try{
		const connections = 
			await connectionServices.getConnectionsForUser(req.params.username);
		return res.json({ connections });
	} catch(err) {
		return next(err);
	};
};

const listConnectionRequests = async(req,res,next) => {
	try {
		const connectionRequests = 
			await connectionServices.getConnectionRequestsForUser(req.params.username);
		return res.json({ connectionRequests })
	} catch(err) {
		return next(err);
	}
};

const newConnectionRequest = async(req, res, next) => {
	try {
		const connectionRequest = 
			await connectionServices.createConnectionRequest(req.params.username, req.body)
		return res.json({ connectionRequest })
	} catch(err) {
		return next(err)
	}
};

const requestAcceptance = async(req,res,next) => {
	try {
		await connectionServices.handleRequestAccepted(req.params.username, req.params.reqId);
		return res.status(200).send()
	} catch(err) {
		return next(err)
	}
};

const requestDenial = async(req,res,next) => {
	try {
		await connectionServices.handleRequestDenial(req.params.username, req.params.reqId)
		return res.status(204).send()
	} catch(err){
		next(err)
	}
};

const removeConnection = async(req,res,next) => {
	try{
		await connectionServices.deleteExistingConnection(req.params.conectionId, req.params.username);
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