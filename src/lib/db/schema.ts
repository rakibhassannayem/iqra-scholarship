import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  boolean,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const institutions = pgTable("institutions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  eiin: varchar("eiin", { length: 20 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  studentId: varchar("student_id", { length: 50 }).notNull().unique(),
  institutionId: integer("institution_id")
    .notNull()
    .references(() => institutions.id),
  name: varchar("name", { length: 255 }).notNull(),
  class: integer("class").notNull(),
  roll: integer("roll").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const scholarships = pgTable("scholarships", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 2000 }).notNull(),
  academicYear: varchar("academic_year", { length: 20 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  amount: integer("amount").notNull(),
  eligibility: varchar("eligibility", { length: 2000 }).notNull(),
  isActive: boolean("is_active").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const scholarshipCategories = pgTable("scholarship_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: varchar("description", { length: 1000 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const scholarshipGrants = pgTable(
  "scholarship_grants",
  {
    id: serial("id").primaryKey(),

    studentId: integer("student_id")
      .notNull()
      .references(() => students.id),

    scholarshipId: integer("scholarship_id")
      .notNull()
      .references(() => scholarships.id),

    categoryId: integer("category_id")
      .notNull()
      .references(() => scholarshipCategories.id, {
        onDelete: "restrict",
      }),

    awardAmount: integer("award_amount").notNull(),

    status: varchar("status", { length: 30 }).notNull().default("granted"),

    grantedAt: timestamp("granted_at").defaultNow().notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("student_scholarship_grant_unique").on(
      table.studentId,
      table.scholarshipId,
    ),
  ],
);

export const scholarshipRegistrations = pgTable(
  "scholarship_registrations",
  {
    id: serial("id").primaryKey(),

    studentId: integer("student_id")
      .notNull()
      .references(() => students.id),

    scholarshipId: integer("scholarship_id")
      .notNull()
      .references(() => scholarships.id),

    registeredAt: timestamp("registered_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("student_scholarship_unique").on(
      table.studentId,
      table.scholarshipId,
    ),
  ],
);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("admin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notices = pgTable("notices", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: varchar("content", { length: 5000 }).notNull(),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
