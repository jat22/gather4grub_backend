"use strict";
const db = require("../db")

/**
 * Class to manage comment queries.
 */
class Comment {

	/**
	 * 
	 * @param {number} eventId 
	 * @returns {array} comments
	 */
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

	/**
	 * create a new comment
	 * @param {number} eventId 
	 * @param {string} comment 
	 * @param {string} author 
	 * @returns {undefined}
	 */
	static async create(eventId, comment, author){
		const result = await db.query(
			`INSERT INTO comments
				(event_id, content, author)
			VALUES($1,$2,$3)`,
			[eventId, comment, author]
		);
		return
	};

	/**
	 * delete a comment
	 * @param {number} commentId 
	 * @returns {undefined}
	 */
	static async delete(commentId){
		const result = await db.query(
			`DELETE FROM comments
			WHERE id = $1`,
			[commentId]
		)
		return
	};

	/**
	 * 
	 * @param {number} commentId 
	 * @returns {string} username
	 */
	static async getAuthor(commentId){
		const result = await db.query(
			`SELECT author
				FROM comments
				WHERE id = $1`,
			[commentId]);
		return result.rows[0]?.author
	}

}

module.exports = Comment

	// static async edit(commentId, body){
	// 	const result = await db.query(
	// 		`UPDATE comments
	// 		SET body = $1
	// 		WHERE id = $2
	// 		RETURNING 	id,
	// 					body,
	// 					post_id AS postId,
	// 					author`,
	// 		[body, commentId]
	// 	)
	// 	return result.rows[0]
	// };