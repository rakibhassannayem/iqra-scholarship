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
  scholarshipGrants,
  results,
  activityLogs,
} from "@/lib/db/schema";

/**
 * Determine which active scholarship category matches a student's marks.
 */
function findMatchingCategory(
  marks: number,
  categories: {
    id: number;
    name: string;
    minMarks: number | null;
    maxMarks: number | null;
  }[],
) {
  for (const cat of categories) {
    if (cat.minMarks !== null && cat.maxMarks !== null) {
      if (marks >= cat.minMarks && marks <= cat.maxMarks) {
        return cat;
      }
    } else if (cat.minMarks !== null && cat.maxMarks === null) {
      if (marks >= cat.minMarks) {
        return cat;
      }
    } else if (cat.minMarks === null && cat.maxMarks !== null) {
      if (marks <= cat.maxMarks) {
        return cat;
      }
    }
  }
  return null;
}

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
    const searchParam = searchParams.get("search")?.trim();

    // Find active scholarship if none provided
    let scholarshipId: number;
    if (scholarshipIdParam) {
      scholarshipId = Number(scholarshipIdParam);
    } else {
      const [activeScholarship] = await db
        .select({ id: scholarships.id })
        .from(scholarships)
        .where(eq(scholarships.isActive, true))
        .limit(1);

      if (!activeScholarship) {
        const [latestScholarship] = await db
          .select({ id: scholarships.id })
          .from(scholarships)
          .orderBy(desc(scholarships.createdAt))
          .limit(1);

        scholarshipId = latestScholarship ? latestScholarship.id : 0;
      } else {
        scholarshipId = activeScholarship.id;
      }
    }

    if (!scholarshipId) {
      return NextResponse.json({
        students: [],
        categories: [],
        stats: {
          totalStudents: 0,
          enteredCount: 0,
          pendingCount: 0,
          awardedCount: 0,
          notAwardedCount: 0,
        },
      });
    }

    // Active categories with marks limits
    const activeCategories = await db
      .select({
        id: scholarshipCategories.id,
        name: scholarshipCategories.name,
        minMarks: scholarshipCategories.minMarks,
        maxMarks: scholarshipCategories.maxMarks,
      })
      .from(scholarshipCategories)
      .where(eq(scholarshipCategories.isActive, true))
      .orderBy(asc(scholarshipCategories.minMarks), asc(scholarshipCategories.name));

    // Base query conditions
    const conditions = [eq(scholarshipRegistrations.scholarshipId, scholarshipId)];

    if (institutionIdParam && !Number.isNaN(Number(institutionIdParam))) {
      conditions.push(eq(students.institutionId, Number(institutionIdParam)));
    }

    if (classParam && !Number.isNaN(Number(classParam))) {
      conditions.push(eq(students.class, Number(classParam)));
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

    const rows = await db
      .select({
        studentDbId: students.id,
        studentId: students.studentId,
        name: students.name,
        class: students.class,
        roll: students.roll,
        institutionId: institutions.id,
        institutionName: institutions.name,
        scholarshipId: scholarships.id,
        scholarshipName: scholarships.name,
        resultId: results.id,
        marks: results.marks,
        categoryId: results.categoryId,
        categoryName: scholarshipCategories.name,
        status: results.status,
        updatedAt: results.updatedAt,
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
      .where(and(...conditions))
      .orderBy(asc(students.class), asc(students.roll));

    let enteredCount = 0;
    let awardedCount = 0;
    let notAwardedCount = 0;

    const formattedStudents = rows.map((row) => {
      const hasResult = row.resultId !== null && row.marks !== null;
      if (hasResult) {
        enteredCount++;
        if (row.categoryId) {
          awardedCount++;
        } else {
          notAwardedCount++;
        }
      }

      return {
        id: row.resultId ?? undefined,
        studentDbId: row.studentDbId,
        studentId: row.studentId,
        name: row.name,
        class: row.class,
        roll: row.roll,
        institutionId: row.institutionId,
        institutionName: row.institutionName,
        scholarshipId: row.scholarshipId,
        scholarshipName: row.scholarshipName,
        marks: row.marks,
        categoryId: row.categoryId,
        categoryName: row.categoryName ?? null,
        status: hasResult
          ? row.categoryId
            ? ("awarded" as const)
            : ("not-awarded" as const)
          : ("pending" as const),
        updatedAt: row.updatedAt?.toISOString() ?? null,
      };
    });

    return NextResponse.json({
      students: formattedStudents,
      categories: activeCategories,
      stats: {
        totalStudents: formattedStudents.length,
        enteredCount,
        pendingCount: formattedStudents.length - enteredCount,
        awardedCount,
        notAwardedCount,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/results error:", error);
    return NextResponse.json(
      { message: "Failed to fetch student results." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (
      !session?.user ||
      !["admin", "superadmin"].includes(session.user.role ?? "")
    ) {
      return NextResponse.json(
        { message: "You are not authorized to manage results." },
        { status: 403 },
      );
    }

    const body = await request.json();

    // Support both single entry and bulk entries
    let entries: { studentId: number; marks: number }[] = [];
    let scholarshipId = Number(body.scholarshipId);

    if (Array.isArray(body.entries)) {
      entries = body.entries.map((e: { studentId: unknown; marks: unknown }) => ({
        studentId: Number(e.studentId),
        marks: Math.round(Number(e.marks)),
      }));
    } else if (body.studentId !== undefined && body.marks !== undefined) {
      entries = [
        {
          studentId: Number(body.studentId),
          marks: Math.round(Number(body.marks)),
        },
      ];
    } else {
      return NextResponse.json(
        { message: "Invalid payload. Provide studentId and marks." },
        { status: 400 },
      );
    }

    if (!Number.isInteger(scholarshipId) || scholarshipId <= 0) {
      return NextResponse.json(
        { message: "Valid scholarshipId is required." },
        { status: 400 },
      );
    }

    // Filter valid entries
    const validEntries = entries.filter(
      (e) =>
        Number.isInteger(e.studentId) &&
        e.studentId > 0 &&
        !Number.isNaN(e.marks) &&
        e.marks >= 0,
    );

    if (validEntries.length === 0) {
      return NextResponse.json(
        { message: "No valid student result entries provided." },
        { status: 400 },
      );
    }

    // Fetch active categories with marks limits
    const activeCategories = await db
      .select({
        id: scholarshipCategories.id,
        name: scholarshipCategories.name,
        minMarks: scholarshipCategories.minMarks,
        maxMarks: scholarshipCategories.maxMarks,
      })
      .from(scholarshipCategories)
      .where(eq(scholarshipCategories.isActive, true))
      .orderBy(desc(scholarshipCategories.minMarks));

    const processedResults = [];

    for (const entry of validEntries) {
      const matchedCat = findMatchingCategory(entry.marks, activeCategories);
      const isAwarded = matchedCat !== null;
      const status = isAwarded ? "awarded" : "not-awarded";
      const categoryId = matchedCat ? matchedCat.id : null;

      // 1. Upsert into results table
      const [existingResult] = await db
        .select()
        .from(results)
        .where(
          and(
            eq(results.studentId, entry.studentId),
            eq(results.scholarshipId, scholarshipId),
          ),
        )
        .limit(1);

      let savedResult;
      if (existingResult) {
        [savedResult] = await db
          .update(results)
          .set({
            marks: entry.marks,
            categoryId,
            status,
            updatedAt: new Date(),
          })
          .where(eq(results.id, existingResult.id))
          .returning();
      } else {
        [savedResult] = await db
          .insert(results)
          .values({
            studentId: entry.studentId,
            scholarshipId,
            marks: entry.marks,
            categoryId,
            status,
          })
          .returning();
      }

      // 2. Automate scholarshipGrants management
      if (isAwarded && categoryId) {
        // Upsert grant for awarded students
        const [existingGrant] = await db
          .select()
          .from(scholarshipGrants)
          .where(
            and(
              eq(scholarshipGrants.studentId, entry.studentId),
              eq(scholarshipGrants.scholarshipId, scholarshipId),
            ),
          )
          .limit(1);

        if (existingGrant) {
          await db
            .update(scholarshipGrants)
            .set({
              categoryId,
              status: "granted",
              updatedAt: new Date(),
            })
            .where(eq(scholarshipGrants.id, existingGrant.id));
        } else {
          await db.insert(scholarshipGrants).values({
            studentId: entry.studentId,
            scholarshipId,
            categoryId,
            status: "granted",
            prizeStatus: "pending",
          });
        }
      } else {
        // If not awarded, remove any previous grant
        await db
          .delete(scholarshipGrants)
          .where(
            and(
              eq(scholarshipGrants.studentId, entry.studentId),
              eq(scholarshipGrants.scholarshipId, scholarshipId),
            ),
          );
      }

      processedResults.push({
        ...savedResult,
        categoryName: matchedCat ? matchedCat.name : null,
      });
    }

    // Log Activity
    await db.insert(activityLogs).values({
      userId: Number(session.user.id),
      action: "UPDATE",
      module: "RESULT_MANAGEMENT",
      description: `Saved results for ${processedResults.length} student(s) in scholarship #${scholarshipId}`,
      newData: {
        count: processedResults.length,
        scholarshipId,
      },
    });

    return NextResponse.json({
      message: `Successfully saved ${processedResults.length} result(s).`,
      results: processedResults,
    });
  } catch (error) {
    console.error("POST /api/admin/results error:", error);
    return NextResponse.json(
      { message: "Failed to save student results." },
      { status: 500 },
    );
  }
}
