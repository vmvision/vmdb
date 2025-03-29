import { zValidator } from "@hono/zod-validator";
import appFactory from "../factory";
import { z } from "zod";

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
		const model = await db.query.model.findFirst({
			where: (t, { eq }) => eq(t.id, id),
		});
		return c.json(model);
	},
);

export default app;
