"use strict";

const db = require("../db");

class Connections{
	static async listUserConnections(username) {
		const result = await db.query(
			`SELECT ${this._listColumns}
				FROM ${this._connectionsTable} AS c
				JOIN users AS u 
					ON c.user1_username = u.username
					OR c.user2_username = u.username
				WHERE c.user_from_username = $1
					OR c.user_to_username = $1`,
				[username]);

		return result.rows
	};

	static async listUserConnectionRequests(username){
		const result = await db.query(
			`SELECT ${this._listColumns}
				FROM ${this._requestsTable} AS r
				JOIN users AS u
					ON r.to_username = u.username
				WHERE r.to_username = $1`,
				[username]);
		return result.rows
	};

	static async createConnectionRequest(fromUsername, toUsername){
		const result = await db.query(
			`INSERT INTO ${this._requestsTable}
				(from_username, to_username)
				VALUES ($1, $2)
				RETURNING id`
				[fromUsername, toUsername]);
		return result.rows[0]
	};

	static async deleteConnectionRequest(reqId){
		const result = await db.query(
			`DELETE FROM ${this._requestsTable}
				WHERE id = $1
				RETURNING id`,
				[reqId]);
		return result.rows[0]
	};

	static async createConnection(username1, username2){
		const result = await db.query(
			`INSERT INTO ${this._connectionsTable}
				(user1_username, user2_username)
				VALUES ($1, $2)
				RETURNING id`,
				[username1, username2]);
		return result.rows[0]
	}

	static async deleteConnectionWithId(connectionId, username){
		const result = await db.query(
			`DELETE FROM ${this._connectionsTable}
				WHERE id = $1
					AND (user1_username = $2 OR user2_username = $2)
				RETURNING id`,
			[connectionId, username]);
		return result.rows[0]
	};

	static async getRequest(reqId){
		const result = await db.query(
			`SELECT id, 
					from_username AS 'fromUsername',
					to_username AS 'toUsername'
				FROM ${this._requestsTable}
				WHERE id = $1`,
				[reqId]);
		return result.rows[0]
	}

	static _connectionsTable = "connections";
	static _requestsTable = "connection_requests";
 	static _listColumns = 
		`u.username, 
		u.first_name AS 'firstName', 
		u.last_name AS 'lastName, 
		u.email,
		u.avatar,
		u.tag_line AS 'tagLine'`;
}

module.exports = Connections