import { relations } from "drizzle-orm";
import { index, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { merchant } from "./merchant";
import { category } from "./category";
import { region } from "./region";
import { price } from "./price";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const model = mysqlTable(
	"model",
	{
		id: int("id").autoincrement().primaryKey(),
		name: varchar("name", { length: 255 }).notNull(),

		merchantId: varchar("merchant_id", { length: 255 })
			.references(() => merchant.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			})
			.notNull(),
		categoryId: int("category_id").references(() => category.id, {
			onDelete: "set null",
			onUpdate: "cascade",
		}),

		cpu: varchar("cpu", { length: 255 }),
		gpu: varchar("gpu", { length: 255 }),
		core: int("core"),
		memory: int("memory"),
		storage: int("storage"),
		bandwidth: int("bandwidth"),
		regionId: varchar("region_id", { length: 255 }).references(
			() => region.id,
			{
				onDelete: "set null",
				onUpdate: "cascade",
			},
		),
	},
	(t) => [index("idx_name").on(t.name)],
);

export const modelRelation = relations(model, ({ one, many }) => ({
	merchant: one(merchant, {
		fields: [model.merchantId],
		references: [merchant.id],
	}),
	category: one(category, {
		fields: [model.categoryId],
		references: [category.id],
	}),
	region: one(region, {
		fields: [model.regionId],
		references: [region.id],
	}),
	prices: many(price),
}));

export type Model = typeof model.$inferSelect;
export type NewModel = typeof model.$inferInsert;
export const zModel = createSelectSchema(model);
export const zNewModel = createInsertSchema(model);
