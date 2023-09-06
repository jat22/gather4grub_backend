"user strict";

const tagServices = require('../services/dietaryTag.services')

const getUserDietaryTags = async(req,res,next) => {
	try {
		const dietaryTags = 
			await tagServices.getUserDietaryTags(req.params.username)
		return res.json({ dietaryTags })
	} catch(err){
		return next(err)
	};
};

const addUserDietaryTags = async(req,res,next) => {
	try {
		const newTagIds = 
			await tagServices.addUserDietaryTags(req.params.username, req.body.tags)
		return res.json({ newTagIds })
	} catch(err){
		return next(err)
	};
};

const removeUserDietaryTags = async(req,res,next) => {
	try {
		await tagServices.removeUserDietaryTags(req.body.tagIds);
		return res.status(204).send();
	} catch(err){
		return next(err)
	};
};

module.exports = {
	getUserDietaryTags,
	addUserDietaryTags,
	removeUserDietaryTags
}