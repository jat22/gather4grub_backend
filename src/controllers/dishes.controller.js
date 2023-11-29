"use strict";

const dishServices = require("../services/dishes.services")

/** Handles dish post route, creating a new dish
 * 	Request data - 
 * 		current username (from locals)
 * 		body : 	{
 * 					detials :{
 * 						name : <string>, REQ
 * 						sourceName : <string>,
 * 						sourceUrl : <string>,
 * 						description : <string>, REQ
 * 						instructions : <string>, REQ
 * 						imgUrl : <string>,
 * 					},
 * 					ingredients : [
 * 						{
 * 							name : <string>, REQ
 * 							amount : <string> REQ
 * 						}
 * 					] REQ
 * 				}
 * 	Return response with json body
 * 		{ newDish: 
 * 			{
 * 				details: {
 * 					id:<num>,
 * 					name:<string>,
 * 					sourceName:<string>,
 * 					sourceUrl:<string>,
 * 					addedBy:<string>,
 * 					description:<string>,
 * 					instructions:<string>,
 * 					imgUrl:<string
 * 				},
 * 				ingredients: [
 * 					{
 * 						id:<num>,
 * 						name:<string>,
 * 						dishId:<num>,
 * 						amount:<string>
 * 					}
 * 				]
 * 			}
 * 		}
 */
const postDish = async(req,res,next) =>{
	try{
		const user = res.locals.user.username;
		const details = req.body.details;
		const ingredients = req.body.ingredients;
		const newDish = await dishServices.createNewDish(user, details, ingredients)
		return res.json({ newDish })
	} catch(err) {
		return next(err)
	}
}

/** Handle get request for a single dish
 * 	Request Data - 
 * 		params: dishId
 * 
 * 	Return response with json body
 * 		{ dish: 
 * 			{
 * 				details: {
 * 					id:<num>,
 * 					name:<string>,
 * 					sourceName:<string>,
 * 					sourceUrl:<string>,
 * 					addedBy:<string>,
 * 					description:<string>,
 * 					instructions:<string>,
 * 					imgUrl:<string
 * 				},
 * 				ingredients: [
 * 					{
 * 						id:<num>,
 * 						name:<string>,
 * 						dishId:<num>,
 * 						amount:<string>
 * 					}
 * 				]
 * 			}
 * 		}
 */
const getDish = async(req,res,next) =>{
	try{
		const dishId = req.params.dishId;
		const dish = await dishServices.getDishRecipe(dishId);
		return res.json({ dish })
	} catch(err) {
		return next(err)
	}
}

/** Handles get request for all dishes.
 * 	Returns response with json body
 * 		{ 
 * 			dishes: [
 * 				{
 * 					id:<num>,
 * 					name:<string>,
 * 					sourceName:<string>,
 * 					sourceUrl:<string>,
 * 					addedBy:<string>,
 * 					description:<string>,
 * 					instructions:<string>,
 * 					imgUrl:<string>
 * 				}
 * 			]
 * 		}
 */
const getAllDishes = async(req,res,next) => {
	try{
		const dishes = await dishServices.getAllDishes();
		return res.json({ dishes })
	} catch(err){
		return next(err)
	}
}

/** Handle dish put request to edit dish.
 * 	Request data - 
 * 		params.dishId
 * 		body:	{
 * 				details: {
 * 					id:<num>,
 * 					name:<string>,
 * 					sourceName:<string>,
 * 					sourceUrl:<string>,
 * 					addedBy:<string>,
 * 					description:<string>,
 * 					instructions:<string>,
 * 					imgUrl:<string
 * 				},
 * 				ingredients: [
 * 					{
 * 						id:<num>,
 * 						name:<string>,
 * 						dishId:<num>,
 * 						amount:<string>
 * 					}
 * 				]
 * 			} 
 * 		//// PASING ONLY Updating INformation
 * 		//// EXISTING ingredient should pass its existing ID
 * 	Return Response with json body
 * 		{
 * 			 dish: 
 * 			{
 * 				details: {
 * 					id:<num>,
 * 					name:<string>,
 * 					sourceName:<string>,
 * 					sourceUrl:<string>,
 * 					addedBy:<string>,
 * 					description:<string>,
 * 					instructions:<string>,
 * 					imgUrl:<string
 * 				},
 * 				ingredients: [
 * 					{
 * 						id:<num>,
 * 						name:<string>,
 * 						dishId:<num>,
 * 						amount:<string>
 * 					}
 * 				]
 * 			}
 * 		}
 */
const putDish = async(req,res,next) =>{
	try{
		const dishId = req.params.dishId;
		const details = req.body.details;
		const ingredients = req.body.ingredients
		const updatedDish = await dishServices.editDishRecipe(dishId, details, ingredients);
		return res.json({ updatedDish })
	} catch(err) {
		return next(err)
	}
}

/** Handle delete request which removes a dish
 * Request Data -
 * 		params.dishId
 * Return status 204 empty body
 */
const deleteDish = async(req,res,next) =>{
	try{
		const dishId = req.params.dishId;
		await dishServices.deleteDish(dishId);
		return res.status(204).send();
	} catch(err) {
		return next(err)
	}
}


/**
 * Hande get request for dishes for a event.
 * Request Data - 
 * 		params.eventId
 * Return response with json body.
 * 		{
			"dishes": [
				{
					"id": <num>,
					"name": <string>,
					"description": <string>,
					"imgUrl": <string>,
					"courseId": <string>,
					"ownerUsername": <string>
				}
			]
		}
 */
const getEventDishes = async(req,res,next) => {
	try{
		const eventId = req.params.eventId
		const dishes = 
			await dishServices.getEventDishes(eventId);
		return res.json({ dishes })
	} catch(err){
		return next(err)
	}
};

/** Handle post request to add dish to event.
 * Request Data - 
 * 		params.eventId
 * 		params.dishId
 * 		body : {courseId:<num>}
 * Return response with json body.
 * 		{
			"dish": {
				"eventDishId": 3
			}
 * 		}
 */
const addDishToEvent = async(req,res,next) => {
	try{
		const eventId = req.params.eventId;
		const dishId = req.params.dishId;
		const courseId = req.body.courseId;
		const owner = res.locals.user.username
		const dish = 
			await dishServices.addDishToEvent(eventId, dishId, courseId, owner);
		return res.json({ dish });
	} catch(err){
		return next(err)
	}
};

/** Handle delete request to remove a dish from a party
 * Request data - 
 * 		params.eventId
 * 		params.dishId
 * 
 * Return response with status 204, empty body.
 */
const removeDishFromEvent = async(req,res,next) => {
	try{
		const eventId = req.params.eventId;
		const dishId = req.params.dishId;
		await dishServices.removeDishFromEvent(eventId, dishId);
		return res.status(204).send()
	} catch(err){
		return next(err)
	}
};

/** Hande get request to get all dishes added by a user.
 * Request data - 
 * 		params.username
 * Return Resposne with json body
 * 		{"dishes": [
				{
					"id": <num>,
					"name": <string>,
					"description": <string>,
					"imgUrl": <string>,
					"courseId": <string>,
					"ownerUsername": <string>
				}
			]
 * 		}
 */
const getUsersDishes = async(req,res,next) => {
	try{
		const user = req.params.username;
		const dishes = await dishServices.getUsersDishes(user)
		return res.json({ dishes })
	} catch(err){
		return next(err)
	}
};

const addDishCategory = async(req,res,next) => {
	try{
		const eventId = req.params.eventId
		const newCategory = req.body.newCategory
		const updatedMenu = await dishServices.addDishCategory(eventId, newCategory)
		return res.json({menu : updatedMenu})
	} catch(err){
		return next(err)
	}
};

const removeDishCategory = async(req,res,next) => {
	try{
		const eventId = req.params.eventId
		const updatedMenu = await dishServices.removeDishCategory(eventId, newCategory)
		return res.json({menu : updatedMenu})
	} catch(err){
		return next(err)
	}
};





module.exports = {
	getEventDishes,
	addDishToEvent,
	removeDishFromEvent,
	postDish,
	getDish,
	putDish,
	deleteDish,
	getAllDishes,
	getUsersDishes,
	addDishCategory,
	removeDishCategory
}