"use strict";

const { UnauthorizedError } = require('../expressError');
const eventServices = require('../services/events.services');
const guestServices = require("../services/guests.services");
const dishServices = require("../services/dishes.services");
const Post = require("../models/posts.model");
const Event = require('../models/events.model');
const Comment = require('../models/comments.model')

const ensureParticipant = async(req,res,next) => {
	try{
		const user = res.locals.user.username
		const eventId = req.params.eventId
		const userIsGuest = 
			await guestServices.
					checkIfGuestExistsOnEvent(user, eventId);
		const host = await Event.getHost(eventId)

		if(userIsGuest || user === host.host ) return next();
		throw new UnauthorizedError();
	} catch(err){
		return next(err);
	}
	
};

const ensureHost = async(req,res,next) => {
	try{
		const user = res.locals.user.username;
		const eventId = req.params.eventId;
		const userIsHost = 
			await eventServices
					.isEventHost(user, eventId);

		if(!userIsHost) throw new UnauthorizedError();
		return next()
	} catch(err){
		return next(err)
	}
}

const ensureDishOwnerOrHost = async(req,res,next) => {
	try{
		const curUser = res.locals.user.username;
		const eventId = req.params.eventId
		const dishId = req.params.dishId

		const userIsOwner = 
			await dishServices.isDishOwner(curUser, dishId);

		const userIsHost = 
			await eventServices
					.isEventHost(curUser, eventId);
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
		const eventId = req.params.eventId;
		const host = await Event.getHost(eventId);
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
		const commentId = req.params.commentId
		const eventId = req.params.eventId
		const authorPromsie = Comment.getAuthor(commentId);
		const hostPromise = Event.getHost(eventId);
		const [ author, host ] = await Promise.all([authorPromsie, hostPromise])

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