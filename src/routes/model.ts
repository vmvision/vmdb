import { zValidator } from "@hono/zod-validator";
import appFactory from "../factory";
import { z } from "zod";
import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";
import { zModel } from "@/db/schema";

const app = appFactory.createApp().get(
	"/:id",
	describeRoute({
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
