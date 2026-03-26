CREATE TABLE `qr_options` (
	`id` text PRIMARY KEY NOT NULL,
	`style` text,
	`color1` text,
	`color2` text,
	`gradient_type` text,
	`gradient_angle` integer,
	`image_url` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `qr_options_user_id_unique` ON `qr_options` (`user_id`);--> statement-breakpoint
ALTER TABLE `links` ADD `hit_count` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `hit_count` integer DEFAULT 0 NOT NULL;