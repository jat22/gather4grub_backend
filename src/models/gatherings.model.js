"use strict";

const db = require("../db");
const sqlUtility = require("../utils/sql.utils")

class Gathering {
	static async create(host, details) {
		const { columns, placeholders, values } = 
			sqlUtility.formatInsertData(details);

		const result = await db.query(
			`INSERT INTO gatherings
				(${columns}, host)
				VALUES (${placeholders}, $${values.length + 1})
				RETURNING 	id,
							host,
							title,
							date,
							start_time AS "startTime",
							end_time AS "endTime",
							location,
							theme,
							description,
							cover_img AS "coverImg"`,
				[...values, host]);
		
		const gathering = result.rows[0];
		return gathering
	};

	static async getBasicDetails(gatheringId){

		const result = await db.query(
			`SELECT id,
					host,
					title,
					date,
					start_time AS "startTime",
					end_time AS "endTime",
					location,
					theme,
					description,
					cover_img AS "coverImg"
			FROM gatherings
			WHERE id = $1`,
			[gatheringId]
		)

		const gathering = result.rows[0];
		return gathering;
	}

	static async updateBasicDetails(gatheringId, data){
		const { columns, values } = sqlUtility.formatUpdateData(data);

		const result = await db.query(
			`UPDATE gatherings
				SET ${columns}
				WHERE id = ${values.length + 1}
				RETURNING	id,
							host,
							title,
							state,
							start_time AS "startTime",
							end_time AS "endTime",
							location,
							theme,
							description,
							cover_img AS "coverImg"`,
			[...values, gatheringId]
		);
		return result.row[0]
		
	}

	static async remove(gatheringId){
		const result = await db.query(
			`DELETE FROM gatherings
				WHERE id = $1
				RETURNING id`,
			[gatheringId]
		);
		return result.rows[0]
	}

	static async getHost(gatheringId){
		const result = await db.query(
			`SELECT id, host
			FROM gatherings
			WHERE id = $1`,
			[gatheringId]
		);
		return result.rows[0]
	}

	static async exists(gatheringId){
		const result = await db.query(
			`SELECT id
			FROM gatherings
			WHERE id = $1`,
			[gatheringId]
		)
		const gathering = result.rows[0]
		return gathering
	}

	static async getUsers(username){
		const result = await db.query(
			`SELECT g.id,
					g.host,
					g.title,
					g.date,
					g.start_time AS "startTime",
					g.start_time AS "startTime",
					g.location,
					g.theme,
					g.description,
					g.cover_img AS "coverImg",
					guests.rsvp AS "rsvp"
			FROM gatherings AS g
			JOIN guests
				ON g.id = guests.gathering_id
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
					start_time AS "startTime",
					location,
					description,
					cover_img AS "coverImg"
			FROM gatherings
			WHERE host = $1`,
			[username]
		)
		return result.rows
	}
}

module.exports = Gathering;