import { NextResponse } from "next/server";
import { asc, desc, eq, and, sql, ilike, or } from "drizzle-orm";
import { auth } from "../../../../../auth";
import { db } from "@/lib/db";
import {
  students,
  institutions,
  scholarships,
  scholarshipRegistrations,
  scholarshipCategories,
  results,
  scholarshipGrants,
} from "@/lib/db/schema";
import { toBengaliClass, formatInstitutionLocation } from "@/lib/certificate-utils";

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const scholarshipIdParam = searchParams.get("scholarshipId");
    const institutionIdParam = searchParams.get("institutionId");
    const classParam = searchParams.get("class");
    const categoryIdParam = searchParams.get("categoryId");
    const searchParam = searchParams.get("search")?.trim();

    // 1. Resolve target scholarship
    let scholarshipId: number;
    if (scholarshipIdParam) {
      scholarshipId = Number(scholarshipIdParam);
    } else {
      const [activeScholarship] = await db
        .select({ id: scholarships.id })
        .from(scholarships)
        .where(eq(scholarships.isActive, true))
        .limit(1);

      if (activeScholarship) {
        scholarshipId = activeScholarship.id;
      } else {
        const [latestScholarship] = await db
          .select({ id: scholarships.id })
          .from(scholarships)
          .orderBy(desc(scholarships.createdAt))
          .limit(1);
        scholarshipId = latestScholarship ? latestScholarship.id : 0;
      }
    }

    if (!scholarshipId) {
      return NextResponse.json({
        certificates: [],
        categories: [],
        scholarships: [],
      });
    }

    // 2. Fetch metadata for filtering
    const [allScholarships, allInstitutions, allCategories] = await Promise.all([
      db
        .select({
          id: scholarships.id,
          name: scholarships.name,
          academicYear: scholarships.academicYear,
          isActive: scholarships.isActive,
        })
        .from(scholarships)
        .orderBy(desc(scholarships.createdAt)),
      db
        .select({
          id: institutions.id,
          name: institutions.name,
          eiin: institutions.eiin,
        })
        .from(institutions)
        .orderBy(asc(institutions.name)),
      db
        .select({
          id: scholarshipCategories.id,
          name: scholarshipCategories.name,
        })
        .from(scholarshipCategories)
        .where(eq(scholarshipCategories.isActive, true))
        .orderBy(asc(scholarshipCategories.minMarks)),
    ]);

    // 3. Build query filters
    const conditions = [
      eq(scholarshipRegistrations.scholarshipId, scholarshipId),
    ];

    if (institutionIdParam) {
      conditions.push(eq(students.institutionId, Number(institutionIdParam)));
    }

    if (classParam) {
      conditions.push(eq(students.class, Number(classParam)));
    }

    if (categoryIdParam) {
      conditions.push(eq(results.categoryId, Number(categoryIdParam)));
    }

    if (searchParam) {
      conditions.push(
        or(
          ilike(students.name, `%${searchParam}%`),
          ilike(students.studentId, `%${searchParam}%`),
          sql`CAST(${students.roll} AS TEXT) ILIKE ${`%${searchParam}%`}`,
        )!,
      );
    }

    // 4. Fetch students with results, categories, and institutional details
    const rows = await db
      .select({
        studentDbId: students.id,
        studentId: students.studentId,
        studentName: students.name,
        fatherName: students.fatherName,
        motherName: students.motherName,
        class: students.class,
        roll: students.roll,
        institutionId: institutions.id,
        institutionName: institutions.name,
        institutionUpazila: institutions.upazila,
        institutionDistrict: institutions.district,
        institutionAddress: institutions.address,
        scholarshipId: scholarships.id,
        scholarshipName: scholarships.name,
        academicYear: scholarships.academicYear,
        examCenter: scholarships.examCenter,
        marks: results.marks,
        resultCategoryId: results.categoryId,
        categoryName: scholarshipCategories.name,
        grantCategoryId: scholarshipGrants.categoryId,
      })
      .from(scholarshipRegistrations)
      .innerJoin(students, eq(scholarshipRegistrations.studentId, students.id))
      .innerJoin(institutions, eq(students.institutionId, institutions.id))
      .innerJoin(scholarships, eq(scholarshipRegistrations.scholarshipId, scholarships.id))
      .leftJoin(
        results,
        and(
          eq(results.studentId, students.id),
          eq(results.scholarshipId, scholarshipId),
        ),
      )
      .leftJoin(
        scholarshipCategories,
        eq(results.categoryId, scholarshipCategories.id),
      )
      .leftJoin(
        scholarshipGrants,
        and(
          eq(scholarshipGrants.studentId, students.id),
          eq(scholarshipGrants.scholarshipId, scholarshipId),
        ),
      )
      .where(and(...conditions))
      .orderBy(asc(students.class), asc(students.roll));

    const certificates = rows.map((row) => {
      const categoryName = row.categoryName || "ট্যালেন্টপুল";

      const institutionAddress = formatInstitutionLocation({
        name: row.institutionName,
        address: row.institutionAddress,
        upazila: row.institutionUpazila,
        district: row.institutionDistrict,
      });

      return {
        studentDbId: row.studentDbId,
        studentId: row.studentId,
        studentName: row.studentName,
        fatherName: row.fatherName,
        motherName: row.motherName,
        className: toBengaliClass(row.class),
        roll: row.roll,
        examCenter: row.examCenter || "ঘাটাইল, টাঙ্গাইল",
        scholarshipName: row.scholarshipName,
        academicYear: row.academicYear,
        institutionName: row.institutionName,
        institutionAddress: [row.institutionAddress || row.institutionUpazila, row.institutionDistrict].filter(Boolean).join(", "),
        categoryName,
        marks: row.marks,
      };
    });

    return NextResponse.json({
      certificates,
      scholarships: allScholarships,
      institutions: allInstitutions,
      categories: allCategories,
      selectedScholarshipId: scholarshipId,
    });
  } catch (error) {
    console.error("GET /api/admin/certificates error:", error);
    return NextResponse.json(
      { message: "Failed to fetch certificate records." },
      { status: 500 },
    );
  }
}
