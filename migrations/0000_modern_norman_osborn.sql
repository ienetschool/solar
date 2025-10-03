CREATE TABLE `agent_transfers` (
	`id` varchar(36) NOT NULL,
	`ticket_id` varchar(36),
	`chat_session_id` varchar(36),
	`from_agent` varchar(36),
	`to_agent` varchar(36) NOT NULL,
	`reason` text,
	`status` text NOT NULL DEFAULT ('pending'),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`accepted_at` timestamp,
	CONSTRAINT `agent_transfers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `callback_requests` (
	`id` varchar(36) NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`preferred_time` text NOT NULL,
	`reason` text NOT NULL,
	`status` text NOT NULL DEFAULT ('pending'),
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`contacted_at` timestamp,
	CONSTRAINT `callback_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chat_messages` (
	`id` varchar(36) NOT NULL,
	`ticket_id` varchar(36),
	`user_id` varchar(36) NOT NULL,
	`message` text NOT NULL,
	`is_agent` boolean NOT NULL DEFAULT false,
	`files` json DEFAULT ('[]'),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `faqs` (
	`id` varchar(36) NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`category` text NOT NULL,
	`page` text,
	`order` int NOT NULL DEFAULT 0,
	`is_published` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `faqs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `file_uploads` (
	`id` varchar(36) NOT NULL,
	`filename` text NOT NULL,
	`original_name` text NOT NULL,
	`mime_type` text NOT NULL,
	`size` text NOT NULL,
	`url` text NOT NULL,
	`uploaded_by` varchar(36) NOT NULL,
	`related_type` text,
	`related_id` varchar(36),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `file_uploads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `live_chat_messages` (
	`id` varchar(36) NOT NULL,
	`session_id` varchar(36) NOT NULL,
	`user_id` varchar(36),
	`message` text NOT NULL,
	`is_agent` boolean NOT NULL DEFAULT false,
	`files` json DEFAULT ('[]'),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `live_chat_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `live_chat_sessions` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36),
	`guest_name` text,
	`guest_email` text,
	`status` text NOT NULL DEFAULT ('active'),
	`assigned_to` varchar(36),
	`page` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`closed_at` timestamp,
	CONSTRAINT `live_chat_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`type` text NOT NULL,
	`is_read` boolean NOT NULL DEFAULT false,
	`related_id` varchar(36),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `page_sections` (
	`id` varchar(36) NOT NULL,
	`page_id` varchar(36) NOT NULL,
	`type` text NOT NULL,
	`title` text,
	`content` text,
	`image_url` text,
	`order` int NOT NULL DEFAULT 0,
	`data` json,
	`is_visible` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `page_sections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pages` (
	`id` varchar(36) NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`meta_description` text,
	`meta_keywords` text,
	`og_title` text,
	`og_description` text,
	`og_image` text,
	`schema_markup` json,
	`is_published` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pages_id` PRIMARY KEY(`id`),
	CONSTRAINT `pages_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `support_forms` (
	`id` varchar(36) NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`subject` text NOT NULL,
	`message` text NOT NULL,
	`page` text,
	`status` text NOT NULL DEFAULT ('new'),
	`assigned_to` varchar(36),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`responded_at` timestamp,
	CONSTRAINT `support_forms_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ticket_history` (
	`id` varchar(36) NOT NULL,
	`ticket_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`action` text NOT NULL,
	`details` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ticket_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`status` text NOT NULL DEFAULT ('open'),
	`priority` text NOT NULL DEFAULT ('medium'),
	`category` text NOT NULL,
	`assigned_to` varchar(36),
	`files` json DEFAULT ('[]'),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`resolved_at` timestamp,
	CONSTRAINT `tickets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`email` text NOT NULL,
	`role` text NOT NULL DEFAULT ('customer'),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `agent_transfers` ADD CONSTRAINT `agent_transfers_ticket_id_tickets_id_fk` FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `agent_transfers` ADD CONSTRAINT `agent_transfers_chat_session_id_live_chat_sessions_id_fk` FOREIGN KEY (`chat_session_id`) REFERENCES `live_chat_sessions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `agent_transfers` ADD CONSTRAINT `agent_transfers_from_agent_users_id_fk` FOREIGN KEY (`from_agent`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `agent_transfers` ADD CONSTRAINT `agent_transfers_to_agent_users_id_fk` FOREIGN KEY (`to_agent`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_ticket_id_tickets_id_fk` FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `file_uploads` ADD CONSTRAINT `file_uploads_uploaded_by_users_id_fk` FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `live_chat_messages` ADD CONSTRAINT `live_chat_messages_session_id_live_chat_sessions_id_fk` FOREIGN KEY (`session_id`) REFERENCES `live_chat_sessions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `live_chat_messages` ADD CONSTRAINT `live_chat_messages_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `live_chat_sessions` ADD CONSTRAINT `live_chat_sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `live_chat_sessions` ADD CONSTRAINT `live_chat_sessions_assigned_to_users_id_fk` FOREIGN KEY (`assigned_to`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `page_sections` ADD CONSTRAINT `page_sections_page_id_pages_id_fk` FOREIGN KEY (`page_id`) REFERENCES `pages`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `support_forms` ADD CONSTRAINT `support_forms_assigned_to_users_id_fk` FOREIGN KEY (`assigned_to`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ticket_history` ADD CONSTRAINT `ticket_history_ticket_id_tickets_id_fk` FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ticket_history` ADD CONSTRAINT `ticket_history_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_assigned_to_users_id_fk` FOREIGN KEY (`assigned_to`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;