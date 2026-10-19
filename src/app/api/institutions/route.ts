import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { institutions } from "@/lib/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, eiin } = body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof eiin !== "string" ||
      !eiin.trim()
    ) {
      return NextResponse.json(
        { message: "Institution name and EIIN are required." },
        { status: 400 },
      );
    }

    const [institution] = await db
      .insert(institutions)
      .values({
        name: name.trim(),
        eiin: eiin.trim(),
      })
      .returning();

    return NextResponse.json(institution, { status: 201 });
  } catch (error) {
    console.error("Failed to create institution:", error);

    return NextResponse.json(
      { message: "Failed to create institution." },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const allInstitutions = await db.select().from(institutions);

    return NextResponse.json(allInstitutions);
  } catch (error) {
    console.error("Failed to fetch institutions:", error);

    return NextResponse.json(
      { message: "Failed to fetch institutions." },
      { status: 500 },
    );
  }
}
