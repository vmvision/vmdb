import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  dialect: "mysql",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.TIDB_URL as string,
  },
} satisfies Config;
