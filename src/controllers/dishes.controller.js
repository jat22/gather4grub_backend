"use strict";

const dishServices = require("../services/dishes.services")


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

const getDish = async(req,res,next) =>{
	try{
		const dishId = req.params.dishId;
		const dish = await dishServices.getDishRecipe(dishId);
		return res.json({ dish })
	} catch(err) {
		return next(err)
	}
}

const getAllDishes = async(req,res,next) => {
	try{
		const dishes = await dishServices.getAllDishes();
		return res.json({ dishes })
	} catch(err){
		return next(err)
	}
}

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

const deleteDish = async(req,res,next) =>{
	try{
		const dishId = req.params.dishId;
		await dishServices.deleteDish(dishId);
		return res.status(204).send();
	} catch(err) {
		return next(err)
	}
}

const getGatheringDishes = async(req,res,next) => {
	try{
		const gatheringId = req.params.gatheringId
		const dishes = 
			await dishServices.getGatheringDishes(gatheringId);
		return res.json({ dishes })
	} catch(err){
		return next(err)
	}
};

const addDishToGathering = async(req,res,next) => {
	try{
		const gatheringId = req.params.gatheringId;
		const dishId = req.params.dishId;
		const courseId = req.body.courseId;
		const owner = res.locals.user.username
		const dish = 
			await dishServices.addDishToGathering(gatheringId, dishId, courseId, owner);
		return res.json({ dish });
	} catch(err){
		return next(err)
	}
};

const removeDishFromGathering = async(req,res,next) => {
	try{
		const gatheringId = req.params.gatheringId;
		const dishId = req.params.dishId;
		await dishServices.removeDishFromGathering(gatheringId, dishId);
		return res.status(204).send()
	} catch(err){
		return next(err)
	}
};

const getUsersDishes = async(req,res,next) => {
	try{
		const user = req.params.username;
		const dishes = dishServices.getUsersDishes(user)
		return res.json({ dishes })
	} catch(err){
		return next(err)
	}
}



module.exports = {
	getGatheringDishes,
	addDishToGathering,
	removeDishFromGathering,
	postDish,
	getDish,
	putDish,
	deleteDish,
	getAllDishes,
	getUsersDishes
}