import { relations } from "drizzle-orm";
import {
	double,
	index,
	int,
	mysqlTable,
	varchar,
	type AnyMySqlColumn,
} from "drizzle-orm/mysql-core";

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
