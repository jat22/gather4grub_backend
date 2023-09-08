"use strict";

const { UnauthorizedError } = require('../expressError');
const gatheringServices = require('../services/gatherings.services');
const guestServices = require("../services/guests.services");
const dishServices = require("../services/dishes.services")

const ensureParticipant = async(req,res,next) => {
	try{
		const user = res.locals.user
		const gatheringId = req.params.gatheringId
		const userIsGuest = 
			await guestServices.
					checkIfGuestExistsOnGathering(user.username, gatheringId);
	
		if(!userIsGuest) throw new UnauthorizedError();
		return next();
	} catch(err){
		return next(err);
	}
	
};

const ensureHost = async(req,res,next) => {
	try{
		const user = res.locals.user;
		const gatheringId = req.params.gatheringId;
		const userIsHost = 
			await gatheringServices
					.isGatheringHost(user.username, gatheringId);
		
		if(!userIsHost) throw new UnauthorizedError();
		return next()
	} catch(err){
		return next(err)
	}
}

const ensureDishOwnerOrHost = async(req,res,next) => {
	try{
		const curUser = res.locals.user;
		const gatheringId = req.params.gatheringId
		const dishId = req.params.dishId

		const userIsOwner = 
			await dishServices.isDishOwner(curUser.username, dishId);

		const userIsHost = 
			await gatheringServices
					.isGatheringHost(user.username, gatheringId);

		if(!(userIsOwner || userIsHost)) throw new UnauthorizedError();
		return next()
	} catch(err){
		return next(err)
	}
}

const ensurePostAuthor = async(req,res,next) => {
	try{

	} catch(err){

	}
}

const ensurePostAuthorOrHost = async(req,res,next) => {
	try{

	} catch(err){
		
	}
}

module.exports = {
	ensureParticipant,
	ensureHost,
	ensureDishOwnerOrHost,
	ensurePostAuthor,
	ensurePostAuthorOrHost
}