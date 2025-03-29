import { relations } from "drizzle-orm";
import { mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { category } from "./category";
import { model } from "./model";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const merchant = mysqlTable("merchant", {
	id: varchar("id", { length: 255 }).primaryKey(),
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
