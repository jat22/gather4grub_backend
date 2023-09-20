"use strict";

const db = require("../db");
const sql = require("../utils/sql.utils");

class Dish {
	/**
	 * 
	 * @param {*} details 
	 * @param {Object}
	 */
	static async create(addedBy, details){
		details.addedBy = addedBy;
		const { columns, placeholders, values } = sql.formatInsertData(details)

		const dishResult = await db.query(
			`INSERT INTO dishes
				(${columns})
				VALUES(${placeholders})
				RETURNING 	id,
							name,
							source_name AS "sourceName",
							source_url AS "sourceUrl",
							added_by AS "addedBy",
							description,
							instructions,
							img_url AS "imgUrl"`,
				values);
		return dishResult.rows[0];
	}

	static async addIngredient(name, dishId, amount){
		const result = await db.query(
			`INSERT INTO ingredients
				(name, dish_id, amount)
				VALUES ($1,$2,$3)
				RETURNING 	id,
							name,
							dish_id AS "dishId",
							amount`,
			[name, dishId, amount]);

		return result.rows[0]
	}

	static async editIngredient(data){
		const id = data.id;
		delete data.id
		const { columns, values } = sql.formatUpdateData(data);

		const result = await db.query(
			`UPDATE ingredients
				SET ${columns}
				WHERE id = $${values.length + 1}
			RETURNING id, name, amount`,
			[...values, id]);

		return result.rows[0]
	}

	static async getAll(){
		const result = await db.query(
			`SELECT id,
					name,
					source_name AS "sourceName",
					source_url AS "sourceUrl",
					added_by AS "addedBy",
					description,
					instructions,
					img_url AS "imgUrl"
			FROM dishes`)

		return result.rows
	}

	static async getBasicDetails(dishId){
		const result = await db.query(
			`SELECT id,
					name,
					source_name AS "sourceName",
					source_url AS "sourceUrl",
					added_by AS "addedBy",
					description,
					instructions,
					img_url AS "imgUrl"
			FROM dishes
			WHERE id = $1`,
			[dishId]);
		return result.rows[0]
	}

	static async editBasicDetails(dishId, details){
		const { columns, values } = sql.formatUpdateData(details);
		const result = await db.query(
			`UPDATE dishes
				SET ${columns}
				WHERE id = $${values.length + 1}
			RETURNING 	id,
						name,
						source_name AS "sourceName",
						source_url AS "sourceUrl",
						added_by AS "addedBy",
						description,
						instructions,
						img_url AS "imgUrl"`,
			[...values, dishId]);
		
		return result.rows[0];
	}

	static async getIngredients(dishId){
		const result = await db.query(
			`SELECT id,
					name,
					amount
			FROM ingredients
			WHERE dish_id = $1`,
			[dishId])
		return result.rows;
	}

	static async getGatheringDishes(gatheringId){
		const result = await db.query(
			`SELECT d.id,
					d.name,
					d.description,
					d.img_url AS "imgUrl",
					gd.course_id AS "courseId",
					gd.owner_username AS "ownerUsername"
				FROM gathering_dishes AS gd
				JOIN dishes AS d
					ON gd.dish_id = d.id
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
			WHERE gathering_id = $1 AND id = $2
			RETURNING id`,
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

	static async getUsersDishes(username){
		const result = await db.query(
			`SELECT id,
					name,
					source_name AS "sourceName",
					source_url AS "sourceUrl",
					added_by AS "addedBy",
					description,
					instructions,
					img_url AS "imgUrl"
			FROM dishes
			WHERE added_by = $1`,
			[username]);
		return result.rows
	}
	static async remove(dishId){
		const result = await db.query(
			`DELETE FROM dishes
			WHERE id = $1
			RETURNING id`, [dishId]);

		return result.rows[0]
	}
};

module.exports = Dish


