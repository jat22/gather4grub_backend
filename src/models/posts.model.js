"use strict";

const db = require("../db");
const sqlUtility = require("../utils/sql.utils");

class Post {
	static async getForGathering(gatheringId){
		const result = await db.query(
			`SELECT p.id,
					p.title,
					p.body,
					p.gathering_id AS "gatheringId",
					p.author AS "postAuthor",
					JSON_AGG(c.*) AS comments
			FROM posts AS p
			JOIN gatherings AS g ON p.gathering_id = g.id
			LEFT JOIN comments AS c ON p.id = c.post_id
			WHERE g.id = $1
			GROUP BY p.id`,
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
						gathering_id AS "gatheringId",
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
		return result.rows[0].author
	}
}

module.exports = Post