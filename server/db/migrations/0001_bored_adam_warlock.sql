CREATE TABLE "service_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_id" uuid NOT NULL,
	"image_key" varchar(512) NOT NULL,
	"alt" varchar(255),
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "service_images" ADD CONSTRAINT "service_images_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;