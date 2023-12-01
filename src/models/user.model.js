"use strict"
const db = require("../db");
const sql = require("../utils/sql.utils");


class User {

	static async getAccount(username) {
		const result = await db.query(
			`SELECT username,
					first_name AS "firstName",
					last_name AS "lastName",
					email,
					role,
					phone,
					street_address AS "streetAddress",
					city,
					state,
					zip,
					tag_line AS "tagLine",
					bio,
					birthdate,
					avatar_url AS "avatarUrl"
				FROM users
				WHERE username = $1`,
				[username]);

		const user = result.rows[0];
		return user;
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
							password,
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
							role,
							phone,
							street_address AS "streetAddress",
							city,
							state,
							zip,
							tag_line AS "tagLine",
							bio,
							birthdate,
							avatar_url AS "avatarUrl"`,
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

		if(result.rows[0]) return ({ username : result.rows[0].username })

		return false
	}

	static async findUsers(input){
		const result = await db.query(
			`SELECT username,
					first_name AS "firstName",
					last_name AS "lastName",
					email,
					avatar_url AS avatarUrl
				FROM users
				WHERE email=$1 OR username=$1`,
			[input])
		return result.rows
	}
}

module.exports = User;