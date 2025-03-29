import { zValidator } from "@hono/zod-validator";
import appFactory from "../factory";
import { z } from "zod";
import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";
import { zMerchant } from "@/db/schema";

const app = appFactory.createApp().get(
	"/:id",
	describeRoute({
		description: "Get a merchant by id",
		responses: {
			200: {
				description: "Merchant",
				content: {
					"application/json": { schema: resolver(zMerchant) },
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
			id: z.string(),
		}),
	),
	async (c) => {
		const db = c.get("db");
		const { id } = c.req.param();
		const merchant = await db.query.merchant.findFirst({
			where: (t, { eq }) => eq(t.id, id),
		});
		if (!merchant) {
			return c.json({ error: "Merchant not found" }, 404);
		}
		return c.json(merchant);
	},
);

export default app;
