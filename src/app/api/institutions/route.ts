import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { institutions, activityLogs } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

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

    const institution = await db.transaction(async (tx) => {
      const [createdInstitution] = await tx
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

      await tx.insert(activityLogs).values({
        userId: null,
        action: "CREATE",
        module: "INSTITUTION",
        recordId: createdInstitution.id,
        description: `Institution ${createdInstitution.name} (EIIN: ${createdInstitution.eiin}) created successfully.`,
        previousData: null,
        newData: {
          name: createdInstitution.name,
          eiin: createdInstitution.eiin,
          principal: createdInstitution.principal,
          principalPhone: createdInstitution.principalPhone,
          representative: createdInstitution.representative,
          representativePhone: createdInstitution.representativePhone,
          division: createdInstitution.division,
          district: createdInstitution.district,
          upazila: createdInstitution.upazila,
          village: createdInstitution.village,
          block: createdInstitution.block,
          address: createdInstitution.address,
        },
      });

      return createdInstitution;
    });

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
      .orderBy(asc(institutions.name));

    return NextResponse.json(allInstitutions);
  } catch (error) {
    console.error("Failed to fetch institutions:", error);

    return NextResponse.json(
      { message: "Failed to fetch institutions." },
      { status: 500 },
    );
  }
}
