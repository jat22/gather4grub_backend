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

	static async getEventMenu(eventId){
		const result = await db.query(
			`SELECT id,
					name,
					added_by AS "username",
					description,
					course_id AS "courseId"
			FROM dishes
			WHERE event_id = $1`,
			[eventId]
		);
		return result.rows
	};

	static async addToEvent(eventId, dishId, courseId, owner){
		const result = await db.query(
			`INSERT INTO event_dishes
				(event_id, dish_id, course_id, owner_username)
			VALUES ($1,$2,$3,$4)
			RETURNING	id AS "eventDishId"`,
			[eventId, dishId, courseId, owner]
		)

		return result.rows[0]
	};

	static async removeFromEvent(eventId, dishId){
		const result = await db.query(
			`DELETE FROM event_dishes
			WHERE event_id = $1 AND id = $2
			RETURNING id`,
			[eventId, dishId]
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

	static async getEventDishOwner(id){
		const result = await db.query(
			`SELECT owner_username AS owner
			FROM event_dishes
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


