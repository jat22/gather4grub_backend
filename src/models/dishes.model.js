"use strict";

const db = require("../db");

class Dish {
	static async getGatheringDishes(gatheringId){
		const result = await db.query(
			`SELECT d.id,
					d.name,
					d.description,
					d.img_url AS "imgUrl",
					gd.course_id AS "courseId",
					gd.owner_username AS "ownerUsername"
				FROM gathering_dishes
				WHERE gathering_id = $1`,
			[gatheringId]
		);
		return result.rows
	};

	static async addToGathering(gatheringId, dishId, courseId, owner){
		const result = await db.query(
			`INSERT INTO gathering_dishes
				(gathering_id, dish_id, course_id, owner_username)
			VALUES ($1,$2,$3,$4)
			RETURNING	id AS "gatheringDishId"`,
			[gatheringId, dishId, courseId, owner]
		)

		return result.rows[0]
	};

	static async removeFromGathering(gatheringId, dishId){
		const result = await db.query(
			`DELETE FROM gathering_dishes
			WHERE gathering_id = $1 AND dish_id = $2
			RETURNING ud`,
			[gatheringId, dishId]
		)
		return result.rows[0]
	}

	static async exists(dishId){
		const result = await db.query(
			`SELECT id
			FROM dishes
			WHERE id = $1`,
			[dishId]
		)
		return result.rows[0]
	}

	static async getGatheringDishOwner(id){
		const result = await db.query(
			`SELECT owner_username AS owner
			FROM gathering_dishes
			WHERE id = $1`,
			[id]
		);
		return result.rows[0].owner
	}
};

module.exports = Dish


