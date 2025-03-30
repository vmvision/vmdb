import { createFactory } from "hono/factory";
import getDb, { type DataBase } from "./db";
import { env, getRuntimeKey } from "hono/adapter";
import { cache } from "hono/cache";

export type Env = {
	Variables: {
		db: DataBase;
	};
	Bindings: {
		DATABASE_URL: string;
		HYPERDRIVE?: Hyperdrive;
	};
};

/**
 * DB middleware
 */
const appFactory = createFactory<Env>({
	initApp: (app) => {
		if (getRuntimeKey() === "workerd") {
			app.use(
				cache({
					cacheName: "vmdb",
					cacheControl: "max-age=3600",
				}),
			);
		}
		app.use(async (c, next) => {
			const { DATABASE_URL, HYPERDRIVE } = env<Env["Bindings"]>(c);
			c.set("db", getDb(HYPERDRIVE?.connectionString ?? DATABASE_URL));
			await next();
		});
	},
});

export default appFactory;
