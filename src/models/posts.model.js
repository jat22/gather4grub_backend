"use strict";

const db = require("../db");
const sqlUtility = require("../utils/sql.utils");

class Post {
	static async getForEvent(eventId){
		const result = await db.query(
			`SELECT id,
					content,
					event_id AS "eventId",
					author AS "user"
			FROM comments
			WHERE event_id=$1`,
			[eventId]
		)

		return result.rows
	};

	static async create(eventId, comment, author){
		const result = await db.query(
			`INSERT INTO comments
				(event_id, content, author)
			VALUES($1,$2,$3)`,
			[eventId, comment, author]
		);
		return
	};

	static async edit(postId, input){
		const { columns, values } = sqlUtility.formatUpdateData(input);
		const result = await db.query(
			`UPDATE posts
			SET ${columns}
			WHERE id = $${values.length + 1}
			RETURNING 	id,
						title,
						body,
						event_id AS eventId,
						author`,
			[...values, postId]
		)
		return result.rows[0]
	};

	static async delete(commentId){
		const result = await db.query(
			`DELETE FROM comments
			WHERE id = $1`,
			[commentId]
		)
		return
	};

	static async getAuthor(postId){
		const result = await db.query(
			`SELECT author
			FROM posts
			WHERE id=$1`,
			[postId]
		)
		return result.rows[0].author
	}
}

module.exports = Post
