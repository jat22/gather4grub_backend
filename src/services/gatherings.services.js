"use strict";

const { BadRequestError } = require("../expressError");
const Gathering = require("../models/gatherings.model");
const Dish = require("../models/dishes.model");
const Post = require("../models/posts.model");
const guestServices = require("../services/guests.services");

const createGathering = async(host, details) => {
	const gathering = await Gathering.create(host, details);
	return gathering
};

const getBasicDetailsOfGathering = async(gatheringId) => {
	if(!(await checkIfGatheringExists(gatheringId))){
		throw new BadRequestError("gathering does not exist")
	};

	const basicDetails = Gathering.getBasicDetails(gatheringId);

	return basicDetails
}

const getFullDetailsOfGathering = async(gatheringId) => {
	if(!(await checkIfGatheringExists(gatheringId))){
		throw new BadRequestError("gathering does not exist")
	};

	const basicDetailsPromise = Gathering.getBasicDetails(gatheringId);
	const guestsPromise = guestServices.getGatheringGuests(gatheringId);
	const dishesPromise = Dish.getGatheringDishes(gatheringId);
	const postsPromise = Post.getForGathering(gatheringId);

	const [ basicDetails, guests, dishes, posts ] = 
		await Promise.all(
			[basicDetailsPromise, guestsPromise, dishesPromise, postsPromise]);
	
	const allDetails = {
		basic : basicDetails,
		guests : guests,
		dishes : dishes,
		posts : posts
	};

	return allDetails
};

const updateBasicDetails = async(gatheringId, data) => {
	if(!(await checkIfGatheringExists(gatheringId))){
		throw new BadRequestError("gathering does not exist")
	};

	const gathering = 
		await Gathering.updateBasicDetails(gatheringId, data);
	return gathering
};

const deleteGathering = async(gatheringId) => {
	if(!(await checkIfGatheringExists(gatheringId))){
		throw new BadRequestError("gathering does not exist")
	};

	const result = 
		await Gathering.remove(gatheringId);
	return result
};

const checkIfGatheringExists = async(gatheringId) => {
	const gathering = await Gathering.exists(gatheringId);

	if(!gathering) return false;
	return true
}

const isGatheringHost = async(username, gatheringId) => {
	const gatheringHost = await Gathering.getHost(gatheringId);
	const host = gatheringHost.host
	if(host === username) return true;
	return false;
}

const getUsersGatherings = async(username) => {
	const gatheringsGuest = await Gathering.getUsers(username);
	const gatheringsHost = await Gathering.getHosting(username);
	return {guest : gatheringsGuest, host : gatheringsHost}
}

module.exports = {
	createGathering,
	getBasicDetailsOfGathering,
	getFullDetailsOfGathering,
	updateBasicDetails,
	deleteGathering,
	checkIfGatheringExists,
	isGatheringHost,
	getUsersGatherings
}