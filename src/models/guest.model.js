"use strict";
const db = require("../db")
const SqlUtils = require('../../src/utils/sql.utils')

class Guest {
	static async findForEvent(eventId){
		const result = await db.query(
			`SELECT id,
					username,
					rsvp
			FROM guests
			WHERE event_id = $1`,
			[eventId]
		);

		return result.rows
	}

	static async addToEvent(eventId, username){
		const result = await db.query(
			`INSERT INTO guests
				(event_id, username)
			VALUES ($1, $2)`,
			[eventId, username]
		);
		return 
	}

	static async removeFromEvent(eventId, username){
		const result = await db.query(
			`DELETE FROM guests
				WHERE 	event_id = $1
				AND 	username = $2
			RETURNING id`,
			[eventId, username]
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

	static async getEventGuestId(username, eventId){
		const result = await db.query(
			`SELECT id
				FROM guests
				WHERE username = $1
					AND event_id = $2`,
			[username, eventId]
		);
		return result.rows[0]
	}

	static async getInvitations(username){
		const result = await db.query(
			`SELECT guests.id AS id,
					events.title AS title,
					events.date
				FROM guests
					JOIN events
					ON guests.event_id = events.id
				WHERE guests.username = $1 AND guests.rsvp = 'pending'`,
				[username]
		)
		return result.rows
	}
}

module.exports = Guest