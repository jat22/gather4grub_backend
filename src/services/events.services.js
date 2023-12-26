"use strict";

const { NotFoundError } = require("../expressError");
const Event = require("../models/events.model");
const Dish = require("../models/dishes.model");
const Comment = require("../models/comments.model");
const guestServices = require("./guests.services");
const Guest = require("../models/guest.model");
const { sortEventsByDate, sortPastUpcoming } = require('../utils/sort.utils')
const Course = require('../models/course.model')
const { buildMenu } = require('../utils/sort.utils')

/**
 * EventBasic DetailsObject
 * @typedef {Object} EventBasicDetails
 * @property {number} id - event id
 * @property {string} host - username of event host
 * @property {string} title - event title
 * @property {string} date - date of event ("YYYY-MM-DD")
 * @property {string} startTime - time event startes ('HH:MM:SS')
 * @property {string} endTime - time event ends ('HH:MM:SS')
 * @property {string} location - location of event
 * @property {string} description - description of what the gatheirng is for etc.
 */

/**
 * Event input object
 * @typedef {Object} EventInput
 * @property {string} EventInput.title - event title
 * @property {string} EventInput.date - date of event ("YYYY-MM-DD")
 * @property {string} EventInput.startTime - time event startes ('HH:MM:SS') - optional
 * @property {string} EventInputendTime - time event ends ('HH:MM:SS') - optional
 * @property {string} EventInput.location - location of event - optional
 * @property {string} EventInput.description - description of what the gatheirng is for etc. - optional
 * @property {Array} EventInput.courses
 */

/**
 * Full Event Details
 * @typedef {Object} EventFullDetails
 * @property {number} id - event id
 * @property {string} host - username of event host
 * @property {string} title - event title
 * @property {string} date - date of event ("YYYY-MM-DD")
 * @property {string} startTime - time event startes ('HH:MM:SS')
 * @property {string} endTime - time event ends ('HH:MM:SS')
 * @property {string} location - location of event
 * @property {string} description - description of what the gatheirng is for etc.
 * @property {Array} guests - array of guests
 * @property {Array} menu - event menu course and items
 * @property {Array} comments - event comments
 * @property {Object} currUserRsvp
 */

/** 
 * create an event.
 * @param {string} host 
 * @param {EventInput} details
 * @returns {EventBasicDetails}
 */
const createEvent = async(host, details) => {

	const courses = [...details.courses];
	delete details.courses;
	const event = await Event.create(host, details);
	const eventId = event.id;
	const createCoursePromises = courses.map(c=>{
		Course.create(eventId, c);
	});
	const addHostRsvpPromise = await Guest.addToEvent(eventId, host, 'host');
	const res = await Promise.all([...createCoursePromises, addHostRsvpPromise]);

	return event;
};

/**
 * Get basic details of event
 * @param {number} eventId 
 * @returns {EventBasicDetails}
 */
const getBasicDetailsOfEvent = async(eventId) => {
	const basicDetails = await Event.getBasicDetails(eventId);
	return basicDetails;
};

/**
 * Get full details of event
 * @param {number} eventId 
 * @returns {Object} EventFullDetails
 */
const getFullDetailsOfEvent = async(username, eventId) => {
	const basicDetailsPromise = Event.getBasicDetails(eventId);
	const guestsPromise = guestServices.getEventGuests(eventId);
	const menuPromise =	getMenu(eventId);
	const postsPromise = Comment.getForEvent(eventId);
	const currUserRsvpPromise = Guest.getUserRsvp(username, eventId);

	const [ basicDetails, guests, menu, posts, currUserRsvp ] = 
		await Promise.all(
			[basicDetailsPromise, guestsPromise, menuPromise, postsPromise, currUserRsvpPromise]);
	
	const allDetails = {
		...basicDetails,
		guests : guests,
		menu : menu,
		comments : posts,
		currUserRsvp : currUserRsvp
	};

	return allDetails;
};

/**
 * Edit basic details of event
 * @param {number} eventId 
 * @param {EventInput} data 
 * @returns {EventBasicDetails} event
 */
const updateBasicDetails = async(eventId, data) => {
	const event = 
		await Event.updateBasicDetails(eventId, data.data);
	return event;
};

/**
 * Delete a event
 * @param {number} eventId 
 * @returns {undefined}
 */
const deleteEvent = async(eventId) => {
	const result = 
		await Event.remove(eventId);
	if(!result) throw new NotFoundError();

	return;
};

/**
 * 
 * @param {string} username 
 * @param {number} eventId 
 * @returns {boolean} true - if username and event host match
 */
const isEventHost = async(username, eventId) => {
	const eventHost = await Event.getHost(eventId);
	const host = eventHost.host;
	if(host === username) return true;
	return false;
};

/**
 * get all events that a user is associated with.
 * @param {string} username 
 * @returns {Object} events
 * @property {Array} events.past
 * @proprety {Array} events.upcoming
 */
const getAllEventsForUser = async(username) => {
	const events = await Event.getUsers(username);
	const eventsChronOrder = events ? sortEventsByDate(events) : null;
	const sortedEvents = sortPastUpcoming(eventsChronOrder);

	return sortedEvents;
}	;

/**
 * Get array of a user's invitations
 * @param {string} username 
 * @returns {Array} invitations
 */
const getUserInvitations = async(username) => {
	const invitations = await Guest.getInvitations(username);
	return invitations;
};

/**
 * Returns an array of the menu categories associated with an event.
 * @param {number} eventId 
 * @returns {Array} menuCategories
 */
const getMenuCategories = async(eventId) => {
	const categories = await Course.getForEvent(eventId);
	return categories;
};

/**
 * returns an array of 
 * @param {number} eventId 
 * @returns {Array} menu
 */
const getMenu = async(eventId) => {
	const dishPromise = Dish.getEventDishes(eventId);
	const coursePromise = Course.getForEvent(eventId);
	const [ dishes, courses ] = await Promise.all([dishPromise, coursePromise]);
	return buildMenu(courses,dishes);
};

/**
 * adds menu item, returns undefined.
 * @param {Object} newItem 
 * @returns {undefined}
 */
const addMenuItem = async (newItem) => {
	const details = {
		name: newItem.dishName,
		description: newItem.description,
		addedBy : newItem.username,
		eventId: newItem.eventId,
		courseId: newItem.courseId
	};
	await Dish.addItem(details);
	return;
};

module.exports = {
	createEvent,
	getBasicDetailsOfEvent,
	getFullDetailsOfEvent,
	updateBasicDetails,
	deleteEvent,
	isEventHost,
	getUserInvitations,
	getAllEventsForUser,
	getMenuCategories,
	getMenu,
	addMenuItem
};

	// const upcomingHostEvents = await getHostingUpcoming(username);
	// const upcomingGuestEvents = allGuestEventsSorted ? sortPastUpcoming(allGuestEventsSorted).upcoming : null;
	// if(!upcomingGuestEvents && !upcomingHostEvents) return null

	// const allUpcoming = upcomingGuestEvents ? [...upcomingGuestEvents] : []
	// if(upcomingHostEvents){
	// 	upcomingHostEvents.forEach(e => {
	// 		e['isHost'] = true;
	// 		allUpcoming.push(e)
	// 	})
	// } 
	// const allUpcomingSorted = sortEventsByDate(allUpcoming)

	/**
//  * Get events that a user is associated with either as a guest or a host.
//  * @param {string} username 
//  * @returns {Object} 
//  * @property {Array.<EventBasicDetails>} guest
//  * @property {Arry.<EventBasicDetails} host
//  */
// const getUsersEvents = async(username) => {
// 	const events = await Event.getUsers(username);
// 	const sortedEventss = sortEventsByDate(events)

// 	return sortPastUpcoming(sortedEventss)
// }

// const getHostingUpcoming = async(username) => {
// 	const events = await Event.getHosting(username);
// 	const sortedEvents = sortEventsByDate(events);
// 	return sortPastUpcoming(sortedEvents)?.upcoming;
// }