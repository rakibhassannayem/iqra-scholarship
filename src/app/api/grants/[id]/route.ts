import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "../../../../../auth";
import { db } from "@/lib/db";
import { scholarshipGrants, scholarshipCategories } from "@/lib/db/schema";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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
    const updates: Partial<typeof scholarshipGrants.$inferInsert> = {};

    if (body.categoryId !== undefined) {
      const categoryId = Number(body.categoryId);
      if (!Number.isInteger(categoryId) || categoryId <= 0) {
        return NextResponse.json(
          { message: "Invalid category ID." },
          { status: 400 },
        );
      }

      const [category] = await db
        .select({ id: scholarshipCategories.id })
        .from(scholarshipCategories)
        .where(eq(scholarshipCategories.id, categoryId))
        .limit(1);

      if (!category) {
        return NextResponse.json(
          { message: "Scholarship category not found." },
          { status: 400 },
        );
      }

      updates.categoryId = categoryId;
    }

    if (body.status !== undefined) {
      if (typeof body.status !== "string" || !body.status.trim()) {
        return NextResponse.json(
          { message: "Status cannot be empty." },
          { status: 400 },
        );
      }
      updates.status = body.status.trim();
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { message: "No valid fields provided to update." },
        { status: 400 },
      );
    }

    updates.updatedAt = new Date();

    const [updatedGrant] = await db
      .update(scholarshipGrants)
      .set(updates)
      .where(eq(scholarshipGrants.id, grantId))
      .returning();

    if (!updatedGrant) {
      return NextResponse.json(
        { message: "Grant not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Scholarship grant updated successfully.",
      grant: updatedGrant,
    });
  } catch (error) {
    console.error("PATCH grant error:", error);

    return NextResponse.json(
      { message: "Failed to update grant." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const grantId = Number(id);

    if (!Number.isInteger(grantId) || grantId <= 0) {
      return NextResponse.json(
        { message: "Invalid grant ID." },
        { status: 400 },
      );
    }

    const [deletedGrant] = await db
      .delete(scholarshipGrants)
      .where(eq(scholarshipGrants.id, grantId))
      .returning();

    if (!deletedGrant) {
      return NextResponse.json(
        { message: "Grant not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Scholarship grant deleted successfully.",
      grant: deletedGrant,
    });
  } catch (error) {
    console.error("DELETE grant error:", error);

    return NextResponse.json(
      { message: "Failed to delete scholarship grant." },
      { status: 500 },
    );
  }
}
