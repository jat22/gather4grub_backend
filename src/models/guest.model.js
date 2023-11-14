"use strict";
const db = require("../db")
class Guest {
	static async findForGathering(gatheringId){
		const result = await db.query(
			`SELECT g.id,
					g.gathering_id AS "gatheringId",
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
						first_name AS "firstName",
						last_name AS "lastName,
						email,
						rsvp`,
			[gatheringId, username]
		);

		return result.rows[0]
	}

	static async removeFromGathering(gatheringId, username){
		const result = await db.query(
			`DELETE FROM guests
				WHERE 	gathering_id = $1
				AND 	username = $2
			RETURNING id`,
			[gatheringId, username]
		);

		return result.rows[0];
	}

	static async updateRsvp(guestId, rsvp){
		const result = await db.query(
			`UPDATE guests
				SET rsvp = $1
				WHERE id = $2`,
			[rsvp,guestId]
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

	static async getInvitations(username){
		const result = await db.query(
			`SELECT guests.id AS id,
					gatherings.title AS title,
					gatherings.date
				FROM guests
					JOIN gatherings
					ON guests.gathering_id = gatherings.id
				WHERE guests.username = $1 AND guests.rsvp = 'pending'`,
				[username]
		)
		return result.rows
	}
}

module.exports = Guest