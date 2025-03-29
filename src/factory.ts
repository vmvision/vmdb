import { createFactory } from "hono/factory";
import db, { type DataBase } from "./db";

export type Env = {
  Variables: {
    db: DataBase;
  };
};

/**
 * DB middleware
 */
const appFactory = createFactory<Env>({
  initApp: (app) => {
    app.use(async (c, next) => {
      c.set("db", db);
      await next();
    });
  },
});

export default appFactory;
