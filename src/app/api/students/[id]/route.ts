import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { institutions, students } from "@/lib/db/schema";
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
      .select()
      .from(students)
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

    // Keep the original admission year in the Student ID.
    const year = existingStudent.studentId.slice(0, 2);
    const newStudentId = `${year}${institution.eiin}${studentClass}${roll}`;

    const [updatedStudent] = await db
      .update(students)
      .set({
        name: name.trim(),
        institutionId,
        class: studentClass,
        roll,
        studentId: newStudentId,
      })
      .where(eq(students.id, studentId))
      .returning();

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

// DELETE: Delete a student
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

    const [deletedStudent] = await db
      .delete(students)
      .where(eq(students.id, studentId))
      .returning();

    if (!deletedStudent) {
      return NextResponse.json(
        { message: "Student not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Student deleted successfully.",
      student: deletedStudent,
    });
  } catch (error) {
    console.error("Failed to delete student:", error);

    return NextResponse.json(
      { message: "Failed to delete student." },
      { status: 500 },
    );
  }
}
