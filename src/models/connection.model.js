"use strict"
const db = require("../db.js");
const bcrypt = require("bcrypt");

const { BCRYPT_WORK_FACTOR } = require("../config.js");
const { UnauthorizedError, BadRequestError, NotFoundError } = require("../expressError.js");
const sqlUtils = require("../utils/sql.utils.js");

class Connection {
	static async retrieveConnections(username){

	}

	static async createConnection(requestingUsername, requestedUsername){

	}

	static async updateConnection(username, connectionId){

	}

	static async removeConnection(username, connectionId){
		
	}
}