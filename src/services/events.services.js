"use strict";

const { BadRequestError, NotFoundError } = require("../expressError");
const Event = require("../models/events.model");
const Dish = require("../models/dishes.model");
const Post = require("../models/posts.model");
const guestServices = require("./guests.services");
const Guest = require("../models/guest.model");
const { sortEventsByDate, sortPastUpcoming } = require('../utils/sort.utils')
const Course = require('../models/course.model')
const { buildMenu } = require('../utils/sort.utils')

/**
 * Event Object
 * @typedef {Object} EventBasicDetails
 * @property {number} id - event id
 * @property {string} host - username of event host
 * @property {string} title - event title
 * @property {string} date - date of event ("YYYY-MM-DD")
 * @property {string} startTime - time event startes ('HH:MM:SS')
 * @property {string} endTime - time event ends ('HH:MM:SS')
 * @property {string} location - location of event
 * @property {string} theme - host provided theme
 * @property {string} description - description of what the gatheirng is for etc.
 * @property {string} coverImg - an image for the event page.
 */

/**
 * Event input object
 * @typedef {Object} EventInput
 * @property {string} title - event title
 * @property {string} date - date of event ("YYYY-MM-DD")
 * @property {string} startTime - time event startes ('HH:MM:SS') - optional
 * @property {string} endTime - time event ends ('HH:MM:SS') - optional
 * @property {string} location - location of event - optional
 * @property {string} theme - host provided theme - optional
 * @property {string} description - description of what the gatheirng is for etc. - optional
 * @property {string} coverImg - an image for the event page. - optional
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
 * @typedef {Object} Dish
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {string} imgUrl
 * @property {number} courseId
 * @property {string} ownerUsername - username of guest bringing the dish
 */

/**
 * Post object
 * @typedef {Object} EventComments
 * @property {number} id
 * @property {string} content
 * @property {number} eventId
 * @property {string} postAuthor - username of post's author
 * @property {Array.<Comment>} comments
 */

/**
 * 
 * @param {string} host 
 * @param {EventInput} 
 * @returns {EventBasicDetails}
 */

const createEvent = async(host, details) => {
	const event = await Event.create(host, details);
	return event
};

/**
 * Get basic details of event
 * @param {number} eventId 
 * @returns {EventBasicDetails}
 */
const getBasicDetailsOfEvent = async(eventId) => {
	// if(!(await checkIfEventExists(eventId))){
	// 	throw new BadRequestError("event does not exist")
	// };

	const basicDetails = Event.getBasicDetails(eventId);

	return basicDetails
}

/**
 * Get full details of event
 * @param {number} eventId 
 * @returns {Object}
 * @property {EventBasicDetails} basic
 * @property {Array.<Guest>} guests
 * @property {Array.<Dish>} dishes
 * @property {Array.<Post>} posts
 */
const getFullDetailsOfEvent = async(eventId) => {
	// if(!(await checkIfEventExists(eventId))){
	// 	throw new BadRequestError("event does not exist")
	// };

	const basicDetailsPromise = Event.getBasicDetails(eventId);
	const guestsPromise = guestServices.getEventGuests(eventId);
	const menuPromise =	getMenu(eventId);
	const postsPromise = Post.getForEvent(eventId);

	const [ basicDetails, guests, menu, posts ] = 
		await Promise.all(
			[basicDetailsPromise, guestsPromise, menuPromise, postsPromise]);
	
	const allDetails = {
		...basicDetails,
		guests : guests,
		menu : menu,
		comments : posts
	};
	return allDetails
};

/**
 * Edit basic details of event
 * @param {number} eventId 
 * @param {EventInput} data 
 * @returns {EventBasicDetails} event
 */
const updateBasicDetails = async(eventId, data) => {
	// if(!(await checkIfEventExists(eventId))){
	// 	throw new BadRequestError("event does not exist")
	// };

	const event = 
		await Event.updateBasicDetails(eventId, data.data);
	return event
};

/**
 * Delete a event
 * @param {number} eventId 
 * @returns {undefined}
 */
const deleteEvent = async(eventId) => {
	const result = 
		await Event.remove(eventId);
	if(!result) throw new NotFoundError()

	return
};

/**
 * 
 * @param {string} username 
 * @param {number} eventId 
 * @returns {boolean} true if username and event host match
 */
const isEventHost = async(username, eventId) => {
	const eventHost = await Event.getHost(eventId);
	const host = eventHost.host
	if(host === username) return true;
	return false;
}

/**
 * Get events that a user is associated with either as a guest or a host.
 * @param {string} username 
 * @returns {Object}
 * @property {Array.<EventBasicDetails>} guest
 * @property {Arry.<EventBasicDetails} host
 */
const getUsersEvents = async(username) => {
	const events = await Event.getUsers(username);
	const sortedEventss = sortEventsByDate(events)

	return sortPastUpcoming(sortedEventss)
}

const getHostingUpcoming = async(username) => {
	const events = await Event.getHosting(username);
	const sortedEvents = sortEventsByDate(events);
	return sortPastUpcoming(sortedEvents).upcoming;
}

const getUpcomingEvents = async(username) => {
	const guestEvents = await Event.getUsers(username);
	const allGuestEventsSorted = guestEvents ? sortEventsByDate(guestEvents) : null;
	const upcomingHostEvents = await getHostingUpcoming(username);
	const upcomingGuestEvents = allGuestEventsSorted ? sortPastUpcoming(allGuestEventsSorted).upcoming : null;
	if(!upcomingGuestEvents && !upcomingHostEvents) return null

	const allUpcoming = upcomingGuestEvents ? [...upcomingGuestEvents] : []
	if(upcomingHostEvents){
		upcomingHostEvents.forEach(e => {
			e['isHost'] = true;
			allUpcoming.push(e)
		})
	} 
	const allUpcomingSorted = sortEventsByDate(allUpcoming)
	return allUpcomingSorted
}	

const getUserInvitations = async(username) => {
	const invitations = await Guest.getInvitations(username);
	return invitations
}

const getMenuCategories = async(eventId) => {
	const categories = await Course.getForEvent(eventId)
	return categories
}
 
const getMenu = async(eventId) => {
	const dishPromise = Dish.getEventDishes(eventId)
	const coursePromise = Course.getForEvent(eventId)
	const [ dishes, courses ] = await Promise.all([dishPromise, coursePromise])
	return buildMenu(courses,dishes)
}

const addMenuItem = async (newItem) => {
	const details = {
		name: newItem.dishName,
		description: newItem.description,
		addedBy : newItem.username,
		eventId: newItem.eventId,
		courseId: newItem.courseId
	}
	await Dish.addItem(details)
	return
}

module.exports = {
	createEvent,
	getBasicDetailsOfEvent,
	getFullDetailsOfEvent,
	updateBasicDetails,
	deleteEvent,
	isEventHost,
	getUsersEvents,
	getUserInvitations,
	getUpcomingEvents,
	getHostingUpcoming,
	getMenuCategories,
	getMenu,
	addMenuItem
}