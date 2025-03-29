import { relations } from "drizzle-orm";
import {
	double,
	index,
	int,
	mysqlTable,
	varchar,
	type AnyMySqlColumn,
} from "drizzle-orm/mysql-core";

export const merchant = mysqlTable("merchant", {
	id: varchar("id", { length: 255 }).primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	website: varchar("website", { length: 255 }),
});

export const merchantRelation = relations(merchant, ({ many }) => ({
	categories: many(category),
	models: many(model),
}));

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
		categoryId: int("category_id")
			.references(() => category.id, {
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

export const price = mysqlTable("price", {
	id: int("id").autoincrement().primaryKey(),
	cycle: varchar("cycle", { length: 255, enum: ["monthly", "yearly"] })
		.default("monthly")
		.notNull(),
	amount: double("amount").notNull(),
	unit: varchar("unit", { length: 255 }).default("USD").notNull(),
	modelId: int("model_id")
		.references(() => model.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		})
		.notNull(),
});

export const priceRelation = relations(price, ({ one }) => ({
	model: one(model, {
		fields: [price.modelId],
		references: [model.id],
	}),
}));

export const region = mysqlTable("region", {
	id: varchar("id", { length: 255 }).primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	countryId: varchar("country", { length: 255 }).references(
		(): AnyMySqlColumn => region.id,
		{
			onDelete: "set null",
			onUpdate: "cascade",
		},
	),
});

export const regionRelation = relations(region, ({ one }) => ({
	country: one(region, {
		fields: [region.countryId],
		references: [region.id],
	}),
}));
