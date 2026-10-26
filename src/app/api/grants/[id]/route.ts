
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "../../../../../auth";
import { db } from "@/lib/db";
import { scholarshipGrants } from "@/lib/db/schema";

const allowedStatuses = ["granted", "revoked"] as const;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const grantId = Number(id);

    if (!Number.isInteger(grantId) || grantId <= 0) {
      return NextResponse.json(
        { message: "Invalid grant ID." },
        { status: 400 },
      );
    }

    const body = await request.json();

    if (
      typeof body.status !== "string" ||
      !allowedStatuses.includes(
        body.status as (typeof allowedStatuses)[number],
      )
    ) {
      return NextResponse.json(
        { message: "Status must be granted or revoked." },
        { status: 400 },
      );
    }

    const [updatedGrant] = await db
      .update(scholarshipGrants)
      .set({
        status: body.status,
        updatedAt: new Date(),
      })
      .where(eq(scholarshipGrants.id, grantId))
      .returning();

    if (!updatedGrant) {
      return NextResponse.json(
        { message: "Grant not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Grant status updated successfully.",
      grant: updatedGrant,
    });
  } catch (error) {
    console.error("PATCH grant error:", error);

    return NextResponse.json(
      { message: "Failed to update grant status." },
      { status: 500 },
    );
  }
}
