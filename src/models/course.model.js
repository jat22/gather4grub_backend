"use strict";

const db = require("../db");
const sql = require("../utils/sql.utils")

class Course {
	static async create(eventId, data){
		const input = {eventId : eventId, name : data}
		input.eventId = eventId
		const { columns, placeholders, values } = sql.formatInsertData(input)
		const result = await db.query(
			`INSERT INTO courses
				(${columns})
				VALUES (${placeholders})
				RETURNING 	id,
							name,
							event_id AS eventID`,
				values);

		return result.rows[0];
	}

	static async remove(courseId){
		const result = await db.query(
			`DELETE FROM courses
			WHERE id = $1
			RETURNING id`
		);
		return result.rows[0];
	}

	static async getForEvent(eventId){
		const result = await db.query(
			`SELECT id, name
			FROM courses
			WHERE event_id = $1`,
			[eventId]
		)
		return result.rows
	}
}

module.exports = Course