import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { institutions } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      eiin,
      principal,
      principalPhone,
      representative,
      representativePhone,
      division,
      district,
      upazila,
      village,
      block,
      address,
    } = body;

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
        principal: typeof principal === "string" ? principal.trim() : null,
        principalPhone:
          typeof principalPhone === "string" ? principalPhone.trim() : null,
        representative:
          typeof representative === "string" ? representative.trim() : null,
        representativePhone:
          typeof representativePhone === "string"
            ? representativePhone.trim()
            : null,
        division: typeof division === "string" ? division.trim() : null,
        district: typeof district === "string" ? district.trim() : null,
        upazila: typeof upazila === "string" ? upazila.trim() : null,
        village: typeof village === "string" ? village.trim() : null,
        block: typeof block === "string" ? block.trim() : null,
        address: typeof address === "string" ? address.trim() : null,
      })
      .returning();

    return NextResponse.json(institution, { status: 201 });
  } catch (error) {
    console.error("Failed to create institution:", error);

    return NextResponse.json(
      { message: "Failed to create institution. EIIN might already exist." },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const allInstitutions = await db
      .select()
      .from(institutions)
      .orderBy(desc(institutions.createdAt));

    return NextResponse.json(allInstitutions);
  } catch (error) {
    console.error("Failed to fetch institutions:", error);

    return NextResponse.json(
      { message: "Failed to fetch institutions." },
      { status: 500 },
    );
  }
}
