import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { institutions } from "@/lib/db/schema";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const institutionId = Number(id);

    if (!Number.isInteger(institutionId) || institutionId < 1) {
      return NextResponse.json(
        { message: "Invalid institution ID." },
        { status: 400 },
      );
    }

    const [institution] = await db
      .select()
      .from(institutions)
      .where(eq(institutions.id, institutionId));

    if (!institution) {
      return NextResponse.json(
        { message: "Institution not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(institution);
  } catch (error) {
    console.error("Failed to fetch institution:", error);

    return NextResponse.json(
      { message: "Failed to fetch institution." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const institutionId = Number(id);

    if (!Number.isInteger(institutionId) || institutionId < 1) {
      return NextResponse.json(
        { message: "Invalid institution ID." },
        { status: 400 },
      );
    }

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

    const updates: Record<string, string | null> = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return NextResponse.json(
          { message: "Name must be a non-empty string." },
          { status: 400 },
        );
      }
      updates.name = name.trim();
    }

    if (eiin !== undefined) {
      if (typeof eiin !== "string" || !eiin.trim()) {
        return NextResponse.json(
          { message: "EIIN must be a non-empty string." },
          { status: 400 },
        );
      }
      updates.eiin = eiin.trim();
    }

    if (principal !== undefined) {
      updates.principal = typeof principal === "string" ? principal.trim() : null;
    }

    if (principalPhone !== undefined) {
      updates.principalPhone =
        typeof principalPhone === "string" ? principalPhone.trim() : null;
    }

    if (representative !== undefined) {
      updates.representative =
        typeof representative === "string" ? representative.trim() : null;
    }

    if (representativePhone !== undefined) {
      updates.representativePhone =
        typeof representativePhone === "string"
          ? representativePhone.trim()
          : null;
    }

    if (division !== undefined) {
      updates.division = typeof division === "string" ? division.trim() : null;
    }

    if (district !== undefined) {
      updates.district = typeof district === "string" ? district.trim() : null;
    }

    if (upazila !== undefined) {
      updates.upazila = typeof upazila === "string" ? upazila.trim() : null;
    }

    if (village !== undefined) {
      updates.village = typeof village === "string" ? village.trim() : null;
    }

    if (block !== undefined) {
      updates.block = typeof block === "string" ? block.trim() : null;
    }

    if (address !== undefined) {
      updates.address = typeof address === "string" ? address.trim() : null;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { message: "No fields provided to update." },
        { status: 400 },
      );
    }

    const [updatedInstitution] = await db
      .update(institutions)
      .set(updates)
      .where(eq(institutions.id, institutionId))
      .returning();

    if (!updatedInstitution) {
      return NextResponse.json(
        { message: "Institution not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedInstitution);
  } catch (error) {
    console.error("Failed to update institution:", error);

    return NextResponse.json(
      { message: "Failed to update institution." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const institutionId = Number(id);

    if (!Number.isInteger(institutionId) || institutionId < 1) {
      return NextResponse.json(
        { message: "Invalid institution ID." },
        { status: 400 },
      );
    }

    const [deletedInstitution] = await db
      .delete(institutions)
      .where(eq(institutions.id, institutionId))
      .returning();

    if (!deletedInstitution) {
      return NextResponse.json(
        { message: "Institution not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Institution deleted successfully.",
      institution: deletedInstitution,
    });
  } catch (error) {
    console.error("Failed to delete institution:", error);

    return NextResponse.json(
      { message: "Failed to delete institution." },
      { status: 500 },
    );
  }
}
