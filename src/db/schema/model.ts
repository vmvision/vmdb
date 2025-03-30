import { relations, sql } from "drizzle-orm";
import { serial, integer, pgTable, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { merchant } from "./merchant";
import { category } from "./category";
import { region } from "./region";
import { price } from "./price";

export const model = pgTable(
	"model",
	{
		id: serial("id").primaryKey(),
		name: varchar("name").notNull(),

		merchantKey: varchar("merchant_key")
			.references(() => merchant.key, {
				onDelete: "cascade",
				onUpdate: "cascade",
			})
			.notNull(),
		categoryId: integer("category_id").references(() => category.id, {
			onDelete: "set null",
			onUpdate: "cascade",
		}),

		cpu: varchar("cpu"),
		gpu: varchar("gpu"),
		core: integer("core"),
		memory: integer("memory"),
		storage: integer("storage"),
		bandwidth: integer("bandwidth"),
		regionId: varchar("region_key").references(() => region.key, {
			onDelete: "set null",
			onUpdate: "cascade",
		}),
	},
	(t) => [
		index("search_idx_model_name").using(
			"gin",
			sql`to_tsvector('english', ${t.name})`,
		),
	],
);

export const modelRelation = relations(model, ({ one, many }) => ({
	merchant: one(merchant, {
		fields: [model.merchantKey],
		references: [merchant.key],
	}),
	category: one(category, {
		fields: [model.categoryId],
		references: [category.id],
	}),
	region: one(region, {
		fields: [model.regionId],
		references: [region.key],
	}),
	prices: many(price),
}));

export type Model = typeof model.$inferSelect;
export type NewModel = typeof model.$inferInsert;
export const zModel = createSelectSchema(model);
export const zNewModel = createInsertSchema(model);
