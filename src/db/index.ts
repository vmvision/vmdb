import { drizzle } from "drizzle-orm/tidb-serverless";
import * as schema from "./schema";
const db = drizzle({ connection: { url: process.env.TIDB_URL }, schema });

export type DataBase = typeof db;

export default db;
