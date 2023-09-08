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
	const owner = Dish.getGatheringDishOwner(gatheringDishId);
	if(owner && owner === username) return true;
	return false
}

module.exports = {
	getGatheringDishes,
	addDishToGathering,
	removeDishFromGathering,
	isDishOwner
}
