CREATE TABLE "payment_submission_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"payment_submission_id" integer NOT NULL,
	"registration_id" integer NOT NULL,
	"amount" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"institution_id" integer NOT NULL,
	"scholarship_id" integer NOT NULL,
	"total_amount" integer NOT NULL,
	"payment_method" varchar(50) NOT NULL,
	"transaction_id" varchar(255) NOT NULL,
	"screenshot_url" varchar(1000) NOT NULL,
	"status" varchar(20) DEFAULT 'Pending' NOT NULL,
	"admin_note" varchar(1000),
	"reviewed_at" timestamp,
	"submitted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payment_submission_items" ADD CONSTRAINT "payment_submission_items_payment_submission_id_payment_submissions_id_fk" FOREIGN KEY ("payment_submission_id") REFERENCES "public"."payment_submissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_submission_items" ADD CONSTRAINT "payment_submission_items_registration_id_scholarship_registrations_id_fk" FOREIGN KEY ("registration_id") REFERENCES "public"."scholarship_registrations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_submissions" ADD CONSTRAINT "payment_submissions_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."institutions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_submissions" ADD CONSTRAINT "payment_submissions_scholarship_id_scholarships_id_fk" FOREIGN KEY ("scholarship_id") REFERENCES "public"."scholarships"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "payment_submission_registration_unique" ON "payment_submission_items" USING btree ("payment_submission_id","registration_id");