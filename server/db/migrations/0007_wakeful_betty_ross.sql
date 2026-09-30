CREATE TABLE "content_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"resource_type" varchar(100) NOT NULL,
	"resource_id" varchar(255) NOT NULL,
	"version" integer NOT NULL,
	"data" jsonb NOT NULL,
	"changed_by" uuid,
	"changed_by_email" varchar(255) NOT NULL,
	"change_type" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_delivery_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"message_id" varchar(255) NOT NULL,
	"to_email" varchar(255) NOT NULL,
	"from_email" varchar(255) NOT NULL,
	"subject" varchar(1000),
	"status" varchar(50) NOT NULL,
	"provider" varchar(50),
	"provider_message_id" varchar(255),
	"error_code" varchar(100),
	"error_message" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"sent_at" timestamp DEFAULT now() NOT NULL,
	"delivered_at" timestamp,
	"opened_at" timestamp,
	"clicked_at" timestamp,
	"complained_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "feature_flags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(100) NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text,
	"enabled" boolean DEFAULT false NOT NULL,
	"rules" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "feature_flags_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_changed_by_admin_users_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "content_versions_resource_idx" ON "content_versions" USING btree ("resource_type","resource_id");--> statement-breakpoint
CREATE INDEX "content_versions_version_idx" ON "content_versions" USING btree ("version");--> statement-breakpoint
CREATE INDEX "content_versions_created_at_idx" ON "content_versions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "email_delivery_logs_message_id_idx" ON "email_delivery_logs" USING btree ("message_id");--> statement-breakpoint
CREATE INDEX "email_delivery_logs_to_email_idx" ON "email_delivery_logs" USING btree ("to_email");--> statement-breakpoint
CREATE INDEX "email_delivery_logs_status_idx" ON "email_delivery_logs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "email_delivery_logs_sent_at_idx" ON "email_delivery_logs" USING btree ("sent_at");--> statement-breakpoint
CREATE INDEX "feature_flags_key_idx" ON "feature_flags" USING btree ("key");--> statement-breakpoint
CREATE INDEX "feature_flags_enabled_idx" ON "feature_flags" USING btree ("enabled");