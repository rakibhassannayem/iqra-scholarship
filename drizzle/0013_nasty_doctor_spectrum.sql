ALTER TABLE "scholarships" ADD COLUMN "eligibility_class" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "scholarships" ADD COLUMN "registration_fee" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "scholarships" DROP COLUMN "eligibility";