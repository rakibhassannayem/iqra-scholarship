import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { activityLogs, scholarships } from "@/lib/db/schema";
import { auth } from "../../../../auth";

// GET: সব scholarship দেখা
export async function GET() {
  try {
    const allScholarships = await db
      .select()
      .from(scholarships)
      .orderBy(desc(scholarships.createdAt));

    return NextResponse.json(allScholarships);
  } catch (error) {
    console.error("GET scholarships error:", error);

    return NextResponse.json(
      { message: "Failed to fetch scholarships" },
      { status: 500 },
    );
  }
}

// POST: নতুন scholarship তৈরি
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (
      !session?.user ||
      !["admin", "superadmin"].includes(session.user.role ?? "")
    ) {
      return NextResponse.json(
        { message: "You are not authorized to create scholarships." },
        { status: 403 },
      );
    }

    const body = await request.json();

    const {
      name,
      description,
      academicYear,
      endDate,
      eligibilityClass,
      registrationFee,
      examCenter,
      examDate,
      examTime,
      examStartTime,
      examEndTime,
    } = body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof description !== "string" ||
      !description.trim() ||
      typeof academicYear !== "string" ||
      !academicYear.trim() ||
      !endDate
    ) {
      return NextResponse.json(
        {
          message:
            "Please provide all required scholarship fields with valid values",
        },
        { status: 400 },
      );
    }

    // Eligibility class অবশ্যই 1 থেকে 10-এর মধ্যে integer হতে হবে
    if (
      !Number.isInteger(eligibilityClass) ||
      eligibilityClass < 1 ||
      eligibilityClass > 10
    ) {
      return NextResponse.json(
        { message: "Eligibility class must be between 1 and 10" },
        { status: 400 },
      );
    }

    // Registration fee অবশ্যই non-negative integer হতে হবে
    if (!Number.isInteger(registrationFee) || registrationFee < 0) {
      return NextResponse.json(
        { message: "Registration fee must be a non-negative integer" },
        { status: 400 },
      );
    }

    const parsedEndDate = new Date(endDate);

    if (Number.isNaN(parsedEndDate.getTime())) {
      return NextResponse.json(
        { message: "Please provide a valid registration end date" },
        { status: 400 },
      );
    }

    const [newScholarship] = await db
      .insert(scholarships)
      .values({
        name: name.trim(),
        description: description.trim(),
        academicYear: academicYear.trim(),
        endDate: parsedEndDate,
        eligibilityClass,
        registrationFee,
        isActive: false,
        examCenter:
          typeof examCenter === "string" && examCenter.trim()
            ? examCenter.trim()
            : null,
        examDate:
          typeof examDate === "string" && examDate.trim()
            ? examDate.trim()
            : null,
        examTime:
          typeof examTime === "string" && examTime.trim()
            ? examTime.trim()
            : null,
        examStartTime:
          typeof examStartTime === "string" && examStartTime.trim()
            ? examStartTime.trim()
            : null,
        examEndTime:
          typeof examEndTime === "string" && examEndTime.trim()
            ? examEndTime.trim()
            : null,
      })
      .returning();

    await db.insert(activityLogs).values({
      userId: Number(session.user.id),
      action: "CREATE",
      module: "SCHOLARSHIP",
      recordId: newScholarship.id,
      description: `Created scholarship: ${newScholarship.name}`,
      previousData: null,
      newData: newScholarship,
    });

    return NextResponse.json(
      {
        message: "Scholarship created successfully",
        scholarship: newScholarship,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST scholarship error:", error);

    return NextResponse.json(
      { message: "Failed to create scholarship" },
      { status: 500 },
    );
  }
}
