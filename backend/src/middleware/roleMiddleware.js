import { query } from "../config/db.js";
import { ForbiddenError, AuthError } from "./errorMiddleware.js";

// Get user role from Firebase Custom Claims or Database
const getUserRole = async (uid, customClaims) => {
	// Check Firebase Custom Claims first
	if (customClaims && customClaims.role) {
		return customClaims.role;
	}

	// Check database for user role
	try {
		const result = await query(
			"SELECT role FROM users WHERE uid = $1",
			[uid]
		);

		if (result.rows.length > 0) {
			return result.rows[0].role;
		}

		return "user"; // Default role
	} catch (error) {
		console.error("Error fetching user role from database:", error);
		throw new Error("Failed to fetch user role");
	}
};

// Check if user has required role
export const requireRole = (allowedRoles) => {
	return async (req, res, next) => {
		try {
			// Ensure user is authenticated
			if (!req.user) {
				throw new AuthError("User not authenticated");
			}

			const userRole = await getUserRole(req.user.uid, req.user.custom_claims);

			if (!allowedRoles.includes(userRole)) {
				throw new ForbiddenError(
					`Access denied. Required roles: ${allowedRoles.join(", ")}`
				);
			}

			// Store role in request for later use
			req.userRole = userRole;
			next();
		} catch (error) {
			next(error);
		}
	};
};

// Specific middleware for admin access
export const requireAdmin = async (req, res, next) => {
	try {
		// Ensure user is authenticated
		if (!req.user) {
			throw new AuthError("User not authenticated");
		}

		const userRole = await getUserRole(req.user.uid, req.user.custom_claims);

		if (userRole !== "admin") {
			throw new ForbiddenError("Admin access required");
		}

		// Store role in request for later use
		req.userRole = userRole;
		next();
	} catch (error) {
		next(error);
	}
};

// Check multiple roles
export const hasRole = (req, roles) => {
	return roles.includes(req.userRole);
};

// Get user role from request
export const getUserRoleFromRequest = (req) => {
	return req.userRole || null;
};
