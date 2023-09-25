"use strict";

const { BadRequestError, NotFoundError } = require("../expressError");
const Gathering = require("../models/gatherings.model");
const Dish = require("../models/dishes.model");
const Post = require("../models/posts.model");
const guestServices = require("../services/guests.services");

/**
 * Gathering Object
 * @typedef {Object} GatheringBasicDetails
 * @property {number} id - gathering id
 * @property {string} host - username of gathering host
 * @property {string} title - gathering title
 * @property {string} date - date of gathering ("YYYY-MM-DD")
 * @property {string} startTime - time gathering startes ('HH:MM:SS')
 * @property {string} endTime - time gathering ends ('HH:MM:SS')
 * @property {string} location - location of gathering
 * @property {string} theme - host provided theme
 * @property {string} description - description of what the gatheirng is for etc.
 * @property {string} coverImg - an image for the gathering page.
 */

/**
 * Gathering input object
 * @typedef {Object} GatheringInput
 * @property {string} title - gathering title
 * @property {string} date - date of gathering ("YYYY-MM-DD")
 * @property {string} startTime - time gathering startes ('HH:MM:SS') - optional
 * @property {string} endTime - time gathering ends ('HH:MM:SS') - optional
 * @property {string} location - location of gathering - optional
 * @property {string} theme - host provided theme - optional
 * @property {string} description - description of what the gatheirng is for etc. - optional
 * @property {string} coverImg - an image for the gathering page. - optional
 */

/**
 * Guest object
 * @typedef {Object} Guest
 * @property {number} id
 * @property {string} username
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} rsvp
 */

/**
 * Dish object
 * @typedef {Object} GatheringDish
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {string} imgUrl
 * @property {number} courseId
 * @property {string} ownerUsername - username of guest bringing the dish
 */

/**
 * Post object
 * @typedef {Object} GatheringPosts
 * @property {number} id
 * @property {string} title
 * @property {string} body
 * @property {number} gatheringId
 * @property {string} postAuthor - username of post's author
 * @property {Array.<Comment>} comments
 */

/**
 * Comment object
 * @typedef {Object} PostComments
 * @property {number} id
 * @property {string} body
 * @property {number} postId
 * @property {string} author - username of comment author
 */

/**
 * 
 * @param {string} host 
 * @param {GatheringInput} 
 * @returns {GatheringBasicDetails}
 */

const createGathering = async(host, details) => {
	const gathering = await Gathering.create(host, details);
	return gathering
};

/**
 * Get basic details of gathering
 * @param {number} gatheringId 
 * @returns {GatheringBasicDetails}
 */
const getBasicDetailsOfGathering = async(gatheringId) => {
	if(!(await checkIfGatheringExists(gatheringId))){
		throw new BadRequestError("gathering does not exist")
	};

	const basicDetails = Gathering.getBasicDetails(gatheringId);

	return basicDetails
}

/**
 * Get full details of gathering
 * @param {number} gatheringId 
 * @returns {Object}
 * @property {GatheringBasicDetails} basic
 * @property {Array.<Guest>} guests
 * @property {Array.<Dish>} dishes
 * @property {Array.<Post>} posts
 */
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

/**
 * Edit basic details of gathering
 * @param {number} gatheringId 
 * @param {GatheringInput} data 
 * @returns {GatheringBasicDetails} gathering
 */
const updateBasicDetails = async(gatheringId, data) => {
	if(!(await checkIfGatheringExists(gatheringId))){
		throw new BadRequestError("gathering does not exist")
	};

	const gathering = 
		await Gathering.updateBasicDetails(gatheringId, data);
	return gathering
};

/**
 * Delete a gathering
 * @param {number} gatheringId 
 * @returns {undefined}
 */
const deleteGathering = async(gatheringId) => {
	const result = 
		await Gathering.remove(gatheringId);
	if(!result) throw new NotFoundError()

	return
};

/**
 * 
 * @param {string} username 
 * @param {number} gatheringId 
 * @returns {boolean} true if username and gathering host match
 */
const isGatheringHost = async(username, gatheringId) => {
	const gatheringHost = await Gathering.getHost(gatheringId);
	const host = gatheringHost.host
	if(host === username) return true;
	return false;
}

/**
 * Get gatherings that a user is associated with either as a guest or a host.
 * @param {string} username 
 * @returns {Object}
 * @property {Array.<GatheringBasicDetails>} guest
 * @property {Arry.<GatheringBasicDetails} host
 */
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