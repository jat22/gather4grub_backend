"use strict";
const db = require("../db")

/**
 * Class for all guest related queries.
 */
class Guest {
	/**
	 * get all guests for an event
	 * @param {number} eventId 
	 * @returns  {Array} guests
	 */
	static async findForEvent(eventId){
		const result = await db.query(
			`SELECT g.id AS "guestId",
					g.username AS "username",
					g.rsvp AS "rsvp",
					u.first_name AS "firstName",
					u.last_name AS "lastName",
					u.email AS "email",
					u.tag_line AS "tagLine",
					a.url AS "avatarUrl"
			FROM guests AS g
			JOIN users AS u
				ON g.username = u.username
			LEFT JOIN avatars AS a
				ON u.avatar_id = a.id
			WHERE g.event_id = $1`,
			[eventId]
		);
		return result.rows;
	};

	/**
	 * add a guest to an event
	 * @param {number} eventId 
	 * @param {string} username 
	 * @param {string} rsvp 
	 * @returns {undefined}
	 */
	static async addToEvent(eventId, username, rsvp="pending"){
		const result = await db.query(
			`INSERT INTO guests
				(event_id, username, rsvp)
			VALUES ($1, $2, $3)
			RETURNING
				id`,
			[eventId, username, rsvp]
		);
		return result.rows;
	};

	/**
	 * Remove a guest from an event entirely
	 * @param {number} eventId 
	 * @param {string} username 
	 * @returns {Object}
	 */
	static async removeFromEvent(eventId, username){
		const result = await db.query(
			`DELETE FROM guests
				WHERE 	event_id = $1
				AND 	username = $2
			RETURNING id`,
			[eventId, username]
		);
		return result.rows[0];
	};

	/**
	 * update a guest's RSVP
	 * @param {number} guestId 
	 * @param {string} rsvp 
	 * @returns {Object}
	 */
	static async updateRsvp(guestId, rsvp){
		const result = await db.query(
			`UPDATE guests
				SET rsvp = $1
				WHERE id = $2
				RETURNING id, rsvp`,
			[rsvp,guestId]
		);
		return result.rows[0];
	};

	/**
	 * Retrieve's a guest id for a particular user on a particular event
	 * @param {string} username 
	 * @param {number} eventId 
	 * @returns {Object}
	 */
	static async getEventGuestId(username, eventId){
		const result = await db.query(
			`SELECT id
				FROM guests
				WHERE username = $1
					AND event_id = $2`,
			[username, eventId]
		);
		return result.rows[0];
	};

	/**
	 * get all pending invitiations for a user
	 * @param {string} username 
	 * @returns {Array} invitiations - array of invitation objects
	 */
	static async getInvitations(username){
		const result = await db.query(
			`SELECT guests.id AS id,
					events.title AS title,
					events.date,
					events.id AS "eventId"
				FROM guests
					JOIN events
					ON guests.event_id = events.id
				WHERE guests.username = $1 AND guests.rsvp = 'pending'`,
				[username]
		);
		return result.rows;
	};

	/**
	 * get a particular user's rsvp to a particular event.
	 * @param {string} username 
	 * @param {number} eventId 
	 * @returns {Object}
	 */
	static async getUserRsvp(username, eventId){
		const result = await db.query(
			`SELECT id, rsvp
			FROM guests
			WHERE username=$1 AND event_id=$2`,
			[username, eventId]
		);
		return result.rows[0];
	};
};

module.exports = Guest