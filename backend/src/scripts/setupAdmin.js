import admin from "firebase-admin";
import dotenv from "dotenv";
import { query } from "../config/db.js";
import { initializeFirebase } from "../config/firebase.js";

// Load environment variables
dotenv.config();

const setupAdminRole = async (uid) => {
	try {
		// Initialize Firebase
		initializeFirebase();

		console.log(`Setting up admin role for user: ${uid}`);

		// Set custom claims in Firebase
		await admin.auth().setCustomUserClaims(uid, { role: "admin" });
		console.log(`✓ Firebase Custom Claims updated for user: ${uid}`);

		// Update role in database
		const result = await query(
			"UPDATE users SET role = $1 WHERE uid = $2 RETURNING uid, email, role",
			["admin", uid]
		);

		if (result.rowCount === 0) {
			console.warn(
				`⚠ User not found in database. Creating user entry...`
			);
			// Create user entry if doesn't exist
			await query(
				"INSERT INTO users (uid, role) VALUES ($1, $2) ON CONFLICT (uid) DO UPDATE SET role = $2",
				[uid, "admin"]
			);
			console.log(`✓ User entry created in database with admin role`);
		} else {
			console.log(
				`✓ Database updated for user: ${result.rows[0].uid}`
			);
		}

		console.log(`\n✓ Admin role successfully assigned to user: ${uid}`);
		process.exit(0);
	} catch (error) {
		console.error("Error setting admin role:", error.message);
		process.exit(1);
	}
};

// Get UID from command line arguments
const uid = process.argv[2];

if (!uid) {
	console.error(
		"Error: User UID is required\n\nUsage: node setupAdmin.js <uid>"
	);
	console.log(
		"Example: node setupAdmin.js user123456789"
	);
	process.exit(1);
}

// Run setup
setupAdminRole(uid);
