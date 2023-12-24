"use strict";

const { BadRequestError, NotFoundError, InternalServerError } = require("../expressError");
const Dish = require("../models/dishes.model");
const eventServices = require("./events.services");
const userServices = require("../services/user.services");
const Course = require("../models/course.model")

/**
 * Object that associates a dish instance with a gatheirng instance.
 * @typedef {Object} EventDish
 * @property {number} id - eventDish id
 * @property {number} dishId - id of dishe
 * @property {string} name - dish name
 * @property {string} description - dish description
 * @property {string} imgUrl - image url
 * @property {string} courseId - course if for meal course of event.
 * @property {string} dishOwner - username of guest bringing this the dish
 */

/**
 * Object representing a Dish
 * @typedef {Object} DishBasicDetails
 * @property {number} id - dish id
 * @property {string} name - dish name
 * @property {string} sourceName - source where user got recipe
 * @property {string} sourceUrl
 * @property {string} addedBy - user who added dish
 * @property {string} description - dish description
 * @property {string} instructions - recipe instructions
 * @property {string} imgUrl - image url
 */

/**
 * Object with data about dish ingredients
 * @typeDef {Object} DishIngredient
 * @property {number} id - ingredient id
 * @property {string} name - ingredient name
 * @property {string} amount - amount of the ingredient
 */

/**
 * Dish basic details input object.
 * @typedef {Object} DishInput
 * @property {string} name - dish name
 * @property {string} sourceName - name of recipe source
 * @property {string} sourceUrl
 * @property {string} description
 * @property {string} instructions
 * @property {string} imgUrl
 
 */

/**
 * Ingredient input object.
 * @typedef {Object} IngredientInput
 * @property {string} name
 * @property {string} amount
 */

/**
 * Retrieve all dishes associated with a particular event.
 * @param {number} eventId 
 * @returns {Array.<EventDish>} Array of eventDish objects 
 */
const getEventDishes = async(eventId) => {
	const dishes = await Dish.getEventMenu(eventId);
	return dishes;
};

/**
 * Adds a dish to a particular event.
 * @param {number} eventId 
 * @param {number} dishId 
 * @param {number} courseId 
 * @param {string} owner - username of guest bringing dish
 * @returns {EventDish} eventDish object
 */
const addDishToEvent = async(eventId, dishId, courseId, owner) => {
	// const eventDish = 
	// 	await Dish.addToEvent(eventId, dishId, courseId, owner)
	// return eventDish
	return 'TEST'
}
/**
 * Removes a dish from a event.
 * @param {number} eventId 
 * @param {number} dishId 
 * @returns {undefined}
 */
const removeDishFromEvent = async(eventId, dishId) => {
	const result = await Dish.removeFromEvent(eventId, dishId);

	if(!result) throw new NotFoundError("not found");

	return 
}

/**
 * Checks if a user is the owner of the gatheirng dish(ie bringing the dish)
 * @param {string} username 
 * @param {number} eventDishId 
 * @returns {boolean} if user matches owner true : false
 */
const isDishOwner = async(username, eventDishId) =>{
	const owner = await Dish.getEventDishOwner(eventDishId);

	if(owner && owner === username) return true;
	return false
}
/**
 * Retrieves all dishes in database.
 * @returns {Array.<DishBasicDetails>} array of dish objects
 */
const getAllDishes = async() => {
	const dishes = await Dish.getAll();
	return dishes
}
/**
 * Retrieve list of dishes added by user
 * @param {string} username 
 * @returns {Array.<DishBasicDetails>} array of dish objects
 */
const getUsersDishes = async(username) => {
	const dishes = await Dish.getUsersDishes(username)
	return dishes
}

/**
 * Get recipe for a dish
 * @param {number} dishId 
 * @returns {Object}
 * @property {DishBasicDetails} details
 * @property {Array.<Ingredients>} ingredients
 */
const getDishRecipe = async(dishId) => {
	const basicDetailsPromise = Dish.getBasicDetails(dishId);
	const ingredientsPromise = Dish.getIngredients(dishId);
	const [ basicDetails, ingredients ] = 
				await Promise.all([basicDetailsPromise, ingredientsPromise]);
	if(!basicDetails) return null
	return 	{
				details : basicDetails,
				ingredients : ingredients
			}
}

/**
 * Create a new dish
 * @param {string} addedBy 
 * @param {DishInput} details 
 * @param {Array.<IngredientInput>}
 * @returns {Object}
 * @property {DishBasicDetails} details
 * @property {Array.<IngredientInput>} ingredients
 */
const createNewDish = async(addedBy, details, ingredients) => {
	const newDish = await Dish.create(addedBy, details);
	const newDishIngredientPromises = 
			ingredients.map(i => Dish.addIngredient(i.name, newDish.id, i.amount));
	const newDishIngredients = await Promise.all(newDishIngredientPromises)
	
	return 	{
				details : newDish, 
				ingredients : newDishIngredients
			}
}

/**
 * 
 * @param {number} dishId 
 * @param {DishBasicDetails} details 
 * @param {Array.<IngredientInput>} ingredients 
 * @returns {Object}
 * @property {DishBasicDetails} details
 * @property {Array.<Ingredients>} ingredients
 */
const editDishRecipe  = async(dishId, details, ingredients) => {
	if(details) await Dish.editBasicDetails(dishId, details);
	if(ingredients){
		const updatedIngredientPromises = ingredients.map(async i => {
			if(i.id){
				return Dish.editIngredient(i)
			} else{
				return Dish.addIngredient(i.name, dishId, i.amount)
			}
		});
		await Promise.all(updatedIngredientPromises);
	}
	
	return await getDishRecipe(dishId)
}

/**
 * Retrieve username for who added a dish
 * @param {number} dishId 
 * @returns {string} username
 */
const dishAddedBy = async(dishId) => {
	const addedBy = await Dish.getAddedBy(dishId)
	return addedBy
}

/**
 * Delete a dish.
 * @param {number} dishId
 * @return {undefined}
 */
const deleteDish = async(dishId) => {
	const result = await Dish.remove(dishId);
	console.log(dishId)
	if(!result) throw new InternalServerError("Database error")
	return
}

const addDishCategory = async(eventId, newCategory) => {
	await Course.create(eventId, newCategory)
	const updatedMenu = await eventServices.getMenu(eventId)
	return updatedMenu
}

module.exports = {
	getEventDishes,
	addDishToEvent,
	removeDishFromEvent,
	isDishOwner,
	createNewDish,
	dishAddedBy,
	getDishRecipe,
	editDishRecipe,
	getAllDishes,
	getUsersDishes,
	deleteDish,
	addDishCategory
}
