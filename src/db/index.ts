import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

export type DataBase = ReturnType<typeof drizzle<typeof schema>>;

const globalForDB = globalThis as unknown as {
	dbPool: DataBase | undefined;
};

const getDbPool = (url: string) => {
	return new pg.Pool({
		connectionString: url,
	});
};

const getDb = (url: string) => {
	if (globalForDB.dbPool) {
		return globalForDB.dbPool;
	}
	const pool = getDbPool(url);
	globalForDB.dbPool = drizzle(pool, { schema });
	return globalForDB.dbPool;
};

export default getDb;
