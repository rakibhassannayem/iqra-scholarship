import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  students,
  institutions,
  scholarships,
  scholarshipGrants,
  scholarshipCategories,
} from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

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

/** Lookup result for a single student by their studentId string */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentIdParam = searchParams.get("studentId");
  const institutionIdParam = searchParams.get("institutionId");
  const classParam = searchParams.get("class");

  try {
    // ── Single student lookup ─────────────────────────────────────────
    if (studentIdParam) {
      const cleanId = convertBengaliDigitsToEnglish(studentIdParam.trim());

      const [row] = await db
        .select({
          id: students.id,
          studentId: students.studentId,
          name: students.name,
          class: students.class,
          roll: students.roll,
          scholarshipId: students.scholarshipId,
          scholarshipName: scholarships.name,
          institutionName: institutions.name,
          institutionEiin: institutions.eiin,
          grantStatus: scholarshipGrants.status,
          categoryName: scholarshipCategories.name,
        })
        .from(students)
        .innerJoin(institutions, eq(students.institutionId, institutions.id))
        .leftJoin(scholarships, eq(students.scholarshipId, scholarships.id))
        .leftJoin(
          scholarshipGrants,
          and(
            eq(scholarshipGrants.studentId, students.id),
            eq(scholarshipGrants.scholarshipId, students.scholarshipId!),
          ),
        )
        .leftJoin(
          scholarshipCategories,
          eq(scholarshipGrants.categoryId, scholarshipCategories.id),
        )
        .where(eq(students.studentId, cleanId))
        .limit(1);

      if (!row) {
        return NextResponse.json(
          { message: "No student found with this ID." },
          { status: 404 },
        );
      }

      const resultStatus = row.grantStatus
        ? "awarded"
        : row.scholarshipId
          ? "not-awarded"
          : "not-registered";

      return NextResponse.json({
        studentId: row.studentId,
        name: row.name,
        class: row.class,
        roll: row.roll,
        institutionName: row.institutionName,
        scholarshipName: row.scholarshipName ?? null,
        result: {
          status: resultStatus,
          category: row.categoryName ?? null,
        },
      });
    }

    // ── Institution + class list ──────────────────────────────────────
    if (institutionIdParam && classParam) {
      const parsedInstitutionId = Number(institutionIdParam);
      const parsedClass = Number(
        convertBengaliDigitsToEnglish(classParam.trim()),
      );

      if (
        Number.isNaN(parsedInstitutionId) ||
        Number.isNaN(parsedClass)
      ) {
        return NextResponse.json(
          { message: "Invalid institutionId or class parameter." },
          { status: 400 },
        );
      }

      const rows = await db
        .select({
          id: students.id,
          studentId: students.studentId,
          name: students.name,
          class: students.class,
          roll: students.roll,
          scholarshipId: students.scholarshipId,
          grantStatus: scholarshipGrants.status,
          categoryName: scholarshipCategories.name,
        })
        .from(students)
        .leftJoin(
          scholarshipGrants,
          and(
            eq(scholarshipGrants.studentId, students.id),
            eq(scholarshipGrants.scholarshipId, students.scholarshipId!),
          ),
        )
        .leftJoin(
          scholarshipCategories,
          eq(scholarshipGrants.categoryId, scholarshipCategories.id),
        )
        .where(
          and(
            eq(students.institutionId, parsedInstitutionId),
            eq(students.class, parsedClass),
          ),
        )
        .orderBy(students.roll);

      const list = rows.map((row) => ({
        studentId: row.studentId,
        name: row.name,
        class: row.class,
        roll: row.roll,
        result: {
          status: row.grantStatus
            ? "awarded"
            : row.scholarshipId
              ? "not-awarded"
              : "not-registered",
          category: row.categoryName ?? null,
        },
      }));

      return NextResponse.json(list);
    }

    return NextResponse.json(
      { message: "Provide either studentId or institutionId + class." },
      { status: 400 },
    );
  } catch (error) {
    console.error("Failed to fetch result:", error);
    return NextResponse.json(
      { message: "Failed to fetch result." },
      { status: 500 },
    );
  }
}
