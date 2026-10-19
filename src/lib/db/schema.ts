import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
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
