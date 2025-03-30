import { relations } from "drizzle-orm";
import { pgTable, varchar, type AnyPgColumn } from "drizzle-orm/pg-core";
import { model } from "./model";

export const region = pgTable("region", {
	key: varchar("key", { length: 255 }).primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	countryKey: varchar("country_key", { length: 255 }).references(
		(): AnyPgColumn => region.key,
		{
			onDelete: "set null",
			onUpdate: "cascade",
		},
	),
});

export const regionRelation = relations(region, ({ one, many }) => ({
	country: one(region, {
		fields: [region.countryKey],
		references: [region.key],
	}),
	models: many(model),
}));
