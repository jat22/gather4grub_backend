"use strict";
const db = require("../db");
const { BadRequestError } = require("../expressError");


/**
 * Class for users' connection related database queries
 */
class Connections{
	/**
	 * Get a list of a user's connections
	 * @param {string} username 
	 * @returns {Array} users - array of user objects.
	 */
	static async listUserConnections(username) {
		const result = await db.query(
			`SELECT c.id AS "connectionId",
					u.username, 
					u.first_name AS "firstName", 
					u.last_name AS "lastName", 
					u.email AS "email",
					u.tag_line AS "tagLine",
					a.url AS "avatarUrl"
				FROM connections AS c
				JOIN users AS u 
					ON (c.user1_username = u.username AND c.user1_username != $1) 
					OR (c.user2_username = u.username AND c.user2_username != $1)
				LEFT JOIN avatars AS a
					ON u.avatar_id = a.id
				WHERE c.user1_username = $1
					OR c.user2_username = $1`,
				[username]);

		return result.rows;
	};

	/**
	 * get a list of a user's connection requets
	 * @param {string} username 
	 * @returns {Array} users = array of user objects
	 */
	static async listUserConnectionRequests(username){
		const result = await db.query(
			`SELECT r.id AS "requestId",
					u.username, 
					u.first_name AS "firstName", 
					u.last_name AS "lastName", 
					u.email,
					a.url AS "avatarUrl",
					u.tag_line AS "tagLine"
				FROM connection_requests AS r
				JOIN users AS u
					ON r.from_username = u.username
				LEFT JOIN avatars AS a
					ON u.avatar_id = a.id
				WHERE r.to_username = $1`,
				[username]);
		return result.rows;
	};

	/** 
	 * Create a connection request
	 * @param {string} fromUsername 
	 * @param {string} toUsername 
	 * @returns {Object} request 
	 */
	static async createConnectionRequest(fromUsername, toUsername){
		try{
			const result = await db.query(
				`INSERT INTO connection_requests
					(from_username, to_username)
					VALUES ($1, $2)
					RETURNING id`,
					[fromUsername, toUsername]);
			const newRequest =  result.rows[0];

			return newRequest;
		} catch(err){
			if(err.code === 'P0001'){
				throw new BadRequestError(err.message);
			} else throw err;
		};
	};

	/**
	 * delete a connection request
	 * @param {number} reqId 
	 * @returns {Object} request - object containing deleted request Id
	 */
	static async deleteConnectionRequest(reqId){
		const result = await db.query(
			`DELETE FROM connection_requests
				WHERE id = $1
				RETURNING id`,
				[reqId]);
		return result.rows[0];
	};

	/**
	 * create a connection between two users
	 * @param {string} username1 
	 * @param {string} username2 
	 * @returns {Object} connection - object containing connectionId
	 */
	static async createConnection(username1, username2){
		try{
			const result = await db.query(
				`INSERT INTO connections
					(user1_username, user2_username)
					VALUES ($1, $2)
					RETURNING id`,
					[username1, username2]);
			return result.rows[0];
		}catch(err){
			if(err.code === 'P0001'){
				throw new BadRequestError(err.message);
			} else throw err;
		};
	}

	/**
	 * delete a connection between users
	 * @param {number} connectionId 
	 * @param {string} username 
	 * @returns {Object} connection - Object containing id of deleted connection
	 */
	static async deleteConnectionWithId(connectionId, username){
		const result = await db.query(
			`DELETE FROM connections
				WHERE id = $1
					AND (user1_username = $2 OR user2_username = $2)
				RETURNING id`,
			[connectionId, username]);
		return result.rows[0];
	};

	/**
	 * get a particular connection request
	 * @param {number} reqId 
	 * @returns {Object} request
	 */
	static async getRequest(reqId){
		const result = await db.query(
			`SELECT id, 
					from_username AS "fromUsername",
					to_username AS "toUsername"
				FROM connection_requests
				WHERE id = $1`,
				[reqId]);
		return result.rows[0];
	};

	/**
	 * check for a connection or a connection request between two users.
	 * @param {string} username1 
	 * @param {string} username2 
	 * @returns {Object} associations -Object with a boolean for request and connection
	 */
	static async checkExistingAssociations(username1, username2){
		const requestsResult = await db.query(
			`SELECT id
				FROM normalized_request_pairs
				WHERE 
					(username1=$1 AND username2=$2)
					OR
					(username2=$1 AND username1=$2)`,
			[username1, username2]
		);
		const connectionsResult = await db.query(
			`SELECT id
				FROM normalized_connection_pairs
				WHERE 
					(username1=$1 AND username2=$2)
					OR
					(username2=$1 AND username1=$2)`,
			[username1, username2]
		);

		const requestExists = requestsResult.rows.length > 0;
		const connectionExists = connectionsResult.rows.length > 0;


		return {request:requestExists, connection:connectionExists};
	};
};

module.exports = Connections;



	// static async getConnection(connectionId){
	// 	const result = await db.query(
	// 		`SELECT id,
	// 				user1_username AS user1,
	// 				user2_username AS user2
	// 		FROM connections
	// 		WHERE id = $1`,
	// 		[connectionId] 
	// 	)
	// 	return result.rows[0]
	// }
