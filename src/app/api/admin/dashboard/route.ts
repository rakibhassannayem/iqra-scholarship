import { NextResponse } from "next/server";
import { count, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  institutions,
  students,
  scholarships,
  scholarshipRegistrations,
} from "@/lib/db/schema";

export async function GET() {
  try {
    const [
      studentCount,
      institutionCount,
      scholarshipCount,
      activeScholarshipCount,
      registrationCount,
    ] = await Promise.all([
      db.select({ total: count() }).from(students),
      db.select({ total: count() }).from(institutions),
      db.select({ total: count() }).from(scholarships),
      db
        .select({ total: count() })
        .from(scholarships)
        .where(eq(scholarships.isActive, true)),
      db.select({ total: count() }).from(scholarshipRegistrations),
    ]);

    return NextResponse.json({
      totalStudents: studentCount[0].total,
      totalInstitutions: institutionCount[0].total,
      totalScholarships: scholarshipCount[0].total,
      activeScholarships: activeScholarshipCount[0].total,
      totalRegistrations: registrationCount[0].total,
    });
  } catch (error) {
    console.error("Dashboard statistics error:", error);

    return NextResponse.json(
      { message: "Failed to load dashboard statistics." },
      { status: 500 },
    );
  }
}
