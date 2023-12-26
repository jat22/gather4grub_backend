"use strict";

const db = require("../db");
const sqlUtility = require("../utils/sql.utils");


/**
 * Class for all Event related queries.
 */
class Event {
	/**
	 * Create a new event
	 * @param {string} host - host's username 
	 * @param {Object} details - event details object
	 * @returns {Object} event 
	 */
	static async create(host, details) {
		const { columns, placeholders, values } = 
			sqlUtility.formatInsertData(details);

		const result = await db.query(
			`INSERT INTO events
				(${columns}, host)
				VALUES (${placeholders}, $${values.length + 1})
				RETURNING 	id,
							host,
							title,
							date,
							start_time AS "startTime",
							end_time AS "endTime",
							location,
							description`,
				[...values, host]);
		
		const event = result.rows[0];
		return event;
	};

	/**
	 * Get the basic details of an event
	 * @param {number}} eventId 
	 * @returns {Object} basicDetail - object containing basic details of event
	 */
	static async getBasicDetails(eventId){

		const result = await db.query(
			`SELECT id,
					host,
					title,
					date,
					start_time AS "startTime",
					end_time AS "endTime",
					location,
					description
			FROM events
			WHERE id = $1`,
			[eventId]
		)

		const event = result.rows[0];
		return event;
	}

	/**
	 * update the basic details of an event
	 * @param {number} eventId 
	 * @param {Object} data 
	 * @returns {Object} event - updated event object
	 */
	static async updateBasicDetails(eventId, data){
		const { columns, values } = sqlUtility.formatUpdateData(data);

		const result = await db.query(
			`UPDATE events
				SET ${columns}
				WHERE id = $${values.length + 1}
				RETURNING	id,
							host,
							title,
							date,
							start_time AS "startTime",
							end_time AS "endTime",
							location,
							description`,
			[...values, eventId]
		);
		return result.rows[0];
		
	};

	/**
	 * Remove an event entirely
	 * @param {number} eventId 
	 * @returns {Object} event - delete event object with eventId
	 */
	static async remove(eventId){
		const result = await db.query(
			`DELETE FROM events
				WHERE id = $1
				RETURNING id`,
			[eventId]
		);
		return result.rows[0];
	};

	/**
	 * Get the host for a particular event
	 * @param {number} eventId 
	 * @returns {Object} eventHost - object with event host and eventId
	 */
	static async getHost(eventId){
		const result = await db.query(
			`SELECT id, host
			FROM events
			WHERE id = $1`,
			[eventId]
		);
		return result.rows[0];
	};

	/**
	 * get events that a user is a participant 
	 * @param {string} username 
	 * @returns {Array} events - array of event objects.
	 */
	static async getUsers(username){
		const result = await db.query(
			`SELECT e.id,
					e.host,
					e.title,
					e.date,
					e.start_time AS "startTime",
					e.end_time AS "endTime",
					e.location,
					e.description,
					g.rsvp AS "rsvp"
			FROM events AS e
			LEFT JOIN guests AS g
				ON e.id = g.event_id
			WHERE g.username = $1`,
			[username]);
		return result.rows;
	};
};

module.exports = Event;



	// static async exists(eventId){
	// 	const result = await db.query(
	// 		`SELECT id
	// 		FROM events
	// 		WHERE id = $1`,
	// 		[eventId]
	// 	)
	// 	const event = result.rows[0]
	// 	return event
	// }

	// static async getHosting(username){
	// 	const result = await db.query(
	// 		`SELECT id,
	// 				host,
	// 				title,
	// 				date,
	// 				start_time AS "startTime",
	// 				end_time AS "endTime",
	// 				location,
	// 				description
	// 		FROM events
	// 		WHERE host = $1`,
	// 		[username]
	// 	)
	// 	return result.rows
	// }