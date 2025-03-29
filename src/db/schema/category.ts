import { relations } from "drizzle-orm";
import {
	index,
	int,
	mysqlTable,
	varchar,
} from "drizzle-orm/mysql-core";
import { region } from "./region";
import { merchant } from "./merchant";
import { model } from "./model";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const category = mysqlTable(
	"category",
	{
		id: int("id").autoincrement().primaryKey(),
		name: varchar("name", { length: 255 }).notNull(),

		regionId: varchar("region_id", { length: 255 }).references(
			() => region.id,
			{
				onDelete: "set null",
				onUpdate: "cascade",
			},
		),
		merchantId: varchar("merchant_id", { length: 255 })
			.references(() => merchant.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			})
			.notNull(),
	},
	(t) => [index("idx_name").on(t.name)],
);

export const categoryRelation = relations(category, ({ one, many }) => ({
	merchant: one(merchant, {
		fields: [category.merchantId],
		references: [merchant.id],
	}),
	models: many(model),
}));

export type Category = typeof category.$inferSelect;
export type NewCategory = typeof category.$inferInsert;
export const zCategory = createSelectSchema(category);
export const zNewCategory = createInsertSchema(category);
