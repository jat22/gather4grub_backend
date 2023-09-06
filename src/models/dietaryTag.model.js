"use strict";
const db = require("../db")

class DietaryTag {
	static async findUserAllergyTags(username){
		const result = await db.query(
			`SELECT uat.id AS userTagId, a.id AS allergyId, a.name AS name
				FROM user_allergy_tags as uat
				JOIN allergies AS a
					ON uat.allergy_id = a.id
				WHERE uat.username = $1`,
				[username]
		);
		return result.rows;
	}

	static async findUserPrefTags(username){
		const result = await db.query(
			`SELECT upt.id AS userTagId, p.id AS prefId, p.name AS name
				FROM user_pref_tags as upt
				JOIN dietary_prefs AS p
					ON upt.pref_id = p.id
				WHERE upt.username = $1`,
				[username]
		);
		return result.rows;
	}

	static async createNewUserAllergyTag(username, allergyId){
		const result = await db.query(
			`INSERT INTO user_alergy_tags
				(username, allergy_id)
				VALUES ($1, $2)
				RETURNING id`,
				[username, allergyId]
		)
		return result.rows[0]
	};

	static async createNewUserPrefTag(username, prefId){
		const result = await db.query(
			`INSERT INTO user_preg_tags
				(username, pref_id)
				VALUES ($1, $2)`,
				[username, prefId]);
		return result.rows[0]
	}

	static async createNewPreference(name){
		const result = await db.query(
			`INSERT INTO dietary_prefs
				(name)
				VALUES ($1)
				RETURNING id, name`,
				[name]
		)
		return result.rows[0]
	}

	static async createNewAllergy(name){
		const result = await db.query(
			`INSERT INTO allergies
				(name)
				VALUES ($1)
				RETURNING id, name`,
				[name]
		);
		return result.rows[0];
	}

	static async checkIfAllergyExists(name){
		const result = await db.query(
			`SELECT id 
				FROM allergy_tags
				WHERE name = $1`,
				[name]);
		return result.rows[0];
	};

	static async checkifPreferenceExists(name){
		const result = await db.query(
			`SELECT id 
				FROM dietary_pref_tags
				WHERE name = $1`,
				[name]);
		return result.rows[0];
	};
}

module.exports = DietaryTag;