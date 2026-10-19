import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { scholarships } from "@/lib/db/schema";

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
    const body = await request.json();

    const {
      name,
      description,
      academicYear,
      startDate,
      endDate,
      amount,
      eligibility,
    } = body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof description !== "string" ||
      !description.trim() ||
      typeof academicYear !== "string" ||
      !academicYear.trim() ||
      !startDate ||
      !endDate ||
      amount === undefined ||
      !Number.isInteger(Number(amount)) ||
      Number(amount) <= 0 ||
      typeof eligibility !== "string" ||
      !eligibility.trim()
    ) {
      return NextResponse.json(
        {
          message:
            "Please provide all required scholarship fields with valid values",
        },
        { status: 400 },
      );
    }

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (
      Number.isNaN(parsedStartDate.getTime()) ||
      Number.isNaN(parsedEndDate.getTime()) ||
      parsedEndDate <= parsedStartDate
    ) {
      return NextResponse.json(
        { message: "End date must be later than start date" },
        { status: 400 },
      );
    }

    const [newScholarship] = await db
      .insert(scholarships)
      .values({
        name: name.trim(),
        description: description.trim(),
        academicYear: academicYear.trim(),
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        amount: Number(amount),
        eligibility: eligibility.trim(),
        isActive: false,
      })
      .returning();

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
