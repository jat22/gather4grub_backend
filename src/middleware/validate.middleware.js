const jsonschema = require("jsonschema")
const { BadRequestError } = require("../expressError")

/** Accepts a json schema file.
 * Validates using jsconschema module.
 * Validation failure results in BadRequestError
*/
const validate = (schema) => (req,res,next) => {
	try{
		const validator = jsonschema.validate(req.body, schema);
		if(!validator.valid){
			const errs = validator.errors.map(e => e.stack);
			throw new BadRequestError(errs)
		}

		return next()
	} catch(err){
		return next(err)
	}
}

module.exports = {
	validate
}