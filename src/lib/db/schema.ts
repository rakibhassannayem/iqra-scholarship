import { sql } from "drizzle-orm";
import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  boolean,
  uniqueIndex,
  jsonb,
} from "drizzle-orm/pg-core";

export const institutions = pgTable("institutions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  eiin: varchar("eiin", { length: 20 }).notNull().unique(),

  // Leadership & Contact
  principal: varchar("principal", { length: 255 }),
  principalPhone: varchar("principal_phone", { length: 30 }),
  representative: varchar("representative", { length: 255 }),
  representativePhone: varchar("representative_phone", { length: 30 }),

  // Address
  division: varchar("division", { length: 100 }),
  district: varchar("district", { length: 100 }),
  upazila: varchar("upazila", { length: 100 }),
  village: varchar("village", { length: 255 }),
  block: varchar("block", { length: 100 }),
  address: varchar("address", { length: 500 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  studentId: varchar("student_id", { length: 50 }).notNull().unique(),
  institutionId: integer("institution_id")
    .notNull()
    .references(() => institutions.id),
  scholarshipId: integer("scholarship_id").references(() => scholarships.id),
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
  endDate: timestamp("end_date").notNull(),
  eligibility: varchar("eligibility", { length: 2000 }).notNull(),
  isActive: boolean("is_active").notNull().default(false),

  // Exam info for admit card
  examCenter: varchar("exam_center", { length: 500 }),
  examDate: varchar("exam_date", { length: 100 }),
  examTime: varchar("exam_time", { length: 100 }),
  examStartTime: varchar("exam_start_time", { length: 100 }),
  examEndTime: varchar("exam_end_time", { length: 100 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const scholarshipCategories = pgTable(
  "scholarship_categories",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull().unique(),
    description: varchar("description", { length: 1000 }),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("scholarship_categories_name_lower_unique").on(
      sql`lower(${table.name})`,
    ),
  ],
);

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

    status: varchar("status", { length: 30 }).notNull().default("granted"),

    prizeStatus: varchar("prize_status", { length: 30 })
      .notNull()
      .default("pending"),

    prizeReceivedAt: timestamp("prize_received_at"),

    confirmedBy: varchar("confirmed_by", { length: 255 }),

    prizeNotes: varchar("prize_notes", { length: 500 }),

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

export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),

  userId: integer("user_id").references(() => users.id, {
    onDelete: "set null",
  }),

  action: varchar("action", { length: 50 }).notNull(),

  module: varchar("module", { length: 100 }).notNull(),

  recordId: integer("record_id"),

  description: varchar("description", { length: 1000 }).notNull(),

  previousData: jsonb("previous_data"),

  newData: jsonb("new_data"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
