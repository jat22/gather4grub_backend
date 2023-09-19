"use strict";

const db = require("../db");

class Connections{
	static async listUserConnections(username) {
		const result = await db.query(
			`SELECT c.id AS "connectionId",
					u.username, 
					u.first_name AS "firstName", 
					u.last_name AS "lastName", 
					u.email,
					u.avatar_url AS "avatarUrl",
					u.tag_line AS "tagLine"
				FROM connections AS c
				JOIN users AS u 
					ON (c.user1_username = u.username AND c.user1_username != $1) 
					OR (c.user2_username = u.username AND c.user2_username != $1)
				WHERE c.user1_username = $1
					OR c.user2_username = $1`,
				[username]);

		return result.rows
	};

	static async listUserConnectionRequests(username){
		const result = await db.query(
			`SELECT r.id AS "requestId",
					u.username, 
					u.first_name AS "firstName", 
					u.last_name AS "lastName", 
					u.email,
					u.avatar_url AS "avatarUrl",
					u.tag_line AS "tagLine"
				FROM connection_requests AS r
				JOIN users AS u
					ON r.from_username = u.username
				WHERE r.to_username = $1`,
				[username]);
		return result.rows
	};

	static async createConnectionRequest(fromUsername, toUsername){
		const result = await db.query(
			`INSERT INTO connection_requests
				(from_username, to_username)
				VALUES ($1, $2)
				RETURNING id`,
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
			`DELETE FROM connections
				WHERE id = $1
					AND (user1_username = $2 OR user2_username = $2)
				RETURNING id`,
			[connectionId, username]);
		return result.rows[0]
	};

	static async getRequest(reqId){
		const result = await db.query(
			`SELECT id, 
					from_username AS "fromUsername",
					to_username AS "toUsername"
				FROM ${this._requestsTable}
				WHERE id = $1`,
				[reqId]);
		return result.rows[0]
	}

	static _connectionsTable = "connections";
	static _requestsTable = "connection_requests";
 	static _listColumns = 
		`u.username, 
		u.first_name AS firstName, 
		u.last_name AS lastName, 
		u.email,
		u.avatar_url AS avatarUrl,
		u.tag_line AS tagLine`;
}

module.exports = Connections