import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { auth } from "../../../../auth";
import { db } from "@/lib/db";
import {
  scholarshipGrants,
  students,
  institutions,
  scholarships,
  scholarshipCategories,
  scholarshipRegistrations,
} from "@/lib/db/schema";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const grants = await db
      .select({
        id: scholarshipGrants.id,
        studentDbId: students.id,
        studentId: students.studentId,
        studentName: students.name,
        studentClass: students.class,
        studentRoll: students.roll,
        institutionName: institutions.name,
        institutionEiin: institutions.eiin,
        scholarshipId: scholarships.id,
        scholarshipName: scholarships.name,
        academicYear: scholarships.academicYear,
        categoryId: scholarshipCategories.id,
        categoryName: scholarshipCategories.name,
        status: scholarshipGrants.status,
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
      .innerJoin(
        scholarships,
        eq(scholarshipGrants.scholarshipId, scholarships.id),
      )
      .innerJoin(
        scholarshipCategories,
        eq(scholarshipGrants.categoryId, scholarshipCategories.id),
      )
      .orderBy(desc(scholarshipGrants.createdAt));

    return NextResponse.json(grants);
  } catch (error) {
    console.error("GET grants error:", error);

    return NextResponse.json(
      { message: "Failed to fetch scholarship grants" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const studentId = Number(body.studentId);
    const scholarshipId = Number(body.scholarshipId);
    const categoryId = Number(body.categoryId);

    if (
      !Number.isInteger(studentId) ||
      studentId <= 0 ||
      !Number.isInteger(scholarshipId) ||
      scholarshipId <= 0 ||
      !Number.isInteger(categoryId) ||
      categoryId <= 0
    ) {
      return NextResponse.json(
        {
          message:
            "Valid studentId, scholarshipId, and categoryId are required.",
        },
        { status: 400 },
      );
    }

    const [scholarship] = await db
      .select({
        id: scholarships.id,
        isActive: scholarships.isActive,
      })
      .from(scholarships)
      .where(eq(scholarships.id, scholarshipId))
      .limit(1);

    if (!scholarship) {
      return NextResponse.json(
        { message: "Scholarship not found." },
        { status: 400 },
      );
    }

    const [category] = await db
      .select({
        id: scholarshipCategories.id,
        isActive: scholarshipCategories.isActive,
      })
      .from(scholarshipCategories)
      .where(eq(scholarshipCategories.id, categoryId))
      .limit(1);

    if (!category || !category.isActive) {
      return NextResponse.json(
        { message: "Category not found or inactive." },
        { status: 400 },
      );
    }

    const [registeredStudent] = await db
      .select({ id: students.id })
      .from(students)
      .where(
        and(
          eq(students.id, studentId),
          eq(students.scholarshipId, scholarshipId),
        ),
      )
      .limit(1);

    if (!registeredStudent) {
      return NextResponse.json(
        {
          message:
            "This student is not registered for the selected scholarship.",
        },
        { status: 400 },
      );
    }

    const [existingGrant] = await db
      .select({ id: scholarshipGrants.id })
      .from(scholarshipGrants)
      .where(
        and(
          eq(scholarshipGrants.studentId, studentId),
          eq(scholarshipGrants.scholarshipId, scholarshipId),
        ),
      )
      .limit(1);

    if (existingGrant) {
      return NextResponse.json(
        {
          message: "A grant already exists for this student and scholarship.",
        },
        { status: 409 },
      );
    }

    const [grant] = await db
      .insert(scholarshipGrants)
      .values({
        studentId,
        scholarshipId,
        categoryId,
        status: "granted",
      })
      .returning();

    return NextResponse.json(
      {
        message: "Scholarship granted successfully.",
        grant,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST grant error:", error);

    return NextResponse.json(
      { message: "Failed to grant scholarship." },
      { status: 500 },
    );
  }
}
