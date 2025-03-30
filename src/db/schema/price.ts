import { relations } from "drizzle-orm";
import {
	serial,
	pgTable,
	varchar,
	decimal,
	integer,
} from "drizzle-orm/pg-core";

import { model } from "./model";

export const price = pgTable("price", {
	id: serial("id").primaryKey(),
	cycle: varchar("cycle", { length: 255, enum: ["monthly", "yearly"] })
		.default("monthly")
		.notNull(),
	amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
	unit: varchar("unit", { length: 255 }).default("USD").notNull(),
	modelId: integer("model_id")
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
