import { createFactory } from "hono/factory";
import getDb, { type DataBase } from "./db";
import { env, getRuntimeKey } from "hono/adapter";

export type Env = {
	Variables: {
		db: DataBase;
	};
	Bindings: {
		TIDB_URL: string;
	};
};

/**
 * DB middleware
 */
const appFactory = createFactory<Env>({
	initApp: (app) => {
		app.use(async (c, next) => {
			const { TIDB_URL } = env<Env["Bindings"]>(c);
			c.set("db", getDb(TIDB_URL));
			await next();
		});
	},
});

export default appFactory;
