import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  students,
  institutions,
  scholarships,
  scholarshipRegistrations,
} from "@/lib/db/schema";
import { eq, sql, desc } from "drizzle-orm";

function normalizeStudentId(input: string): string {
  const banglaToEnglish: Record<string, string> = {
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
  return input
    .trim()
    .replace(/[০-৯]/g, (digit) => banglaToEnglish[digit] || digit);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawStudentId = searchParams.get("studentId");

    if (!rawStudentId || !rawStudentId.trim()) {
      return NextResponse.json(
        { message: "শিক্ষার্থীর আইডি (Student ID) প্রদান করা আবশ্যক।" },
        { status: 400 },
      );
    }

    const normalizedId = normalizeStudentId(rawStudentId);

    // Look up the student with institution & scholarship
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
        academicYear: scholarships.academicYear,
        examCenter: scholarships.examCenter,
        examDate: scholarships.examDate,
        examTime: scholarships.examTime,
      })
      .from(students)
      .leftJoin(institutions, eq(students.institutionId, institutions.id))
      .leftJoin(scholarships, eq(students.scholarshipId, scholarships.id))
      .where(
        sql`lower(trim(${students.studentId})) = lower(trim(${normalizedId}))`,
      )
      .limit(1);

    if (!student) {
      return NextResponse.json(
        {
          message:
            "প্রদত্ত Student ID দিয়ে কোনো নিবন্ধিত শিক্ষার্থী পাওয়া যায়নি। অনুগ্রহ করে আইডি যাচাই করে আবার চেষ্টা করুন।",
        },
        { status: 404 },
      );
    }

    let scholarshipName = student.scholarshipName;
    let academicYear = student.academicYear;
    let examCenter = student.examCenter;
    let examDate = student.examDate;
    let examTime = student.examTime;

    // Fallback: check scholarshipRegistrations if scholarship is not linked directly
    if (!scholarshipName) {
      const [registration] = await db
        .select({
          scholarshipName: scholarships.name,
          academicYear: scholarships.academicYear,
          examCenter: scholarships.examCenter,
          examDate: scholarships.examDate,
          examTime: scholarships.examTime,
        })
        .from(scholarshipRegistrations)
        .innerJoin(
          scholarships,
          eq(scholarshipRegistrations.scholarshipId, scholarships.id),
        )
        .where(eq(scholarshipRegistrations.studentId, student.id))
        .orderBy(desc(scholarshipRegistrations.id))
        .limit(1);

      if (registration) {
        scholarshipName = registration.scholarshipName;
        academicYear = registration.academicYear;
        examCenter = registration.examCenter;
        examDate = registration.examDate;
        examTime = registration.examTime;
      }
    }

    // Fallback 2: If still missing, check active scholarship
    if (!scholarshipName) {
      const [activeScholarship] = await db
        .select()
        .from(scholarships)
        .where(eq(scholarships.isActive, true))
        .limit(1);

      if (activeScholarship) {
        scholarshipName = activeScholarship.name;
        academicYear = activeScholarship.academicYear;
        examCenter = examCenter || activeScholarship.examCenter;
        examDate = examDate || activeScholarship.examDate;
        examTime = examTime || activeScholarship.examTime;
      }
    }

    return NextResponse.json({
      success: true,
      admitCard: {
        studentName: student.name,
        studentId: student.studentId,
        studentRoll: student.roll,
        studentClass: student.class,
        institutionName: student.institutionName || "অজ্ঞাত প্রতিষ্ঠান",
        institutionEiin: student.institutionEiin || "",
        scholarshipName: scholarshipName ?? undefined,
        academicYear: academicYear ?? undefined,
        examCenter: examCenter ?? undefined,
        examDate: examDate ?? undefined,
        examTime: examTime ?? undefined,
      },
    });
  } catch (error) {
    console.error("Failed to fetch admit card:", error);
    return NextResponse.json(
      { message: "প্রবেশপত্র তথ্য সংগ্রহ করতে সমস্যা হয়েছে।" },
      { status: 500 },
    );
  }
}
