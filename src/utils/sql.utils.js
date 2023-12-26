const { BadRequestError }= require("../expressError")

/**
 * Takes input data and return sql column and value statements.
 * @param {Object} data 
 * @returns {Object} columnsValues
 */
const formatUpdateData = (data) => {
	const keys = Object.keys(data);
	if(keys.length === 0) throw new BadRequestError("No data");

	const columns = keys.map((name, idx) => {
		return `"${camelToSnakeCase(name)}"=$${idx + 1}`
	})

	return {
		columns : columns.join(', '),
		values : Object.values(data)
	}
}

/**
 * Takes input data and returns SQL column, placeholder, and value statements.
 * @param {Object} data 
 * @returns {Object}
 */
const formatInsertData = (data) => {
	const keys = Object.keys(data);
	if(keys.length === 0) throw new BadRequestError("No data");
	
	const columns = [];
	const placeholders = [];
	keys.forEach((name, idx) => {
		columns.push(camelToSnakeCase(name))
		placeholders.push(`$${idx+1}`)
	});
	return { 
		columns : columns.join(', '), 
		placeholders : placeholders.join(', '), 
		values : Object.values(data)
	}
}

/**
 * transform string from snake to camel case
 * @param {string} snake 
 * @returns {string} camel 
 */
const snakeToCamelCase = (snake) => {
	return snake.replace(/_([a-z])/g, (_, l) => l.toUpperCase());
}

/**
 * transform string from camel to snake case.
 * @param {string} camel 
 * @returns {string} snake
 */
const camelToSnakeCase = (camel) =>{
	return camel.replace(/[A-Z]/g, "_" + "$&").toLowerCase()
}

module.exports = {
	formatUpdateData,
	formatInsertData,
	snakeToCamelCase,
	camelToSnakeCase
}


// const generateMultiGuestAddValues = (values, eventId) => {

// 	const rows = []
// 	const placeholders = []
// 	values.forEach((v,i) => {
// 		rows.push(`(${eventId}, '${v}')`)
// 		placeholders.push(`$${i+1}`)
// 	})

// 	return {rows:rows, placeholders:placeholders.join(', ')}
// }