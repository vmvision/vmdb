import { zValidator } from "@hono/zod-validator";
import appFactory from "../factory";
import { z } from "zod";
import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";
import { zModel } from "@/db/schema";

const sharedDescribeRoute = {
	tags: ["Model"],
};

const app = appFactory
	.createApp()
	.get(
		"/search",
		describeRoute({
			...sharedDescribeRoute,
			description: "Search for a model",
			responses: {
				200: {
					description: "Model",
					content: {
						"application/json": { schema: resolver(z.array(zModel)) },
					},
				},
			},
		}),
		zValidator(
			"query",
			z.object({
				input: z.string(),
				mid: z.string().optional(),
			}),
		),
		async (c) => {
			const db = c.get("db");
			const { input, mid } = c.req.valid("query");
			const model = await db.query.model.findMany({
				where: (t, { eq, and, like }) =>
					and(
						like(t.name, `%${input}%`),
						mid ? eq(t.merchantKey, mid) : undefined,
					),
				with: {
					// prices: true,
					region: true,
				},
			});
			return c.json(model);
		},
	)
	.get(
		"/:id",
		describeRoute({
			...sharedDescribeRoute,
			description: "Get a model by id",
			responses: {
				200: {
					description: "Model",
					content: {
						"application/json": { schema: resolver(zModel) },
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
			const model = await db.query.model.findFirst({
				where: (t, { eq }) => eq(t.id, id),
			});
			if (!model) {
				return c.json({ error: "Model not found" }, 404);
			}
			return c.json(model);
		},
	);

export default app;
