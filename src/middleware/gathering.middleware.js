"use strict";

const { UnauthorizedError } = require('../expressError');
const gatheringServices = require('../services/gatherings.services');
const guestServices = require("../services/guests.services");
const dishServices = require("../services/dishes.services");
const Post = require("../models/posts.model");
const Gathering = require('../models/gatherings.model');

const ensureParticipant = async(req,res,next) => {
	try{
		const user = res.locals.user.username
		const gatheringId = req.params.gatheringId
		const userIsGuest = 
			await guestServices.
					checkIfGuestExistsOnGathering(user, gatheringId);
		const host = await Gathering.getHost(gatheringId)
		if(userIsGuest || user === host.host ) return next();
		throw new UnauthorizedError();
	} catch(err){
		return next(err);
	}
	
};

const ensureHost = async(req,res,next) => {
	try{
		const user = res.locals.user.username;
		const gatheringId = req.params.gatheringId;
		const userIsHost = 
			await gatheringServices
					.isGatheringHost(user, gatheringId);

		if(!userIsHost) throw new UnauthorizedError();
		return next()
	} catch(err){
		return next(err)
	}
}

const ensureDishOwnerOrHost = async(req,res,next) => {
	try{
		const curUser = res.locals.user.username;
		const gatheringId = req.params.gatheringId
		const dishId = req.params.dishId

		const userIsOwner = 
			await dishServices.isDishOwner(curUser, dishId);

		const userIsHost = 
			await gatheringServices
					.isGatheringHost(curUser, gatheringId);
		if(!(userIsOwner || userIsHost)) throw new UnauthorizedError();
		return next()
	} catch(err){
		return next(err)
	}
}

const ensurePostAuthor = async(req,res,next) => {
	try{
		const user = res.locals.user.username;
		const postId = req.params.postId;
		const author = await Post.getAuthor(postId);

		if(user !== author) throw new UnauthorizedError();
		return next();
	} catch(err){
		return next(err)
	}
}

const ensurePostAuthorOrHost = async(req,res,next) => {
	try{
		const user = res.locals.user.username;
		const postId = req.params.postId;
		const gatheringId = req.params.gatheringId;
		const host = await Gathering.getHost(gatheringId);
		const author = await Post.getAuthor(postId);

		if(user === author || user === host) return next();
		throw new UnauthorizedError();
	} catch(err){
		return next(err)
	}
}

const ensureCommentAuthor = async(req,res,next) => {
	try{
		const user = res.locals.user.username;
		const commentId = req.params.commentId
		const author = await Comment.getAuthor(commentId)

		if(user !== author) throw new UnauthorizedError();
		return next();
	} catch(err){
		return next(err)
	}
};

const ensureCommentAuthorOrHost = async(req,res,next) => {
	try{
		const user = res.locals.user.username
		const authorPromsie = Comment.getAuthor(commentId);
		const hostPromise = Gathering.getHost(gatheringId);
		const [ author, host ] = Promise.all([authorPromsie, hostPromise])

		if(user === author || user === host) return next();
		throw new UnauthorizedError();
	}catch(err){
		return next(err)
	}
}

module.exports = {
	ensureParticipant,
	ensureHost,
	ensureDishOwnerOrHost,
	ensurePostAuthor,
	ensurePostAuthorOrHost,
	ensureCommentAuthor,
	ensureCommentAuthorOrHost
}