const { BadRequestError }= require("../expressError")


const generateUpdateColVals = (data, jsToSql) => {
	const keys = Object.keys(data);
	if(keys.length === 0) throw new BadRequestError("No data");

	const columns = keys.map((name, idx) => {
		return `"${jsToSql[name] || name}"=$${idx + 1}`
	})

	return {
		columns : columns.join(', '),
		values : Object.values(data)
	}
}

module.exports = {
	generateUpdateColVals
}