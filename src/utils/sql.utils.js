const { BadRequestError }= require("../expressError")


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

const snakeToCamelCase = (snake) => {
	return snake.replace(/_([a-z])/g, (_, l) => l.toUpperCase());
}


const camelToSnakeCase = (camel) =>{
	return camel.replace(/[A-Z]/g, "_" + "$&").toLowerCase()
}

const generateMultiGuestAddValues = (values, eventId) => {

	const rows = []
	const placeholders = []
	values.forEach((v,i) => {
		rows.push(`(${eventId}, '${v}')`)
		placeholders.push(`$${i+1}`)
	})

	return {rows:rows, placeholders:placeholders.join(', ')}
}

module.exports = {
	formatUpdateData,
	formatInsertData,
	snakeToCamelCase,
	camelToSnakeCase,
	generateMultiGuestAddValues
}