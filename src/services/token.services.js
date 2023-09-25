const jwt = require('jsonwebtoken');
const { SECRET_KEY, TOKEN_EXPIRATION } = require('../config')

/**
 * Generate token
 * @param {Object} user
 * @property {string} username
 * @property {string} role
 * @returns {string} JWT Token
 */
const generateToken = (user) => {
	let payload = {
		username : user.username,
		role : user.role
	}

	return jwt.sign(payload, SECRET_KEY)
}

module.exports = {
	generateToken
}