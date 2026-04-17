import pg from "pg";

const { Pool } = pg;

let pool;

const getPool = () => {
	if (pool) {
		return pool;
	}

	const connectionString = process.env.DATABASE_URL;

	if (!connectionString) {
		throw new Error("DATABASE_URL environment variable is required.");
	}

	pool = new Pool({
		connectionString,
	});

	pool.on("error", (error) => {
		console.error("Unexpected database pool error.", error);
	});

	return pool;
};

export const connectToDatabase = async () => {
	const client = await getPool().connect();

	try {
		await client.query("SELECT 1");
		console.log("Database connection established.");
	} finally {
		client.release();
	}
};

export const query = (text, params) => getPool().query(text, params);

export default getPool;
