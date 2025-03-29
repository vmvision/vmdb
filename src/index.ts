import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";

import merchant from "./routes/merchant";
import category from "./routes/category";
import model from "./routes/model";

const app = new Hono();

// Business Routes
export const routes = app
	.route("/merchant", merchant)
	.route("/category", category)
	.route("/model", model);
  
serve(
	{
		fetch: app.fetch,
		port: 3000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
