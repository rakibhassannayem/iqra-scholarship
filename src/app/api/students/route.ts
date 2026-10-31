import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  institutions,
  students,
  scholarships,
  scholarshipRegistrations,
  activityLogs,
} from "@/lib/db/schema";
import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";

function convertBengaliDigitsToEnglish(input: string): string {
  const banglaDigits: Record<string, string> = {
    "০": "0",
    "১": "1",
    "২": "2",
    "৩": "3",
    "৪": "4",
    "৫": "5",
    "৬": "6",
    "৭": "7",
    "৮": "8",
    "৯": "9",
  };
  return input.replace(/[০-৯]/g, (digit) => banglaDigits[digit] || digit);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const institutionIdParam = searchParams.get("institutionId");
    const classParam = searchParams.get("class");
    const searchParam = searchParams.get("search");

    const conditions = [];

    if (institutionIdParam) {
      const parsedInstitutionId = Number(institutionIdParam);
      if (!Number.isNaN(parsedInstitutionId)) {
        conditions.push(eq(students.institutionId, parsedInstitutionId));
      }
    }

    if (classParam) {
      const normalizedClass = Number(
        convertBengaliDigitsToEnglish(classParam.trim()),
      );
      if (!Number.isNaN(normalizedClass)) {
        conditions.push(eq(students.class, normalizedClass));
      }
    }

    if (searchParam && searchParam.trim()) {
      const cleanSearch = searchParam.trim();
      const engSearch = convertBengaliDigitsToEnglish(cleanSearch);
      conditions.push(
        or(
          ilike(students.name, `%${cleanSearch}%`),
          ilike(students.studentId, `%${engSearch}%`),
          sql`CAST(${students.roll} AS TEXT) = ${engSearch}`,
        ),
      );
    }

    const whereClause =
      conditions.length === 1
        ? conditions[0]
        : conditions.length > 1
          ? and(...conditions)
          : undefined;

    const baseQuery = db
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
      .leftJoin(scholarships, eq(students.scholarshipId, scholarships.id));

    const allStudents = await (
      whereClause ? baseQuery.where(whereClause) : baseQuery
    ).orderBy(
      institutionIdParam
        ? sql`${students.class} ASC, ${students.roll} ASC, ${students.studentId} ASC`
        : desc(students.createdAt),
    );

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
      class: rawClass,
      roll: rawRoll,
      scholarshipId: customScholarshipId,
    } = body;

    const parsedClass =
      typeof rawClass === "string"
        ? Number(convertBengaliDigitsToEnglish(rawClass.trim()))
        : Number(rawClass);

    const parsedRoll =
      typeof rawRoll === "string"
        ? Number(convertBengaliDigitsToEnglish(rawRoll.trim()))
        : Number(rawRoll);

    const parsedInstitutionId = Number(institutionId);

    if (
      typeof name !== "string" ||
      !name.trim() ||
      !Number.isInteger(parsedInstitutionId) ||
      !Number.isInteger(parsedClass) ||
      parsedClass < 1 ||
      parsedClass > 10 ||
      !Number.isInteger(parsedRoll) ||
      parsedRoll < 1
    ) {
      return NextResponse.json(
        { message: "Valid name, institution, class, and roll are required." },
        { status: 400 },
      );
    }

    const [institution] = await db
      .select()
      .from(institutions)
      .where(eq(institutions.id, parsedInstitutionId));

    if (!institution) {
      return NextResponse.json(
        { message: "Selected institution was not found." },
        { status: 404 },
      );
    }

    let targetScholarshipId: number;
    let targetScholarship: typeof scholarships.$inferSelect | undefined;

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
      targetScholarship = chosenScholarship;
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
      targetScholarship = activeScholarship;
    }

    const year = String(new Date().getFullYear()).slice(-2);
    const studentId = `${year}${institution.eiin}${parsedClass}${parsedRoll}`;

    const result = await db.transaction(async (tx) => {
      const [student] = await tx
        .insert(students)
        .values({
          studentId,
          institutionId: parsedInstitutionId,
          scholarshipId: targetScholarshipId,
          name: name.trim(),
          class: parsedClass,
          roll: parsedRoll,
        })
        .returning();

      const [registration] = await tx
        .insert(scholarshipRegistrations)
        .values({
          studentId: student.id,
          scholarshipId: targetScholarshipId,
        })
        .returning();

      // Create activity log
      await tx.insert(activityLogs).values({
        userId: null,
        action: "CREATE",
        module: "STUDENT",
        recordId: student.id,
        description: `Student ${student.name} (${student.studentId}) registered successfully.`,
        previousData: null,
        newData: {
          studentId: student.studentId,
          name: student.name,
          institutionId: student.institutionId,
          scholarshipId: student.scholarshipId,
          class: student.class,
          roll: student.roll,
          registrationId: registration.id,
        },
      });

      return { student, registration };
    });

    return NextResponse.json(
      {
        message: "Student registered successfully.",
        studentId: result.student.studentId,
        student: result.student,
        scholarshipRegistration: result.registration,
        institutionName: institution.name,
        institutionEiin: institution.eiin,
        scholarshipName: targetScholarship?.name,
        academicYear: targetScholarship?.academicYear,
        examCenter: targetScholarship?.examCenter ?? null,
        examDate: targetScholarship?.examDate ?? null,
        examTime: targetScholarship?.examTime ?? null,
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
