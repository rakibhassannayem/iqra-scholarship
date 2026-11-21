CREATE TABLE "results" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"scholarship_id" integer NOT NULL,
	"marks" integer NOT NULL,
	"category_id" integer,
	"status" varchar(30) DEFAULT 'not-awarded' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "scholarship_categories" ADD COLUMN "min_marks" integer;--> statement-breakpoint
ALTER TABLE "scholarship_categories" ADD COLUMN "max_marks" integer;--> statement-breakpoint
ALTER TABLE "results" ADD CONSTRAINT "results_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "results" ADD CONSTRAINT "results_scholarship_id_scholarships_id_fk" FOREIGN KEY ("scholarship_id") REFERENCES "public"."scholarships"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "results" ADD CONSTRAINT "results_category_id_scholarship_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."scholarship_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "student_scholarship_result_unique" ON "results" USING btree ("student_id","scholarship_id");