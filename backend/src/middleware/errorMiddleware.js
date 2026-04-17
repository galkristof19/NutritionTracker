// Custom Error Classes
export class AppError extends Error {
	constructor(message, statusCode = 500) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = true;

		Error.captureStackTrace(this, this.constructor);
	}
}

export class ValidationError extends AppError {
	constructor(message) {
		super(message, 400);
	}
}

export class AuthError extends AppError {
	constructor(message = "Unauthorized") {
		super(message, 401);
	}
}

export class ForbiddenError extends AppError {
	constructor(message = "Forbidden") {
		super(message, 403);
	}
}

export class NotFoundError extends AppError {
	constructor(message = "Resource not found") {
		super(message, 404);
	}
}

export class ConflictError extends AppError {
	constructor(message = "Resource already exists") {
		super(message, 409);
	}
}

// Async error wrapper
export const catchAsync = (fn) => {
	return (req, res, next) => {
		fn(req, res, next).catch(next);
	};
};

// Central Error Handler Middleware
export const errorHandler = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;

	// Log error
	console.error("Error:", {
		message: err.message,
		statusCode: err.statusCode,
		stack: err.stack,
	});

	// Handle operational errors (custom errors)
	if (err.isOperational) {
		return res.status(err.statusCode).json({
			success: false,
			statusCode: err.statusCode,
			message: err.message,
		});
	}

	// Handle Firebase specific errors
	if (err.code === "auth/id-token-expired") {
		return res.status(401).json({
			success: false,
			statusCode: 401,
			message: "Token has expired",
		});
	}

	if (err.code === "auth/invalid-id-token") {
		return res.status(401).json({
			success: false,
			statusCode: 401,
			message: "Invalid token",
		});
	}

	// Handle database errors
	if (err.code === "23505") {
		// PostgreSQL unique constraint violation
		return res.status(409).json({
			success: false,
			statusCode: 409,
			message: "Resource already exists",
		});
	}

	if (err.code === "23503") {
		// PostgreSQL foreign key violation
		return res.status(400).json({
			success: false,
			statusCode: 400,
			message: "Invalid reference data",
		});
	}

	// Handle JSON parse errors
	if (err instanceof SyntaxError && "body" in err) {
		return res.status(400).json({
			success: false,
			statusCode: 400,
			message: "Invalid JSON in request body",
		});
	}

	// Generic error response for unexpected errors
	res.status(500).json({
		success: false,
		statusCode: 500,
		message: process.env.NODE_ENV === "production"
			? "Internal server error"
			: err.message,
	});
};
