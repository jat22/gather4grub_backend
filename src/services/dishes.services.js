"use strict";

const { BadRequestError, NotFoundError, InternalServerError } = require("../expressError");
const Dish = require("../models/dishes.model");
const gatheringServices = require("../services/gatherings.services");
const userServices = require("../services/user.services");

/**
 * Object that associates a dish instance with a gatheirng instance.
 * @typedef {Object} GatheringDish
 * @property {number} id - gatheringDish id
 * @property {number} dishId - id of dishe
 * @property {string} name - dish name
 * @property {string} description - dish description
 * @property {string} imgUrl - image url
 * @property {string} courseId - course if for meal course of gathering.
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
 * Retrieve all dishes associated with a particular gathering.
 * @param {number} gatheringId 
 * @returns {Array.<GatheringDish>} Array of gatheringDish objects 
 */
const getGatheringDishes = async(gatheringId) => {
	if(!(await gatheringServices.checkIfGatheringExists(gatheringId))){
		throw new BadRequestError("gathering does not exist")
	}
	const dishes = await Dish.getGatheringDishes(gatheringId);
	return dishes;
};

/**
 * Adds a dish to a particular gathering.
 * @param {number} gatheringId 
 * @param {number} dishId 
 * @param {number} courseId 
 * @param {string} owner - username of guest bringing dish
 * @returns {GatheringDish} gatheringDish object
 */
const addDishToGathering = async(gatheringId, dishId, courseId, owner) => {
	if(!(await gatheringServices.checkIfGatheringExists(gatheringId))){
		throw new BadRequestError("gathering does not exist")
	};
	if(!(await checkIfDishExists(dishId))){
		throw new BadRequestError("dish does not exist")
	};
	if(!(await userServices.checkIfUserExists(owner))){
		throw new BadRequestError("user does not exist")
	};

	const gatheringDish = 
		await Dish.addToGathering(gatheringId, dishId, courseId, owner)
	return gatheringDish
}
/**
 * Removes a dish from a gathering.
 * @param {number} gatheringId 
 * @param {number} dishId 
 * @returns {undefined}
 */
const removeDishFromGathering = async(gatheringId, dishId) => {
	const result = await Dish.removeFromGathering(gatheringId, dishId);

	if(!result) throw new NotFoundError("not found");

	return 
}

/**
 * Checks if a user is the owner of the gatheirng dish(ie bringing the dish)
 * @param {string} username 
 * @param {number} gatheringDishId 
 * @returns {boolean} if user matches owner true : false
 */
const isDishOwner = async(username, gatheringDishId) =>{
	const owner = await Dish.getGatheringDishOwner(gatheringDishId);

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
	const dish = await Dish.getBasicDetails(dishId)
	return dish.addedBy
}

/**
 * Delete a dish.
 * @param {number} dishId
 * @return {undefined}
 */
const deleteDish = async(dishId) => {
	const result = await Dish.remove(dishId);
	if(!result) throw new InternalServerError("Database error")
	return
}

module.exports = {
	getGatheringDishes,
	addDishToGathering,
	removeDishFromGathering,
	isDishOwner,
	createNewDish,
	dishAddedBy,
	getDishRecipe,
	editDishRecipe,
	getAllDishes,
	getUsersDishes,
	deleteDish
}
