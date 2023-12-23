"use strict"
const db = require("../db");
const sql = require("../utils/sql.utils");


class User {

	static async getAccount(username) {
		const result = await db.query(
			`SELECT u.first_name AS "firstName",
					u.last_name AS "lastName",
					u.email AS "email",
					u.phone AS "phone",
					u.street_address AS "streetAddress",
					u.city AS "city",
					u.state AS "state",
					u.zip AS "zip",
					u.tag_line AS "tagLine"
				FROM users AS u
				WHERE u.username = $1`,
				[username]);

		const user = result.rows[0];
		return user;
	}

	static async getUserProfile(username) {
		const result = await db.query(
			`SELECT username,
				u.first_name AS "firstName",
				u.last_name AS "lastName",
				u.email AS email,
				u.tag_line AS "tagLine",
				a.url AS "avatarUrl"
			FROM users AS u
			LEFT JOIN avatars AS a
				ON u.avatar_id = a.id
			WHERE username=$1`,
			[username]
		)
		return result.rows[0]
	}
	/**
	 * Query user credentials by username
	 * @param {string} username 
	 * @returns {Promise<{username:string, password:string, role:string}>}
	 */
	static async getUserCredentials(username) {
		const result = await db.query(
			`SELECT username,
					password,
					role
				FROM users
				WHERE username = $1`,
				[username])
		
		const credentials = result.rows[0]
		
		return credentials
	}

	/**
	 * Create a new user and return their credentials.
	 * @param {Object} userInput 
	 * @returns {Promise<username:string, password:string, role:string}>}
	 */
	static async create(input) {
		const { columns, placeholders, values } = sql.formatInsertData(input)

		const result = await db.query(
			`INSERT INTO users
				(${columns})
				VALUES (${placeholders})
				RETURNING 	username,
							role`,
				values);

		const user = result.rows[0];

		return user;
	}

	static async update(username, input){

		const { columns, values } = sql.formatUpdateData(input);

		const result = await db.query(
			`UPDATE users
				SET ${columns}
				WHERE username=$${values.length + 1}
				RETURNING 	username,
							first_name AS "firstName",
							last_name AS "lastName",
							email,
							street_address AS "streetAddress",
							city,
							state,
							zip,
							tag_line AS "tagLine"`,
			[...values, username]);
		
		const user = result.rows[0];
		return user
	}

	static async remove(username){
		const result = await db.query(
			`DELETE
				FROM users
				WHERE username = $1
				RETURNING username`,
				[username]);
		
		const user = result.rows[0];

		return user
	}
	/**
	 * Check if username exists
	 * @param {string} username 
	 * @returns {Promise<boolean>}
	 */
	static async usernameExists (username){
		debugger
		const result = await db.query(
			`SELECT username
				FROM users
				WHERE username = $1`,
				[username]);
		debugger
		if(result.rows[0]) return true
		
		return false
	}
	/**
	 * Check if email exists
	 * @param {string} email 
	 * @returns {Promise<boolean>}
	 */
	static async emailExists(email){
		const result = await db.query(
			`SELECT username
				FROM users
				WHERE email = $1`,
				[email]);

		if(result.rows[0]) return true

		return false
	}


	static async findUsers(input){
		const result = await db.query(
			`SELECT u.username,
					u.first_name AS "firstName",
					u.last_name AS "lastName",
					u.email AS "email",
					a.url AS "avatarUrl"
				FROM users AS u
				LEFT JOIN avatars AS a
					ON u.avatar_id = a.id
				WHERE email=$1 OR username=$1`,
			[input])
		return result.rows
	}

	static async updatePassword(username, hashedPassword){
		const result = await db.query(
			`UPDATE users
				SET password = $1
				WHERE username = $2
			RETURNING username`,
			[hashedPassword, username]
		)
		return result.rows[0]
	}

	static async getAllAvatars(){
		const result = await db.query(
			`SELECT id,
					name,
					url
				FROM avatars`
		)
		return result.rows
	}

	static async getAvatar(username){
		const result = await db.query(
			`SELECT a.id AS id,
					a.url AS url
				FROM users as u
				JOIN avatars AS a
					ON u.avatar_id = a.id
				WHERE u.username=$1`,
			[username])
		return result.rows[0]
	}

	static async updateAvatar(username, avatarId){
		const result = await db.query(
			`UPDATE users
				SET avatar_id=$1
				WHERE username=$2`,
			[avatarId, username])
		return
	}

	static async getUsersConnectionId(searchedUser, currUser){
		const result = await db.query (
			`SELECT id
				FROM connections
				WHERE
					(user1_username = $1
						OR user2_username = $1)
					AND
					(user1_username = $2
						OR user2_username = $2)`,
			[searchedUser, currUser]
		);

		const connectionId = result.rows[0]?.id;
		if(!connectionId) return null;

		return (
			{
				searchedUser: searchedUser, 
				id : connectionId,
				type : 'connection'
			}
		)
	}

	static async getUsersRequestId(searchedUser, currUser){
		const result = await db.query(
			`SELECT id
			FROM connection_requests
			WHERE
				(from_username = $1
					AND to_username = $2)
				OR
				(from_username = $2
					AND to_username=$1)`,
			[searchedUser, currUser]
		);

		const requestId = result.rows[0]?.id
		if(!requestId) return null

		return (
			{
				searchedUser: searchedUser, 
				id : requestId,
				type : 'request'
			}
		);
	};
}

module.exports = User;