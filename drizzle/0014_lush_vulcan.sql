ALTER TABLE "scholarship_registrations" ADD COLUMN "registration_fee" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "scholarship_registrations" ADD COLUMN "status" varchar(20) DEFAULT 'Pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "scholarship_registrations" ADD COLUMN "payment_status" varchar(20) DEFAULT 'Unpaid' NOT NULL;