"use strict"
const db = require("../db.js");
const bcrypt = require("bcrypt");

const { BCRYPT_WORK_FACTOR } = require("../config.js");
const { UnauthorizedError, BadRequestError, NotFoundError } = require("../expressError");

class User {
	/** authenticate user with username and password.
	 * 
	 * Returns { username }
	 * 
	 * Throws Unauthorized Error if user not found or wrong password.
	 */
	static async authenticate(username, password) {
		debugger
		const result = await db.query(
			`SELECT username, password FROM users
			WHERE username = $1`,
			[username]
		);
		const user = result.rows[0];
		console.log(result)
		if(user) {
			const isValid = await bcrypt.compare(password, user.password);
			if(isValid === true) {
				delete user.password;
				return user;
			}
		}

		throw new UnauthorizedError("Invalid username/password");
	}

	/** Register new user
	 * 
	 * Returns { username }
	 * 
	 * Throws BadRequest Error if duplicate username or email
	 */
	static async register(
		{
			username,
			password,
			firstName,
			lastName,
			email,
			phone=null,
			streetAddress=null,
			city=null,
			state=null,
			zip=null,
			tagLine=null,
			bio=null,
			birthdate=null,
			avatarUrl=null
		}) {
		console.log(db)
		const duplicateUsername = await db.query(
			`SELECT username
			FROM users
			WHERE username = $1`,
			[username]
		);

		if(duplicateUsername.rows[0]) {
			throw new BadRequestError(`${username} is already taken. Select another username.`)
		};

		const duplicatEmail = await db.query(
			`SELECT username
			FROM users
			WHERE email = $1`,
			[email]
		);

		if(duplicatEmail.rows[0]) {
			throw new BadRequestError(`${email} is associated with an existing account. Please login or signup with another email address.`)
		};

		const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

		const result = await db.query(
			`INSERT INTO users
				(username,
				password,
				first_name,
				last_name,
				email,
				phone,
				street_address,
				city,
				state,
				zip,
				tag_line,
				bio,
				birthdate,
				avatar_url)
			VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
			RETURNING username`,
			[
				username, 
				hashedPassword, 
				firstName, 
				lastName, 
				email, 
				phone, 
				streetAddress, 
				city, 
				state, 
				zip, 
				tagLine, 
				bio,
				birthdate, 
				avatarUrl ]
		);

		const user = result.rows[0];

		return user;
	}

	/** Get a particular user's information 
	 * 
	 * Returns
	 * 	{username, firstName, lastName, email, phone, streetAddress, city, state, zip, tagLine, bio, birthdata, avatarUrl}
	 * 
	 * Throws NotFoundError if username not found
	*/
	static async getDetails(username) {
		const result = await db.query(
			`SELECT username,
					first_name AS "firstName",
					last_name AS "lastName",
					email,
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
			WHERE username=$1`,
			[username]
		);

		const user = result.rows[0];

		if(!user) throw new NotFoundError(`${username} not found.`)

		return user
	}
}

module.exports = User;