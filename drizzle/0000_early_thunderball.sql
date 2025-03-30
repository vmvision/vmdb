CREATE TABLE "merchant" (
	"key" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"website" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "category" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"region_key" varchar(255),
	"merchant_key" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "model" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"merchant_key" varchar NOT NULL,
	"category_id" integer,
	"cpu" varchar,
	"gpu" varchar,
	"core" integer,
	"memory" integer,
	"storage" integer,
	"bandwidth" integer,
	"region_key" varchar
);
--> statement-breakpoint
CREATE TABLE "price" (
	"id" serial PRIMARY KEY NOT NULL,
	"cycle" varchar(255) DEFAULT 'monthly' NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"unit" varchar(255) DEFAULT 'USD' NOT NULL,
	"model_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "region" (
	"key" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"country_key" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "category" ADD CONSTRAINT "category_region_key_region_key_fk" FOREIGN KEY ("region_key") REFERENCES "public"."region"("key") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "category" ADD CONSTRAINT "category_merchant_key_merchant_key_fk" FOREIGN KEY ("merchant_key") REFERENCES "public"."merchant"("key") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "model" ADD CONSTRAINT "model_merchant_key_merchant_key_fk" FOREIGN KEY ("merchant_key") REFERENCES "public"."merchant"("key") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "model" ADD CONSTRAINT "model_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "model" ADD CONSTRAINT "model_region_key_region_key_fk" FOREIGN KEY ("region_key") REFERENCES "public"."region"("key") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "price" ADD CONSTRAINT "price_model_id_model_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."model"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "region" ADD CONSTRAINT "region_country_key_region_key_fk" FOREIGN KEY ("country_key") REFERENCES "public"."region"("key") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "search_idx_category_name" ON "category" USING gin (to_tsvector('english', "name"));--> statement-breakpoint
CREATE INDEX "search_idx_model_name" ON "model" USING gin (to_tsvector('english', "name"));