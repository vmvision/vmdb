import { zValidator } from "@hono/zod-validator";
import appFactory from "../factory";
import { z } from "zod";
import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";
import { zMerchant } from "@/db/schema";

const sharedDescribeRoute = {
	tags: ["Merchant"],
};

const app = appFactory.createApp().get(
	"/:id",
	describeRoute({
		...sharedDescribeRoute,
		parameters: [
			{
				name: "id",
				in: "path",
				required: true,
				schema: z.string().openapi({
					example: "dmit",
				}),
			},
		],
		description: "Get a merchant by id",
		responses: {
			200: {
				description: "Merchant",
				content: {
					"application/json": {
						schema: resolver(
							zMerchant.openapi({
								ref: "Merchant",
								example: {
									key: "dmit",
									name: "Dmit",
									website: "https://dmit.com",
								},
							}),
						),
					},
				},
			},
			404: {
				description: "Category not found",
				content: {
					"application/json": {
						schema: resolver(z.object({ error: z.string() })),
					},
				},
			},
		},
	}),
	zValidator(
		"param",
		z
			.object({
				id: z.string(),
			})
			.openapi({
				example: {
					id: "dmit",
				},
			}),
	),
	async (c) => {
		const db = c.get("db");
		const { id } = c.req.param();
		const merchant = await db.query.merchant.findFirst({
			where: (t, { eq }) => eq(t.key, id),
		});
		if (!merchant) {
			return c.json({ error: "Merchant not found" }, 404);
		}
		return c.json(merchant);
	},
);

export default app;
