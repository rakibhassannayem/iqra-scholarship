import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { auth } from "../../../../auth";
import { db } from "@/lib/db";
import {
  scholarshipGrants,
  students,
  institutions,
  scholarships,
  scholarshipCategories,
} from "@/lib/db/schema";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const prizes = await db
      .select({
        id: scholarshipGrants.id,
        grantId: scholarshipGrants.id,
        studentDbId: students.id,
        studentId: students.studentId,
        studentName: students.name,
        class: students.class,
        roll: students.roll,
        institutionId: institutions.id,
        institutionName: institutions.name,
        institutionEiin: institutions.eiin,
        scholarshipId: scholarships.id,
        scholarshipName: scholarships.name,
        categoryId: scholarshipCategories.id,
        categoryName: scholarshipCategories.name,
        grantStatus: scholarshipGrants.status,
        prizeStatus: scholarshipGrants.prizeStatus,
        prizeReceivedAt: scholarshipGrants.prizeReceivedAt,
        confirmedBy: scholarshipGrants.confirmedBy,
        prizeNotes: scholarshipGrants.prizeNotes,
        grantedAt: scholarshipGrants.grantedAt,
        createdAt: scholarshipGrants.createdAt,
      })
      .from(scholarshipGrants)
      .innerJoin(students, eq(scholarshipGrants.studentId, students.id))
      .innerJoin(institutions, eq(students.institutionId, institutions.id))
      .innerJoin(scholarships, eq(scholarshipGrants.scholarshipId, scholarships.id))
      .innerJoin(
        scholarshipCategories,
        eq(scholarshipGrants.categoryId, scholarshipCategories.id),
      )
      .orderBy(desc(scholarshipGrants.createdAt));

    return NextResponse.json(prizes);
  } catch (error) {
    console.error("GET /api/prizes error:", error);

    return NextResponse.json(
      { message: "Failed to fetch prize confirmations." },
      { status: 500 },
    );
  }
}
