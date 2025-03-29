CREATE TABLE `category` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`merchant_id` varchar(255) NOT NULL,
	CONSTRAINT `category_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `merchant` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`website` varchar(255),
	CONSTRAINT `merchant_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `model` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`merchant_id` varchar(255) NOT NULL,
	`category_id` int,
	`cpu` varchar(255),
	`gpu` varchar(255),
	`core` int,
	`memory` int,
	`storage` int,
	`bandwidth` int,
	`region_id` varchar(255),
	CONSTRAINT `model_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `price` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cycle` varchar(255) NOT NULL DEFAULT 'monthly',
	`amount` double NOT NULL,
	`unit` varchar(255) NOT NULL DEFAULT 'USD',
	`model_id` int NOT NULL,
	CONSTRAINT `price_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `region` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`country` varchar(255),
	CONSTRAINT `region_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `category` ADD CONSTRAINT `category_merchant_id_merchant_id_fk` FOREIGN KEY (`merchant_id`) REFERENCES `merchant`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `model` ADD CONSTRAINT `model_merchant_id_merchant_id_fk` FOREIGN KEY (`merchant_id`) REFERENCES `merchant`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `model` ADD CONSTRAINT `model_category_id_category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `model` ADD CONSTRAINT `model_region_id_region_id_fk` FOREIGN KEY (`region_id`) REFERENCES `region`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `price` ADD CONSTRAINT `price_model_id_model_id_fk` FOREIGN KEY (`model_id`) REFERENCES `model`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `region` ADD CONSTRAINT `region_country_region_id_fk` FOREIGN KEY (`country`) REFERENCES `region`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX `idx_name` ON `category` (`name`);--> statement-breakpoint
CREATE INDEX `idx_name` ON `model` (`name`);