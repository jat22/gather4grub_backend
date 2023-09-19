"use strict";

const { BadRequestError } = require("../expressError");
const Dish = require("../models/dishes.model");
const gatheringServices = require("../services/gatherings.services");
const userServices = require("../services/user.services");

const getGatheringDishes = async(gatheringId) => {
	if(!(await gatheringServices.checkIfGatheringExists(gatheringId))){
		throw new BadRequestError("gathering does not exist")
	}
	const dishes = await Dish.getGatheringDishes(gatheringId);
	return dishes;
};

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

const removeDishFromGathering = async(gatheringId, dishId) => {
	if(!(await gatheringServices.checkIfGatheringExists(gatheringId))){
		throw new BadRequestError("gathering does not exist")
	};
	if(!(await checkIfDishExists(dishId))){
		throw new BadRequestError("dish does not exist")
	};

	await Dish.removeFromGathering(gatheringId, dishId);
}

const checkIfDishExists = async(dishId) => {
	const dish = Dish.exists(dishId);
	if(dish) return true;
	return false
}

const isDishOwner = async(username, gatheringDishId) =>{
	const owner = await Dish.getGatheringDishOwner(gatheringDishId);
	if(owner && owner === username) return true;
	return false
}

const getAllDishes = async() => {
	const dishes = await Dish.getAllDishes();
	return dishes
}

const getUsersDishes = async(username) => {
	const dishes = await Dish.getUsersDishs(username)
	return dishes
}

const getDishRecipe = async(dishId) => {
	const basicDetailsPromise = Dish.getBasicDetails(dishId);
	const ingredientsPromise = Dish.getIngredients(dishId);
	const [ basicDetails, ingredients ] = 
				await Promise.all([basicDetailsPromise, ingredientsPromise]);

	return 	{
				basicDetails : basicDetails,
				ingredients : ingredients
			}
}

const createNewDish = async(addedBy, details, ingredients) => {
	const newDish = await Dish.create(addedBy, details);

	const newDishIngredientPromises = ingredients.map(i => Dish.addIngredient(i));
	const newDishIngredients = await Promise.all(newDishIngredientPromises)
	
	return 	{
				details : newDish, 
				ingredients : newDishIngredients
			}
}

const editDishRecipe  = async(dishId, details, ingredients) => {
	const updatedDetails = await Dish.editBasicDetails(dishId, details);

	const updatedIngredientPromises = ingredients.map(async i => {
		if(i.id){
			return Dish.editIngredient(i.id, i.name, i.amount)
		} else{
			return Dish.addIngredient(i.name, i.dishId, i.amount)
		}
	});
	const updatedIngredients = await Promise.all(updatedIngredientPromises);

	return 	{
				details: updatedDetails, 
				ingredients: updatedIngredients
			}
}

const dishAddedBy = async(dishId) => {
	const dish = await Dish.getBasicDetails(dishId)
	return dish.addedBy
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
	getUsersDishes
}
