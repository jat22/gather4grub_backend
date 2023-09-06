"use strict";

const sortDietaryTags = (tags) => {
	const sortedTags = { prefernces : [], allergies : []}
	for(let tag in tags){
		if(tag.preference){
			sortedTags.prefernces.append(
				{id : tag.id, name : tag.name}
			);
		};
		if(tag.allergy){
			sortedTags.allergies.append(
				{id : tag_id, name : tag.name}
			);
		};
	}
	return sortedTags
}

module.exports = {
	sortDietaryTags
}