import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import admin from "firebase-admin";

let firebaseApp;

export const getServiceAccountFromEnv = () => {
	const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;

	if (!rawServiceAccount) {
		return null;
	}

	try {
		return JSON.parse(rawServiceAccount);
	} catch {
		throw new Error("FIREBASE_SERVICE_ACCOUNT must be valid JSON.");
	}
};

export const getServiceAccountFromFile = () => {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	const serviceAccountPath = path.join(__dirname, "firebase-service-account.json");

	if (!fs.existsSync(serviceAccountPath)) {
		return null;
	}

	const fileContent = fs.readFileSync(serviceAccountPath, "utf-8");
	return JSON.parse(fileContent);
};

const getCredential = () => {
	const envServiceAccount = getServiceAccountFromEnv();

	if (envServiceAccount) {
		return admin.credential.cert(envServiceAccount);
	}

	const fileServiceAccount = getServiceAccountFromFile();

	if (fileServiceAccount) {
		return admin.credential.cert(fileServiceAccount);
	}

	throw new Error(
		"Firebase service account not found. Set FIREBASE_SERVICE_ACCOUNT or provide src/config/firebase-service-account.json.",
	);
};

export const initializeFirebase = () => {
	if (firebaseApp) {
		return firebaseApp;
	}

	firebaseApp = admin.initializeApp({
		credential: getCredential(),
	});

	console.log("Firebase Admin initialized.");
	return firebaseApp;
};

export const getFirebaseApp = () => initializeFirebase();

export const getFirebaseAuth = () => admin.auth(initializeFirebase());

export default initializeFirebase;
