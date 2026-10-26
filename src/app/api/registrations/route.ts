import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  scholarshipRegistrations,
  students,
  institutions,
  scholarships,
} from "@/lib/db/schema";

export async function GET() {
  try {
    const registrations = await db
      .select({
        id: scholarshipRegistrations.id,
        studentDbId: students.id,
        studentId: students.studentId,
        studentName: students.name,
        institutionName: institutions.name,
        scholarshipId: scholarships.id,
        scholarshipName: scholarships.name,
        registeredAt: scholarshipRegistrations.registeredAt,
      })
      .from(scholarshipRegistrations)
      .innerJoin(students, eq(scholarshipRegistrations.studentId, students.id))
      .innerJoin(institutions, eq(students.institutionId, institutions.id))
      .innerJoin(
        scholarships,
        eq(scholarshipRegistrations.scholarshipId, scholarships.id),
      )
      .orderBy(desc(scholarshipRegistrations.registeredAt));

    return NextResponse.json(registrations);
  } catch (error) {
    console.error("Failed to fetch registrations:", error);

    return NextResponse.json(
      { error: "Failed to fetch registrations." },
      { status: 500 },
    );
  }
}
