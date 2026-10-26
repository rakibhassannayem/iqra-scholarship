CREATE TABLE "scholarship_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(1000),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "scholarship_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "scholarship_grants" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"scholarship_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	"award_amount" integer NOT NULL,
	"status" varchar(30) DEFAULT 'granted' NOT NULL,
	"granted_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "scholarship_grants" ADD CONSTRAINT "scholarship_grants_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scholarship_grants" ADD CONSTRAINT "scholarship_grants_scholarship_id_scholarships_id_fk" FOREIGN KEY ("scholarship_id") REFERENCES "public"."scholarships"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scholarship_grants" ADD CONSTRAINT "scholarship_grants_category_id_scholarship_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."scholarship_categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "student_scholarship_grant_unique" ON "scholarship_grants" USING btree ("student_id","scholarship_id");