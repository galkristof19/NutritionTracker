import express from "express";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";
import {
	setAdminRole,
	removeAdminRole,
	getAllAdmins,
	getUserRole,
	batchSetAdminRole,
} from "../controllers/adminController.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(verifyFirebaseToken, requireAdmin);

// Set admin role for a user
router.post("/users/:uid/set-admin", setAdminRole);

// Remove admin role from a user
router.post("/users/:uid/remove-admin", removeAdminRole);

// Get all admin users
router.get("/users/admins", getAllAdmins);

// Get specific user role
router.get("/users/:uid/role", getUserRole);

// Batch set admin role
router.post("/users/batch/set-admin", batchSetAdminRole);

export default router;
