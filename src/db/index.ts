import { drizzle } from "drizzle-orm/tidb-serverless";
import * as schema from "./schema";

export type DataBase = ReturnType<typeof drizzle<typeof schema>>;

const globalForDB = globalThis as unknown as {
	db: DataBase | undefined;
};

const getDb = (url: string) => {
	if (globalForDB.db) {
		return globalForDB.db;
	}
	globalForDB.db = drizzle({ connection: { url }, schema });
	return globalForDB.db;
};

export default getDb;
