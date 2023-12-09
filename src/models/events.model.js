"use strict";

const db = require("../db");
const sqlUtility = require("../utils/sql.utils")

class Event {
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
		return event
	};

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
		return result.rows[0]
		
	}

	static async remove(eventId){
		const result = await db.query(
			`DELETE FROM events
				WHERE id = $1
				RETURNING id`,
			[eventId]
		);
		return result.rows[0]
	}

	static async getHost(eventId){
		const result = await db.query(
			`SELECT id, host
			FROM events
			WHERE id = $1`,
			[eventId]
		);
		return result.rows[0]
	}

	static async exists(eventId){
		const result = await db.query(
			`SELECT id
			FROM events
			WHERE id = $1`,
			[eventId]
		)
		const event = result.rows[0]
		return event
	}

	static async getUsers(username){
		const result = await db.query(
			`SELECT g.id,
					g.host,
					g.title,
					g.date,
					g.start_time AS "startTime",
					g.end_time AS "endTime",
					g.location,
					g.description,
					guests.rsvp AS "rsvp"
			FROM events AS g
			LEFT JOIN guests
				ON g.id = guests.event_id
			WHERE guests.username = $1`,
			[username]);
		
		return result.rows
	}

	static async getHosting(username){
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
			WHERE host = $1`,
			[username]
		)
		return result.rows
	}

	
}

module.exports = Event;