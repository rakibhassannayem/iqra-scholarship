import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { activityLogs, institutions } from "@/lib/db/schema";

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
      updates.principal =
        typeof principal === "string" ? principal.trim() : null;
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

    const updatedInstitution = await db.transaction(async (tx) => {
      const [existingInstitution] = await tx
        .select()
        .from(institutions)
        .where(eq(institutions.id, institutionId))
        .limit(1);

      if (!existingInstitution) {
        return null;
      }

      const [updated] = await tx
        .update(institutions)
        .set(updates)
        .where(eq(institutions.id, institutionId))
        .returning();

      await tx.insert(activityLogs).values({
        userId: null,
        action: "UPDATE",
        module: "INSTITUTION",
        recordId: updated.id,
        description: `Institution ${updated.name} (EIIN: ${updated.eiin}) updated successfully.`,
        previousData: {
          name: existingInstitution.name,
          eiin: existingInstitution.eiin,
          principal: existingInstitution.principal,
          principalPhone: existingInstitution.principalPhone,
          representative: existingInstitution.representative,
          representativePhone: existingInstitution.representativePhone,
          division: existingInstitution.division,
          district: existingInstitution.district,
          upazila: existingInstitution.upazila,
          village: existingInstitution.village,
          block: existingInstitution.block,
          address: existingInstitution.address,
        },
        newData: {
          name: updated.name,
          eiin: updated.eiin,
          principal: updated.principal,
          principalPhone: updated.principalPhone,
          representative: updated.representative,
          representativePhone: updated.representativePhone,
          division: updated.division,
          district: updated.district,
          upazila: updated.upazila,
          village: updated.village,
          block: updated.block,
          address: updated.address,
        },
      });

      return updated;
    });

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

    const deletedInstitution = await db.transaction(async (tx) => {
      const [deleted] = await tx
        .delete(institutions)
        .where(eq(institutions.id, institutionId))
        .returning();

      if (!deleted) {
        return null;
      }

      await tx.insert(activityLogs).values({
        userId: null,
        action: "DELETE",
        module: "INSTITUTION",
        recordId: deleted.id,
        description: `Institution ${deleted.name} (EIIN: ${deleted.eiin}) deleted successfully.`,
        previousData: {
          name: deleted.name,
          eiin: deleted.eiin,
          principal: deleted.principal,
          principalPhone: deleted.principalPhone,
          representative: deleted.representative,
          representativePhone: deleted.representativePhone,
          division: deleted.division,
          district: deleted.district,
          upazila: deleted.upazila,
          village: deleted.village,
          block: deleted.block,
          address: deleted.address,
        },
        newData: null,
      });

      return deleted;
    });

    if (!deletedInstitution) {
      return NextResponse.json(
        { message: "Institution not found." },
        { status: 404 },
      );
    }
  } catch (error) {
    console.error("Failed to delete institution:", error);

    return NextResponse.json(
      { message: "Failed to delete institution." },
      { status: 500 },
    );
  }
}
