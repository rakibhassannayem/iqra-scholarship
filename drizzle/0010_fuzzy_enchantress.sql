ALTER TABLE "institutions" ADD COLUMN "principal" varchar(255);--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "principal_phone" varchar(30);--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "representative" varchar(255);--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "representative_phone" varchar(30);--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "division" varchar(100);--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "district" varchar(100);--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "upazila" varchar(100);--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "village" varchar(255);--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "block" varchar(100);--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "address" varchar(500);--> statement-breakpoint
ALTER TABLE "scholarship_grants" ADD COLUMN "prize_status" varchar(30) DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "scholarship_grants" ADD COLUMN "prize_received_at" timestamp;--> statement-breakpoint
ALTER TABLE "scholarship_grants" ADD COLUMN "confirmed_by" varchar(255);--> statement-breakpoint
ALTER TABLE "scholarship_grants" ADD COLUMN "prize_notes" varchar(500);--> statement-breakpoint
ALTER TABLE "scholarships" ADD COLUMN "exam_center" varchar(500);--> statement-breakpoint
ALTER TABLE "scholarships" ADD COLUMN "exam_date" varchar(100);--> statement-breakpoint
ALTER TABLE "scholarships" ADD COLUMN "exam_time" varchar(100);--> statement-breakpoint
ALTER TABLE "scholarships" ADD COLUMN "exam_start_time" varchar(100);--> statement-breakpoint
ALTER TABLE "scholarships" ADD COLUMN "exam_end_time" varchar(100);--> statement-breakpoint
ALTER TABLE "scholarship_grants" DROP COLUMN "award_amount";--> statement-breakpoint
ALTER TABLE "scholarships" DROP COLUMN "start_date";--> statement-breakpoint
ALTER TABLE "scholarships" DROP COLUMN "amount";