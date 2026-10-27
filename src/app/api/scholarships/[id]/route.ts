import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { scholarships } from "@/lib/db/schema";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// ID যাচাই করার helper
async function getScholarshipId(context: RouteContext) {
  const { id } = await context.params;
  const scholarshipId = Number(id);

  if (!Number.isInteger(scholarshipId) || scholarshipId <= 0) {
    return null;
  }

  return scholarshipId;
}

// GET: নির্দিষ্ট scholarship দেখা
export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const id = await getScholarshipId(context);

    if (id === null) {
      return NextResponse.json(
        { message: "Invalid scholarship ID" },
        { status: 400 },
      );
    }

    const [scholarship] = await db
      .select()
      .from(scholarships)
      .where(eq(scholarships.id, id))
      .limit(1);

    if (!scholarship) {
      return NextResponse.json(
        { message: "Scholarship not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(scholarship);
  } catch (error) {
    console.error("GET scholarship error:", error);

    return NextResponse.json(
      { message: "Failed to fetch scholarship" },
      { status: 500 },
    );
  }
}

// PATCH: নির্দিষ্ট scholarship update করা
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const id = await getScholarshipId(context);

    if (id === null) {
      return NextResponse.json(
        { message: "Invalid scholarship ID" },
        { status: 400 },
      );
    }

    const body = await request.json();

    const [existingScholarship] = await db
      .select()
      .from(scholarships)
      .where(eq(scholarships.id, id))
      .limit(1);

    if (!existingScholarship) {
      return NextResponse.json(
        { message: "Scholarship not found" },
        { status: 404 },
      );
    }

    const updates: Partial<typeof scholarships.$inferInsert> = {};

    if (body.name !== undefined) {
      if (typeof body.name !== "string" || !body.name.trim()) {
        return NextResponse.json(
          { message: "Name cannot be empty" },
          { status: 400 },
        );
      }
      updates.name = body.name.trim();
    }

    if (body.description !== undefined) {
      if (typeof body.description !== "string" || !body.description.trim()) {
        return NextResponse.json(
          { message: "Description cannot be empty" },
          { status: 400 },
        );
      }
      updates.description = body.description.trim();
    }

    if (body.academicYear !== undefined) {
      if (typeof body.academicYear !== "string" || !body.academicYear.trim()) {
        return NextResponse.json(
          { message: "Academic year cannot be empty" },
          { status: 400 },
        );
      }
      updates.academicYear = body.academicYear.trim();
    }

    if (body.endDate !== undefined) {
      const date = new Date(body.endDate);

      if (Number.isNaN(date.getTime())) {
        return NextResponse.json(
          { message: "Invalid end date" },
          { status: 400 },
        );
      }

      updates.endDate = date;
    }

    if (body.eligibility !== undefined) {
      if (typeof body.eligibility !== "string" || !body.eligibility.trim()) {
        return NextResponse.json(
          { message: "Eligibility cannot be empty" },
          { status: 400 },
        );
      }

      updates.eligibility = body.eligibility.trim();
    }

    if (body.isActive !== undefined) {
      if (typeof body.isActive !== "boolean") {
        return NextResponse.json(
          { message: "isActive must be true or false" },
          { status: 400 },
        );
      }

      updates.isActive = body.isActive;
    }

    // Exam info fields (optional, nullable)
    if (body.examCenter !== undefined) {
      updates.examCenter =
        typeof body.examCenter === "string" && body.examCenter.trim()
          ? body.examCenter.trim()
          : null;
    }

    if (body.examDate !== undefined) {
      updates.examDate =
        typeof body.examDate === "string" && body.examDate.trim()
          ? body.examDate.trim()
          : null;
    }

    if (body.examTime !== undefined) {
      updates.examTime =
        typeof body.examTime === "string" && body.examTime.trim()
          ? body.examTime.trim()
          : null;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { message: "No valid fields provided to update" },
        { status: 400 },
      );
    }

    updates.updatedAt = new Date();

    let updatedScholarship;

    if (updates.isActive === true) {
      updatedScholarship = await db.transaction(async (tx) => {
        // আগের active scholarship-গুলো inactive করা
        await tx
          .update(scholarships)
          .set({
            isActive: false,
            updatedAt: new Date(),
          })
          .where(eq(scholarships.isActive, true));

        // নির্বাচিত scholarship update করে active করা
        const [updated] = await tx
          .update(scholarships)
          .set(updates)
          .where(eq(scholarships.id, id))
          .returning();

        return updated;
      });
    } else {
      const [updated] = await db
        .update(scholarships)
        .set(updates)
        .where(eq(scholarships.id, id))
        .returning();

      updatedScholarship = updated;
    }

    return NextResponse.json({
      message: "Scholarship updated successfully",
      scholarship: updatedScholarship,
    });
  } catch (error) {
    console.error("PATCH scholarship error:", error);

    return NextResponse.json(
      { message: "Failed to update scholarship" },
      { status: 500 },
    );
  }
}

// DELETE: নির্দিষ্ট scholarship delete করা
export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const id = await getScholarshipId(context);

    if (id === null) {
      return NextResponse.json(
        { message: "Invalid scholarship ID" },
        { status: 400 },
      );
    }

    const [deletedScholarship] = await db
      .delete(scholarships)
      .where(eq(scholarships.id, id))
      .returning();

    if (!deletedScholarship) {
      return NextResponse.json(
        { message: "Scholarship not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Scholarship deleted successfully",
      scholarship: deletedScholarship,
    });
  } catch (error) {
    console.error("DELETE scholarship error:", error);

    const cause =
      typeof error === "object" && error !== null && "cause" in error
        ? error.cause
        : null;

    const errorCode =
      typeof cause === "object" && cause !== null && "code" in cause
        ? cause.code
        : typeof error === "object" && error !== null && "code" in error
          ? error.code
          : undefined;

    if (errorCode === "23503") {
      return NextResponse.json(
        {
          message:
            "This scholarship has registrations and cannot be deleted. Deactivate it instead.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { message: "Failed to delete scholarship." },
      { status: 500 },
    );
  }
}
