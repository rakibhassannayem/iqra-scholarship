import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  students,
  institutions,
  scholarships,
  scholarshipRegistrations,
} from "@/lib/db/schema";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const institutionId = searchParams.get("institutionId");
    const scholarshipId = searchParams.get("scholarshipId");

    const conditions = [];

    if (institutionId) {
      conditions.push(eq(students.institutionId, Number(institutionId)));
    }

    if (scholarshipId) {
      conditions.push(
        eq(scholarshipRegistrations.scholarshipId, Number(scholarshipId)),
      );
    }

    const query = db
      .select({
        id: scholarshipRegistrations.id,
        studentDbId: students.id,
        studentId: students.studentId,
        studentName: students.name,
        studentClass: students.class,
        studentRoll: students.roll,
        institutionName: institutions.name,
        scholarshipId: scholarships.id,
        scholarshipName: scholarships.name,
        registrationFee: scholarshipRegistrations.registrationFee,
        status: scholarshipRegistrations.status,
        paymentStatus: scholarshipRegistrations.paymentStatus,
        registeredAt: scholarshipRegistrations.registeredAt,
      })
      .from(scholarshipRegistrations)
      .innerJoin(students, eq(scholarshipRegistrations.studentId, students.id))
      .innerJoin(institutions, eq(students.institutionId, institutions.id))
      .innerJoin(
        scholarships,
        eq(scholarshipRegistrations.scholarshipId, scholarships.id),
      );

    const registrations =
      conditions.length > 0
        ? await query
            .where(conditions.length === 1 ? conditions[0] : and(...conditions))
            .orderBy(desc(scholarshipRegistrations.registeredAt))
        : await query.orderBy(desc(scholarshipRegistrations.registeredAt));

    return NextResponse.json(registrations);
  } catch (error) {
    console.error("Failed to fetch registrations:", error);

    return NextResponse.json(
      { error: "Failed to fetch registrations." },
      { status: 500 },
    );
  }
}
