"use strict";

const db = require("../db");
const { GeneralDatabaseError, BadRequestError } = require("../expressError");

class Connections{
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

		return result.rows
	};

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
		return result.rows
	};

	static async createConnectionRequest(fromUsername, toUsername){
		try{
			const result = await db.query(
				`INSERT INTO connection_requests
					(from_username, to_username)
					VALUES ($1, $2)
					RETURNING id`,
					[fromUsername, toUsername]);
			const newRequestId =  result.rows[0];
			if(!newRequestId){
				throw new GeneralDatabaseError();
			} 
			return newRequestId
		} catch(err){
			if(err.code === 'P0001'){
				throw new BadRequestError(err.message)
			} else throw err
		}
		
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

	static async getConnection(connectionId){
		const result = await db.query(
			`SELECT id,
					user1_username AS user1,
					user2_username AS user2
			FROM connections
			WHERE id = $1`,
			[connectionId] 
		)
		return result.rows[0]
	}

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

		if(requestsResult.rows[0]){
			throw new BadRequestError('A connection request already exists.')
		} else if(connectionsResult.rows[0]){
			throw new BadRequestError('Users are already connected.')
		};

		return false
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