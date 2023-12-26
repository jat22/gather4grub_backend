"use strict";

const eventServices = require('../services/events.services');
const dishServices = require('../services/dishes.services')

/**
 * @route POST '/events/'
 * @desc create a new event
 * @access Token
 */
const createEvent = async(req,res,next) => {
	try{
		const host = res.locals.user.username;
		const partyDetails = req.body;
		const event = await eventServices.createEvent(host, partyDetails);
		return res.json({ event });
	} catch(err){
		return next(err);
	};
};

/**
 * @route GET '/events/:eventId/basic'
 * @desc Get the basic details of an event
 * @access Restricted - must be event participant
 */
const getBasicDetailsOfEvent = async(req,res,next) => {
	try{
		const eventId = req.params.eventId;
		const event = 
			await eventServices.getBasicDetailsOfEvent(eventId);
		return res.json({ event });
	} catch(err){
		return next(err);
	};
};

/**
 * @route GET '/events/:eventId/full'
 * @desc Gets all event information, including, guests, menu and comments.
 * @access Restricted - must be event participant
 */
const getFullDetailsOfEvent = async(req,res,next) => {
	try{
		const username = res.locals.user.username;
		const event = 
			await eventServices.getFullDetailsOfEvent(username, req.params.eventId);
		return res.json({ event });
	} catch(err){
		return next(err);
	};
};

/**
 * @route PUT '/events/:eventId:/basic
 * @desc Update basic details of an event
 * @access Restricted - event host only
 */
const updateBasicDetails = async(req,res,next) => {
	try{
		const eventId = req.params.eventId;
		const input = req.body;
		const event = 
			await eventServices.updateBasicDetails(eventId, input);
		return res.json({ event });
	} catch(err){
		return next(err);
	};
};

/**
 * @route DELETE '/events/:eventId/basic'
 * @desc deletes event
 * @access Restricted - event host only
 */
const deleteEvent = async(req,res,next) => {
	try{
		const eventId = req.params.eventId;
		await eventServices.deleteEvent(eventId);
		return res.status(204).send();
	} catch(err){
		return next(err);
	};
};

/**
 * @route GET '/users/:username/events/upcoming'
 * @desc get upcoming events that the user is a participant on
 * @access Owner
 */
const getUpcomingEvents = async(req,res,next) => {
	try{
		const user = req.params.username;
		const events = await eventServices.getAllEventsForUser(user);
		return res.json({ events });
	} catch(err){
		return next(err);
	};
};

/**
 * @route GET '/users/:username/invitations'
 * @desc get invitations for a user
 * @access Owner
 */
const getUserInvitations = async(req,res,next) => {
	try{
		const user = req.params.username;
		const invitations = await eventServices.getUserInvitations(user);
		return res.json({ invitations });
	} catch(err){
		return next(err);
	};
};

/**
 * @route GET '/events/:eventId/menu/categories'
 * @desc  get menu categories for event
 * @access Restricted - event participants only
 */
const getMenuCategories = async(req,res,next) => {
	try{
		const eventId = req.params.eventId;
		const categories = await eventServices.getMenuCategories(eventId);
		return res.json({ categories});
	} catch(err){
		return next(err);
	};
};

/**
 * @route GET '/events/:eventId/menu'
 * @desc get menu for event
 * @access Restricted - event participants only
 */
const getMenu = async(req,res,next) => {
	try{
		const eventId = req.params.eventId;
		const menu = await eventServices.getMenu(eventId);
		return res.json({menu});
	} catch(err){
		return next(err);
	};
};

/**
 * @route POST '/events/:eventId/menu'
 * @desc add item to event menu
 * @access Restricted - event participants only
 */
const addMenuItem = async(req,res,next) => {
	try{
		const eventId = req.params.eventId;
		const newItem = req.body.newItem;
		await eventServices.addMenuItem({...newItem, eventId:eventId});
		const menu = await eventServices.getMenu(eventId);
		return res.json({menu});
	} catch(err){
		return next(err);
	};
};

/**
 * @route POST '/events/:eventId/menu/categories'
 * @desc add a new menu category for event
 * @access Restrictied - event host only
 */
const addMenuCategory = async(req,res,next) => {
	try{
		const eventId = req.params.eventId;
		const newCategory = req.body.newCategory;
		const updatedMenu = await dishServices.addDishCategory(eventId, newCategory);
		return res.json({menu : updatedMenu});
	} catch(err){
		return next(err);
	};
};

/**
  * @route DELETE '/events/:eventId/menu/categories'
  * @desc remove a menu category
  * @access Restrictied - event host only
  */
 const removeMenuCategory = async(req,res,next) => {
 	try{
 		const eventId = req.params.eventId;
 		const updatedMenu = await dishServices.removeDishCategory(eventId, newCategory);
 		return res.json({menu : updatedMenu});
 	} catch(err){
 		return next(err);
 	};
 };

/**
 * @route DELETE '/events/:eventId/menu/:itemId'
 * @desc remove a dish from event menu
 * @access Restrictied - event host or dish owner only
 */
const deleteMenuItem = async(req,res,next) =>{
	try{
		const dishId = req.params.itemId;
		await dishServices.deleteDish(dishId);
		return res.status(204).send();
	} catch(err) {
		return next(err);
	};
};


module.exports = {
	createEvent,
	getBasicDetailsOfEvent,
	getFullDetailsOfEvent,
	updateBasicDetails,
	deleteEvent,
	getUserInvitations,
	getUpcomingEvents,
	getMenuCategories,
	getMenu,
	addMenuItem,
	addMenuCategory,
	removeMenuCategory,
	deleteMenuItem
}

// /**
//  * @route 
//  * @desc 
//  * @access 
//  */
// const removeMenuItem = async(req,res,next) => {
// 	try{
// 		const eventId = req.params.eventId;
// 		const dishId = req.params.body.dishId;
// 		await eventServices.removeMenuItem(dishId)
// 		return res.status(204)
// 	} catch(err){
// 		return next(err)
// 	}
// }
// /**
//  * @route 
//  * @desc 
//  * @access 
//  */
// const getUpcomingHosting = async(req,res,next) => {
// 	try{
// 		const user = req.params.username
// 		const events = await eventServices.getHostingUpcoming(user)
// 		return res.json({ events })
// 	} catch(err){
// 		return next(err)
// 	}
// }
// /**
//  * @route 
//  * @desc 
//  * @access 
//  */
// const getUsersEvents = async(req,res,next) => {
// 	try{
// 		const user = req.params.username
// 		const events = await eventServices.getUsersEvents(user)
// 		return res.json({ events })
// 	} catch(err){
// 		return next(err)
// 	}
// }