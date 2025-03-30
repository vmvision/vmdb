import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import appFactory from "../factory";
import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";
import { zCategory } from "@/db/schema";

const sharedDescribeRoute = {
	tags: ["Category"],
};

const app = appFactory
	.createApp()
	.get(
		"/:id",
		describeRoute({
			...sharedDescribeRoute,
			description: "Get a category by id",
			responses: {
				200: {
					description: "Category",
					content: {
						"application/json": { schema: resolver(zCategory) },
					},
				},
				404: {
					description: "Category not found",
				},
			},
		}),
		zValidator(
			"param",
			z.object({
				id: z.coerce.number(),
			}),
		),
		async (c) => {
			const db = c.get("db");
			const { id } = c.req.valid("param");
			const category = await db.query.category.findFirst({
				where: (t, { eq }) => eq(t.id, id),
			});
			if (!category) {
				return c.json({ error: "Category not found" }, 404);
			}
			return c.json(category);
		},
	)
	.get(
		"/list",
		describeRoute({
			...sharedDescribeRoute,
			description: "Get a category by id",
			responses: {
				200: {
					description: "Category",
					content: {
						"application/json": { schema: resolver(z.array(zCategory)) },
					},
				},
			},
		}),
		zValidator(
			"query",
			z.object({
				mid: z.string(),
			}),
		),
		async (c) => {
			const db = c.get("db");
			const { mid } = c.req.valid("query");
			const category = await db.query.category.findMany({
				where: (t, { eq }) => eq(t.merchantKey, mid),
			});
			return c.json(category);
		},
	);

export default app;
