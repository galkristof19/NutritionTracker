import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { initializeFirebase } from "./config/firebase.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // CORS support
app.use(morgan("dev")); // HTTP request logger
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Initialize Firebase on app startup
try {
	initializeFirebase();
	console.log("Firebase initialized successfully");
} catch (error) {
	console.error("Firebase initialization error:", error);
}

// Health check route
app.get("/health", (req, res) => {
	res.status(200).json({ message: "Server is healthy" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// API Routes placeholder (add routes as needed)
app.use("/api", (req, res) => {
	res.status(404).json({ error: "API route not found" });
});

// 404 handler
app.use((req, res) => {
	res.status(404).json({ error: "Route not found" });
});

// Error handling middleware
app.use(errorHandler);

export default app;
