"use strict"
const db = require("../db");
const sql = require("../utils/sql.utils");


class User {

	static async getAccount(username) {
		const result = await db.query(
			`SELECT ${this._returnAllColumns}
				FROM ${this._table}
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
			`SELECT ${this._credentialColumns}
				FROM ${this._table}
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
	static async create(
		{ username, password, firstName, lastName, email, role="user", phone=null, streetAddress=null, city=null, state=null, zip=null, tagLine=null, bio=null, birthdate=null, avatarUrl=null }) {

		const result = await db.query(
			`INSERT INTO ${this._table}
				(${this._allColumns})
				VALUES (${this._allColParams})
				RETURNING ${this._credentialColumns}`,
				[username, password, firstName, lastName, email, role, phone,
				streetAddress, city, state, zip, tagLine, bio, birthdate, avatarUrl]);

		const user = result.rows[0];

		return user;
	}

	static async update(username, input){

		const { columns, values } = sql.generateUpdateColVals(input, this._jsToSqlForUpdate);

		const result = await db.query(
			`UPDATE ${this._table}
				SET ${columns}
				WHERE username=$${values.length + 1}
				RETURNING ${this._returnAllColumns}`,
			[...values, username]);
		
		const user = result.rows[0];
		return user
	}

	static async remove(username){
		const result = await db.query(
			`DELETE
				FROM ${this._table}
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
		const result = await db.query(
			`SELECT username
				FROM ${this._table}
				WHERE username = $1`,
				[username]);

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
				FROM ${this._table}
				WHERE email = $1`,
				[email]);

		if(result.rows[0]) return ({ username : result.rows[0].username })

		return false
	}
	
	static _table = "users";
	static _jsToSqlForUpdate = {
		firstName : "first_name",
		lastName : "last_name",
		streetAddress : "street_address",
		tagLine : "tag_line",
		avatarUrl : "avatar_url"
	};
	static _returnAllColumns = 
					`username,
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
					avatar_url AS "avatarUrl"`;
	static _allColumns =
					`username,
					password, 
					first_name, 
					last_name, 
					email,
					role, 
					phone,
					street_address,
					city, 
					state, 
					zip, 
					tag_line,
					bio, 
					birthdate, 
					avatar_url`;
	static _credentialColumns =
					`username,
					password,
					role`;
	static _allColParams = `$1 ,$2, $3 ,$4, $5, $6, $7, $8, $9, $10, $11, $12 ,$13, $14, $15`;

	
}

module.exports = User;