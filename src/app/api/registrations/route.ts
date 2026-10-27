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
        id: students.id,
        studentDbId: students.id,
        studentId: students.studentId,
        studentName: students.name,
        institutionName: institutions.name,
        scholarshipId: scholarships.id,
        scholarshipName: scholarships.name,
        registeredAt: students.createdAt,
      })
      .from(students)
      .innerJoin(institutions, eq(students.institutionId, institutions.id))
      .innerJoin(
        scholarships,
        eq(students.scholarshipId, scholarships.id),
      )
      .orderBy(desc(students.createdAt));

    return NextResponse.json(registrations);
  } catch (error) {
    console.error("Failed to fetch registrations:", error);

    return NextResponse.json(
      { error: "Failed to fetch registrations." },
      { status: 500 },
    );
  }
}
