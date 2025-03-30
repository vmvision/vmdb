import { relations } from "drizzle-orm";
import { serial, pgTable, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { category } from "./category";
import { model } from "./model";

export const merchant = pgTable("merchant", {
	key: varchar("key", { length: 255 }).primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	website: varchar("website", { length: 255 }),
});

export const merchantRelation = relations(merchant, ({ many }) => ({
	categories: many(category),
	models: many(model),
}));

export type Merchant = typeof merchant.$inferSelect;
export type NewMerchant = typeof merchant.$inferInsert;
export const zMerchant = createSelectSchema(merchant);
export const zNewMerchant = createInsertSchema(merchant);
