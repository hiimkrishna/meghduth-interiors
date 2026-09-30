CREATE TABLE "platform_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platform" varchar(50) NOT NULL,
	"account_id" varchar(255) NOT NULL,
	"account_name" varchar(255),
	"access_token_encrypted" text NOT NULL,
	"refresh_token_encrypted" text,
	"token_expires_at" timestamp,
	"scopes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_raw" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platform" varchar(50) NOT NULL,
	"external_id" varchar(255) NOT NULL,
	"payload" jsonb NOT NULL,
	"received_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platform" varchar(50) NOT NULL,
	"external_id" varchar(255) NOT NULL,
	"author_name" varchar(255),
	"author_avatar_url" text,
	"author_profile_url" text,
	"rating" integer,
	"text" text NOT NULL,
	"media_urls" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"source_url" text,
	"sentiment" varchar(20),
	"language" varchar(10),
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"curated_by" uuid,
	"curated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "social_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platform_account_id" uuid NOT NULL,
	"content_type" varchar(20) NOT NULL,
	"media_keys" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"caption" text,
	"hashtags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"scheduled_at" timestamp,
	"published_at" timestamp,
	"platform_post_id" varchar(255),
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"error_message" text,
	"metrics" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_curated_by_admin_users_id_fk" FOREIGN KEY ("curated_by") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_posts" ADD CONSTRAINT "social_posts_platform_account_id_platform_accounts_id_fk" FOREIGN KEY ("platform_account_id") REFERENCES "public"."platform_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "platform_accounts_platform_account_id_idx" ON "platform_accounts" USING btree ("platform","account_id");--> statement-breakpoint
CREATE INDEX "platform_accounts_is_active_idx" ON "platform_accounts" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "review_raw_platform_external_idx" ON "review_raw" USING btree ("platform","external_id");--> statement-breakpoint
CREATE INDEX "reviews_platform_external_idx" ON "reviews" USING btree ("platform","external_id");--> statement-breakpoint
CREATE INDEX "reviews_status_idx" ON "reviews" USING btree ("status");--> statement-breakpoint
CREATE INDEX "reviews_sentiment_idx" ON "reviews" USING btree ("sentiment");--> statement-breakpoint
CREATE INDEX "reviews_curated_by_idx" ON "reviews" USING btree ("curated_by");--> statement-breakpoint
CREATE INDEX "reviews_created_at_idx" ON "reviews" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "social_posts_platform_account_idx" ON "social_posts" USING btree ("platform_account_id");--> statement-breakpoint
CREATE INDEX "social_posts_status_idx" ON "social_posts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "social_posts_scheduled_at_idx" ON "social_posts" USING btree ("scheduled_at");