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
    const { name, eiin } = body;

    if (
      (name === undefined || (typeof name === "string" && name.trim())) &&
      (eiin === undefined || (typeof eiin === "string" && eiin.trim())) &&
      (name !== undefined || eiin !== undefined)
    ) {
      // At least one valid field is provided.
    } else {
      return NextResponse.json(
        { message: "Provide a valid name or EIIN to update." },
        { status: 400 },
      );
    }

    if (
      (name !== undefined && (typeof name !== "string" || !name.trim())) ||
      (eiin !== undefined && (typeof eiin !== "string" || !eiin.trim()))
    ) {
      return NextResponse.json(
        { message: "Name and EIIN must be non-empty strings." },
        { status: 400 },
      );
    }

    const updates: { name?: string; eiin?: string } = {};

    if (name !== undefined) updates.name = name.trim();
    if (eiin !== undefined) updates.eiin = eiin.trim();

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
