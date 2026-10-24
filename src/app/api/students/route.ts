import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  institutions,
  students,
  scholarships,
  scholarshipRegistrations,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allStudents = await db.select().from(students);

    return NextResponse.json(allStudents);
  } catch (error) {
    console.error("Failed to fetch students:", error);

    return NextResponse.json(
      { message: "Failed to fetch students." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, institutionId, class: studentClass, roll } = body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      !Number.isInteger(institutionId) ||
      !Number.isInteger(studentClass) ||
      studentClass < 1 ||
      studentClass > 10 ||
      !Number.isInteger(roll) ||
      roll < 1
    ) {
      return NextResponse.json(
        { message: "Valid name, institution, class, and roll are required." },
        { status: 400 },
      );
    }

    const [institution] = await db
      .select()
      .from(institutions)
      .where(eq(institutions.id, institutionId));

    if (!institution) {
      return NextResponse.json(
        { message: "Selected institution was not found." },
        { status: 404 },
      );
    }

    const [activeScholarship] = await db
      .select()
      .from(scholarships)
      .where(eq(scholarships.isActive, true))
      .limit(1);

    if (!activeScholarship) {
      return NextResponse.json(
        {
          message:
            "Student registration is currently closed because no scholarship is active.",
        },
        { status: 409 },
      );
    }

    const year = String(new Date().getFullYear()).slice(-2);
    const studentId = `${year}${institution.eiin}${studentClass}${roll}`;

    const result = await db.transaction(async (tx) => {
      const [student] = await tx
        .insert(students)
        .values({
          studentId,
          institutionId,
          name: name.trim(),
          class: studentClass,
          roll,
        })
        .returning();

      const [registration] = await tx
        .insert(scholarshipRegistrations)
        .values({
          studentId: student.id,
          scholarshipId: activeScholarship.id,
        })
        .returning();

      return { student, registration };
    });

    return NextResponse.json(
      {
        message: "Student registered successfully.",
        student: result.student,
        scholarshipRegistration: result.registration,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create student:", error);

    return NextResponse.json(
      {
        message: "Failed to create student. The Student ID may already exist.",
      },
      { status: 500 },
    );
  }
}
