import admin from "firebase-admin";

export const verifyFirebaseToken = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({
				error: "Missing or invalid authorization header",
			});
		}

		const token = authHeader.slice(7); // Remove "Bearer " prefix

		try {
			const decodedToken = await admin.auth().verifyIdToken(token);
			req.user = decodedToken;
			next();
		} catch (error) {
			console.error("Token verification error:", error.message);
			return res.status(401).json({
				error: "Invalid or expired token",
			});
		}
	} catch (error) {
		console.error("Auth middleware error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const verifyOptionalToken = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;

		if (authHeader && authHeader.startsWith("Bearer ")) {
			const token = authHeader.slice(7);

			try {
				const decodedToken = await admin.auth().verifyIdToken(token);
				req.user = decodedToken;
			} catch (error) {
				console.warn("Optional token verification failed:", error.message);
				// Continue without user data
			}
		}

		next();
	} catch (error) {
		console.error("Optional auth middleware error:", error);
		next();
	}
};
