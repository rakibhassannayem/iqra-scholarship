import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  institutions,
  students,
  scholarships,
  scholarshipRegistrations,
  activityLogs,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET: Fetch a single student
export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const studentId = Number(id);

    if (!Number.isInteger(studentId) || studentId < 1) {
      return NextResponse.json(
        { message: "Invalid student ID." },
        { status: 400 },
      );
    }

    const [student] = await db
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
      .where(eq(students.id, studentId))
      .limit(1);

    if (!student) {
      return NextResponse.json(
        { message: "Student not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("Failed to fetch student:", error);

    return NextResponse.json(
      { message: "Failed to fetch student." },
      { status: 500 },
    );
  }
}

// PATCH: Update a student
export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const studentId = Number(id);

    if (!Number.isInteger(studentId) || studentId < 1) {
      return NextResponse.json(
        { message: "Invalid student ID." },
        { status: 400 },
      );
    }

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
        {
          message: "Valid name, institution, class, and roll are required.",
        },
        { status: 400 },
      );
    }

    const [existingStudent] = await db
      .select()
      .from(students)
      .where(eq(students.id, studentId))
      .limit(1);

    if (!existingStudent) {
      return NextResponse.json(
        { message: "Student not found." },
        { status: 404 },
      );
    }

    const [institution] = await db
      .select()
      .from(institutions)
      .where(eq(institutions.id, institutionId))
      .limit(1);

    if (!institution) {
      return NextResponse.json(
        { message: "Selected institution was not found." },
        { status: 404 },
      );
    }

    // Keep the original registration year in the Student ID
    const year = existingStudent.studentId.slice(0, 2);
    const newStudentId = `${year}${institution.eiin}${studentClass}${roll}`;

    const updateData: {
      name: string;
      institutionId: number;
      class: number;
      roll: number;
      studentId: string;
      scholarshipId?: number;
    } = {
      name: name.trim(),
      institutionId,
      class: studentClass,
      roll,
      studentId: newStudentId,
    };

    if (Number.isInteger(customScholarshipId) && customScholarshipId > 0) {
      updateData.scholarshipId = customScholarshipId;
    }

    const updatedStudent = await db.transaction(async (tx) => {
      const [student] = await tx
        .update(students)
        .set(updateData)
        .where(eq(students.id, studentId))
        .returning();

      await tx.insert(activityLogs).values({
        userId: null,
        action: "UPDATE",
        module: "STUDENT",
        recordId: student.id,
        description: `Student ${student.name} (${student.studentId}) updated successfully.`,
        previousData: {
          studentId: existingStudent.studentId,
          name: existingStudent.name,
          institutionId: existingStudent.institutionId,
          scholarshipId: existingStudent.scholarshipId,
          class: existingStudent.class,
          roll: existingStudent.roll,
        },
        newData: {
          studentId: student.studentId,
          name: student.name,
          institutionId: student.institutionId,
          scholarshipId: student.scholarshipId,
          class: student.class,
          roll: student.roll,
        },
      });

      return student;
    });

    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.error("Failed to update student:", error);

    return NextResponse.json(
      {
        message: "Failed to update student. The Student ID may already exist.",
      },
      { status: 500 },
    );
  }
}

// DELETE: Delete a student and associated registrations
export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const studentId = Number(id);

    if (!Number.isInteger(studentId) || studentId < 1) {
      return NextResponse.json(
        { message: "Invalid student ID." },
        { status: 400 },
      );
    }

    const result = await db.transaction(async (tx) => {
      await tx
        .delete(scholarshipRegistrations)
        .where(eq(scholarshipRegistrations.studentId, studentId));

      const [deletedStudent] = await tx
        .delete(students)
        .where(eq(students.id, studentId))
        .returning();

      if (!deletedStudent) {
        return null;
      }

      await tx.insert(activityLogs).values({
        userId: null,
        action: "DELETE",
        module: "STUDENT",
        recordId: deletedStudent.id,
        description: `Student ${deletedStudent.name} (${deletedStudent.studentId}) deleted successfully.`,
        previousData: {
          studentId: deletedStudent.studentId,
          name: deletedStudent.name,
          institutionId: deletedStudent.institutionId,
          scholarshipId: deletedStudent.scholarshipId,
          class: deletedStudent.class,
          roll: deletedStudent.roll,
        },
        newData: null,
      });

      return deletedStudent;
    });

    if (!result) {
      return NextResponse.json(
        { message: "Student not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Student registration deleted successfully.",
      student: result,
    });
  } catch (error) {
    console.error("Failed to delete student:", error);

    return NextResponse.json(
      {
        message:
          "Failed to delete student. It may be linked to an awarded grant.",
      },
      { status: 500 },
    );
  }
}
