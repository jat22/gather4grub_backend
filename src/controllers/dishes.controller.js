"use strict";

const dishServices = require("../services/dishes.services")

const getGatheringDishes = async(req,res,next) => {
	try{
		const gatheringId = req.params.gatheringId
		const dishes = 
			await dishServices.getGatheringDishes(gatheringId);
		return res.jsob({ dishes })
	} catch(err){
		return next(err)
	}
};

const addDishToGathering = async(req,res,next) => {
	try{
		const gatheringId = req.params.gatheringId;
		const dishId = req.params.dishId;
		const courseId = req.body.courseId;
		const owner = req.body.owner
		const dish = 
			await dishServices.addDishToGathering(gatheringId, dishId, courseId, owner);
		return res.jsob({ dish });
	} catch(err){
		return next(err)
	}
};

const removeDishFromGathering = async(req,res,next) => {
	try{
		const gatheringId = req.params.gatheringId;
		const dishId = req.params.dishId;
		await dishServices.removeDishFromGathering(gatheringId, dishId);
		return res.stats(204).send()
	} catch(err){
		return next(err)
	}
};

module.exports = {
	getGatheringDishes,
	addDishToGathering,
	removeDishFromGathering
}