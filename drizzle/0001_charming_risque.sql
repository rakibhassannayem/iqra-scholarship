CREATE TABLE "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" varchar(50) NOT NULL,
	"institution_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"class" integer NOT NULL,
	"roll" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "students_student_id_unique" UNIQUE("student_id")
);
--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."institutions"("id") ON DELETE no action ON UPDATE no action;