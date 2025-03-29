import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import appFactory from "../factory";

const app = appFactory.createApp().get(
	"/:id",
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
		return c.json(category);
	},
);

export default app;
