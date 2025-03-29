import { relations } from "drizzle-orm";
import {
	double,
	index,
	int,
	mysqlTable,
	varchar,
	type AnyMySqlColumn,
} from "drizzle-orm/mysql-core";
import { model } from "./model";

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