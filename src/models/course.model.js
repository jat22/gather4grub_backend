"use strict";

const db = require("../db");
const sql = require("../utils/sql.utils")

class Course {
	static async create(eventId, input){
		input.eventId = eventId
		const { columns, placeholders, values } = sql.formatInsertData(input)

		const result = await db.query(
			`INSERT INTO courses
				(${columns})
				VALUES (${placeholders})
				RETURNING 	id,
							name,
							event_id AS eventID,
							notes`,
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
}

module.exports = Course