import "dotenv/config";
import "zod-openapi/extend";

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { apiReference } from "@scalar/hono-api-reference";

import merchant from "./routes/merchant";
import category from "./routes/category";
import model from "./routes/model";
import { openAPISpecs } from "hono-openapi";

const app = new Hono();

// Business Routes
export const routes = app
	.route("/merchant", merchant)
	.route("/category", category)
	.route("/model", model);

app.get(
	"/openapi",
	openAPISpecs(app, {
		documentation: {
			info: {
				title: "VMDB API",
				version: "1.0.0",
				description: "VMDB API",
			},
			servers: [{ url: "http://localhost:3000", description: "Local Server" }],
		},
	}),
);

app.get(
	"/docs",
	apiReference({
		theme: "saturn",
		spec: { url: "/openapi" },
	}),
);

serve(
	{
		fetch: app.fetch,
		port: 3000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
