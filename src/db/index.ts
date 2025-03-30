import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import postgres from "postgres";

export type DataBase = ReturnType<typeof drizzle<typeof schema>>;

const globalForDB = globalThis as unknown as {
	db: DataBase | undefined;
};

const getDb = (url: string) => {
	if (globalForDB.db) {
		return globalForDB.db;
	}
	const queryClient = postgres(url);
	globalForDB.db = drizzle(queryClient, { schema });
	return globalForDB.db;
};

export default getDb;
