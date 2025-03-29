import { zValidator } from "@hono/zod-validator";
import appFactory from "../factory";
import { z } from "zod";

const app = appFactory.createApp().get(
	"/:id",
	zValidator(
		"param",
		z.object({
			id: z.string(),
		}),
	),
	async (c) => {
		const db = c.get("db");
		const { id } = c.req.param();
		const merchant = await db.query.merchant.findFirst({
			where: (t, { eq }) => eq(t.id, id),
		});
		return c.json(merchant);
	},
);

export default app;
