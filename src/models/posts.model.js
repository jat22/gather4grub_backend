"use strict";

const db = require("../db");
const sqlUtility = require("../utils/sql.utils");

class Post {
	static async getForGathering(gatheringId){
		const result = await db.query(
			`SELECT id,
					title,
					body,
					gathering_id AS gatheringId,
					author
			FROM posts
			WHERE gathering_id = $1`,
			[gatheringId]
		)
		return result.rows
	};

	static async create(title, body, gatheringId, author){
		const result = await db.query(
			`INSERT INTO posts
			(title, body, gathering_id, author)
			VALUES($1,$2,$3,$4)
			RETURNING	id,
						title,
						body,
						gathering_id AS "gatheringId,
						author`,
			[title, body, gatheringId, author]
		);
		return result.rows[0]
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
						gathering_id AS gatheringId,
						author`,
			[...values, postId]
		)
		return result.rows[0]
	};

	static async delete(postId){
		const result = await db.query(
			`DELETE FROM posts
			WHERE id = $1
			RETURNING id`,
			[postId]
		)
		return result.rows[0]
	};

	static async getAuthor(postId){
		const result = await db.query(
			`SELECT author
			FROM posts
			WHERE id=$1`,
			[postId]
		)
		return result.rows[0]
	}
}

module.exports = Post
