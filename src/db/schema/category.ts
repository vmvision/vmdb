import { relations, sql } from "drizzle-orm";
import { index, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { region } from "./region";
import { merchant } from "./merchant";
import { model } from "./model";

export const category = pgTable(
	"category",
	{
		id: serial("id").primaryKey(),
		name: varchar("name", { length: 255 }).notNull(),

		regionKey: varchar("region_key", { length: 255 }).references(
			() => region.key,
			{
				onDelete: "set null",
				onUpdate: "cascade",
			},
		),
		merchantKey: varchar("merchant_key", { length: 255 })
			.references(() => merchant.key, {
				onDelete: "cascade",
				onUpdate: "cascade",
			})
			.notNull(),
	},
	(t) => [
		index("search_idx_category_name").using(
			"gin",
			sql`to_tsvector('english', ${t.name})`,
		),
	],
);

export const categoryRelation = relations(category, ({ one, many }) => ({
	merchant: one(merchant, {
		fields: [category.merchantKey],
		references: [merchant.key],
	}),
	models: many(model),
}));

export type Category = typeof category.$inferSelect;
export type NewCategory = typeof category.$inferInsert;
export const zCategory = createSelectSchema(category);
export const zNewCategory = createInsertSchema(category);
