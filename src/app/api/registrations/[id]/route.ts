import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { activityLogs, scholarshipRegistrations } from "@/lib/db/schema";
import { auth } from "../../../../../auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const session = await auth();

    if (
      !session?.user ||
      !["admin", "superadmin"].includes(session.user.role ?? "")
    ) {
      return NextResponse.json(
        { message: "You are not authorized to update registrations." },
        { status: 403 },
      );
    }

    const { id } = await params;
    const registrationId = Number(id);

    if (!Number.isInteger(registrationId) || registrationId <= 0) {
      return NextResponse.json(
        { message: "Invalid registration ID." },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { status } = body;

    const allowedStatuses = ["Pending", "Approved", "Cancelled"];

    if (typeof status !== "string" || !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { message: "Invalid registration status." },
        { status: 400 },
      );
    }

    const updatedRegistration = await db.transaction(async (tx) => {
      const [existingRegistration] = await tx
        .select()
        .from(scholarshipRegistrations)
        .where(eq(scholarshipRegistrations.id, registrationId))
        .limit(1);

      if (!existingRegistration) {
        throw new Error("REGISTRATION_NOT_FOUND");
      }

      if (existingRegistration.status === status) {
        throw new Error("STATUS_UNCHANGED");
      }

      const [updated] = await tx
        .update(scholarshipRegistrations)
        .set({ status })
        .where(eq(scholarshipRegistrations.id, registrationId))
        .returning();

      await tx.insert(activityLogs).values({
        userId: Number(session.user.id),
        action: "UPDATE",
        module: "REGISTRATION",
        recordId: updated.id,
        description: `Registration #${updated.id} status changed from ${existingRegistration.status} to ${updated.status}.`,
        previousData: {
          status: existingRegistration.status,
        },
        newData: {
          status: updated.status,
        },
      });

      return updated;
    });

    return NextResponse.json({
      message: `Registration ${status.toLowerCase()} successfully.`,
      registration: updatedRegistration,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "REGISTRATION_NOT_FOUND") {
      return NextResponse.json(
        { message: "Registration not found." },
        { status: 404 },
      );
    }

    if (error instanceof Error && error.message === "STATUS_UNCHANGED") {
      return NextResponse.json(
        { message: "Registration already has this status." },
        { status: 400 },
      );
    }

    console.error("Failed to update registration:", error);

    return NextResponse.json(
      { message: "Failed to update registration status." },
      { status: 500 },
    );
  }
}

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
      .returning();

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
