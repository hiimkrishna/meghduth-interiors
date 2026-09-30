ALTER TABLE "leads_inquiries" ADD COLUMN "source" varchar(32) DEFAULT 'contact-form' NOT NULL;--> statement-breakpoint
ALTER TABLE "navigations" ADD COLUMN "show_in_footer" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "footer_description" text;--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "copyright_text" varchar(255);