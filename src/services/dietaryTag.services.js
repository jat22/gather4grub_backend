"use strict";

const DietaryTag = require('../models/dietaryTag.model')
const userServices = require('../services/user.services')

const getUserDietaryTags = async(username) => {
	await userServices.checkIfUserExists(username);

	const promises = [ 
		DietaryTag.findUserAllergyTags(username),
		DietaryTag.findUserPrefTags(username)
	]
	const [ allergyTags, prefTags ] = await Promise.all(promises)

	return { allergyTags, prefTags }
}
/**
 * 
 * @param {Object} tags { existing : { allergies:[], perfs:[] }, 
 * 						  new : { allergies : [], prefs: [] } }
 */

const addUserDietaryTags = async(tags) => {
	if(tags.new){
		const newAllergyPromises = 
			tags.new.allergies.map(DietaryTag.createNewAllergy);
		const newPrefPromises =
			tags.new.prefs.map(DietaryTag.createNewPreference);
		const [ newAllergies, newPrefs ] = 
			await Promise.all([
				...newAllergyPromises, 
				...newPrefPromises
			]);
		
		newAllergies.forEach((a) => tags.exisiting.allergies.push(a));
		newPrefs.forEach((p) => tags.exisiting.prefs.push(p));
	}

	const allergyPromises = 
		tags.existing.allergies.map(DietaryTag.createNewUserAllergyTag);
	const prefPromises =
		tags.existing.prefs.map(DietaryTag.createNewUserPrefTag);
	const [ allergies, prefs ] = 
		await Promise.all([
			...allergyPromises,
			...prefPromises
		]);
	
	return { allergies, prefs }
};

const removeUserDietaryTags = async (tagIds) => {
	const promises = tagIds.map(DietaryTag.removeUserTag);
	const results = Promise.all(promises);

	return results
}

module.exports = {
	getUserDietaryTags,
	addUserDietaryTags,
	removeUserDietaryTags
}