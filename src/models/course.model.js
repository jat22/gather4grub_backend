"use strict";

const db = require("../db");
const sql = require("../utils/sql.utils")

class Course {
	static async create(gatheringId, input){
		input.gatheringId = gatheringId
		const { columns, placeholders, values } = sql.formatInsertData(input)

		const result = await db.query(
			`INSERT INTO courses
				(${columns})
				VALUES (${placeholders})
				RETURNING 	id,
							name,
							gathering_id AS gatheringID,
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