const jwt = require('jsonwebtoken');
const { SECRET_KEY, TOKEN_EXPIRATION } = require('../config')

/**
 * Generate token
 * @param {Object} user
 * @returns {string}
 */

const generateToken = (user) => {
	let payload = {
		username : user.username,
		role : user.role
	}

	return jwt.sign(payload, SECRET_KEY, { expiresIn : TOKEN_EXPIRATION})
}

module.exports = {
	generateToken
}