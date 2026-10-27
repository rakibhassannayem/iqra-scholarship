import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  institutions,
  students,
  scholarships,
  scholarshipRegistrations,
} from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const allStudents = await db
      .select({
        id: students.id,
        studentId: students.studentId,
        name: students.name,
        class: students.class,
        roll: students.roll,
        institutionId: students.institutionId,
        institutionName: institutions.name,
        institutionEiin: institutions.eiin,
        scholarshipId: students.scholarshipId,
        scholarshipName: scholarships.name,
        createdAt: students.createdAt,
      })
      .from(students)
      .innerJoin(institutions, eq(students.institutionId, institutions.id))
      .leftJoin(scholarships, eq(students.scholarshipId, scholarships.id))
      .orderBy(desc(students.createdAt));

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
    const {
      name,
      institutionId,
      class: studentClass,
      roll,
      scholarshipId: customScholarshipId,
    } = body;

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

    let targetScholarshipId: number;

    if (Number.isInteger(customScholarshipId) && customScholarshipId > 0) {
      const [chosenScholarship] = await db
        .select()
        .from(scholarships)
        .where(eq(scholarships.id, customScholarshipId))
        .limit(1);

      if (!chosenScholarship) {
        return NextResponse.json(
          { message: "Selected scholarship was not found." },
          { status: 404 },
        );
      }
      targetScholarshipId = chosenScholarship.id;
    } else {
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
      targetScholarshipId = activeScholarship.id;
    }

    const year = String(new Date().getFullYear()).slice(-2);
    const studentId = `${year}${institution.eiin}${studentClass}${roll}`;

    const result = await db.transaction(async (tx) => {
      const [student] = await tx
        .insert(students)
        .values({
          studentId,
          institutionId,
          scholarshipId: targetScholarshipId,
          name: name.trim(),
          class: studentClass,
          roll,
        })
        .returning();

      const [registration] = await tx
        .insert(scholarshipRegistrations)
        .values({
          studentId: student.id,
          scholarshipId: targetScholarshipId,
        })
        .returning();

      return { student, registration };
    });

    return NextResponse.json(
      {
        message: "Student registered successfully.",
        studentId: result.student.studentId,
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
