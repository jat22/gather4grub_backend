"use strict";
const db = require("../db")
class Guest {
	static async findForGathering(gatheringId){
		const result = await db.query(
			`SELECT g.id,
					u.username,
					u.first_name AS "firstName",
					u.last_name AS "lastName",
					u.email,
					g.rsvp
			FROM guests AS g
			JOIN users AS u
				ON g.username = u.username
			WHERE g.gathering_id = $1`,
			[gatheringId]
		);

		return result.rows
	}

	static async addToGathering(gatheringId, username){
		debugger
		const result = await db.query(
			`INSERT INTO guests
				(gathering_id, username)
			VALUES ($1,$2)
			RETURNING 	id,
						gathering_id AS "gatheringId",
						username,
						rsvp`,
			[gatheringId, username]
		);

		return result.rows[0]
	}

	static async removeFromGathering(gatheringId, username){
		const result = await db.query(
			`DELETE FROM guests
				WHERE gathering_id = $1
					AND username = $2,
				RETURNING id`,
			[gatheringId, username]
		);

		return result.rows[0];
	}

	static async updateRsvp(username, rsvp){
		const result = await db.query(
			`UPDATE guests
				SET rsvp = $1
				WHERE username = $2
				RETURNING 	id,
							gathering_id AS "gatheringId",
							username,
							rsvp`,
			[rsvp,username]
		);

		return result.rows[0]
	}

	static async getGatheringGuestId(username, gatheringId){
		const result = await db.query(
			`SELECT id
				FROM guests
				WHERE username = $1
					AND gathering_id = $2`,
			[username, gatheringId]
		);
		return result.rows[0]
	}
}

module.exports = Guest