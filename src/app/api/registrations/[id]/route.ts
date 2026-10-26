import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { scholarshipRegistrations } from "@/lib/db/schema";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const registrationId = Number(id);

    if (!Number.isInteger(registrationId) || registrationId <= 0) {
      return NextResponse.json(
        { error: "Invalid registration ID." },
        { status: 400 },
      );
    }

    const [deletedRegistration] = await db
      .delete(scholarshipRegistrations)
      .where(eq(scholarshipRegistrations.id, registrationId))
      .returning({ id: scholarshipRegistrations.id });

    if (!deletedRegistration) {
      return NextResponse.json(
        { error: "Registration not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Registration deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete registration:", error);

    return NextResponse.json(
      { error: "Failed to delete registration." },
      { status: 500 },
    );
  }
}
