import dotenv from "dotenv";
import app from "./src/app.js";
import { connectToDatabase } from "./src/config/db.js";

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: envFile });
console.log(`[ENV] Loading configuration from: ${envFile}`);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
	try {
		// Connect to database
		await connectToDatabase();

		// Start the server
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	} catch (error) {
		console.error("Failed to start server:", error);
		process.exit(1);
	}
};

startServer();
