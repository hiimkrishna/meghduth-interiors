CREATE TABLE "inbox_emails" (
	"id" serial PRIMARY KEY NOT NULL,
	"message_id" varchar(512) NOT NULL,
	"from_addr" varchar(512) NOT NULL,
	"to_addr" varchar(512) DEFAULT '' NOT NULL,
	"subject" varchar(1000) DEFAULT '' NOT NULL,
	"snippet" varchar(500) DEFAULT '' NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"received_at" timestamp DEFAULT now() NOT NULL,
	"seen" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "inbox_emails_message_id_unique" UNIQUE("message_id")
);
