import "zod-openapi/extend";

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

export default app;
