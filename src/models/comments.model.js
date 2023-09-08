"use strict";

class Comment {

	static async getForPost(postId){
		const result = await db.query(
			`SELECT id,
					body,
					post_id AS "postId,
					author
			FROM comments
			WHERE gathering_id = $1`,
			[postId]
		)
		return result.rows
	};

	static async create(postId, author, body){
		const result = await db.query(
			`INSERT INTO comments
			(body, post_id, author)
			VALUES($1,$2,$3)
			RETURNING	id,
						body,
						post_id AS postId,
						author`,
			[body, postId, author]
		);
		return result.rows[0]
	};

	static async edit(commentId, body){
		const result = await db.query(
			`UPDATE comments
			SET body = $1
			WHERE id = $2
			RETURNING 	id,
						body,
						post_id AS postId
						author`,
			[body, commentId]
		)
		return result.rows[0]
	};

	static async delete(commentId){
		const result = await db.query(
			`DELETE FROM comments
			WHERE id = $1
			RETURNING id`,
			[commentId]
		)
		return result.rows[0]
	};

}

module.exports = Comment