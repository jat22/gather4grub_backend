/** ERROR handler  */
class ExpressError extends Error {
	constructor(message, status) {
		super();
		this.message = message;
		this.status = status
	}
}

/** 404 NOT FOUND ERROR  */
class NotFoundError extends ExpressError {
	constructor(message = "Not Found") {
		super(message, 404);
	}
}

/** 401 UNAUTHORIZED ERROR */
class UnauthorizedError extends ExpressError {
	constructor(message = "Unauthorized") {
		super(message, 401);
	}
}

/** 403 FORBIDDEN ERROR  */
class ForbiddenError extends ExpressError {
	constructor(message = "Forbidden") {
		super(message, 403)
	}
}

/** 400 BAD REQUEST ERROR */
class BadRequestError extends ExpressError {
	constructor(message = "Bad Request") {
		super(message, 400)
	}
}

/** 500 INTERNAL SERVER ERROR */
class InternalServerError extends ExpressError {
	constructor(message = "Internal Server Error"){
		super(message, 500)
	}
}

module.exports = {
	ExpressError,
	NotFoundError,
	UnauthorizedError,
	ForbiddenError,
	BadRequestError,
	InternalServerError
}