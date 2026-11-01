import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "../../../../../auth";
import { db } from "@/lib/db";
import { scholarshipGrants, activityLogs } from "@/lib/db/schema";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth();

    if (
      !session?.user ||
      !["admin", "superadmin"].includes(session.user.role ?? "")
    ) {
      return NextResponse.json(
        { message: "You are not authorized to update prize status." },
        { status: 403 },
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
    const { prizeStatus, confirmedBy, prizeNotes, prizeReceivedAt } = body;

    if (!["pending", "received"].includes(prizeStatus)) {
      return NextResponse.json(
        { message: "prizeStatus must be either 'pending' or 'received'." },
        { status: 400 },
      );
    }

    const [existingGrant] = await db
      .select()
      .from(scholarshipGrants)
      .where(eq(scholarshipGrants.id, grantId))
      .limit(1);

    if (!existingGrant) {
      return NextResponse.json(
        { message: "Scholarship grant record not found." },
        { status: 404 },
      );
    }

    const isReceived = prizeStatus === "received";

    // If marked received, record timestamp and confirming staff member
    const receivedTimestamp = isReceived
      ? prizeReceivedAt
        ? new Date(prizeReceivedAt)
        : new Date()
      : null;

    const staffName = isReceived
      ? typeof confirmedBy === "string" && confirmedBy.trim()
        ? confirmedBy.trim()
        : session.user.name || session.user.email || "Staff Member"
      : null;

    const notes = typeof prizeNotes === "string" ? prizeNotes.trim() : null;

    const [updatedGrant] = await db
      .update(scholarshipGrants)
      .set({
        prizeStatus,
        prizeReceivedAt: receivedTimestamp,
        confirmedBy: staffName,
        prizeNotes: notes,
        updatedAt: new Date(),
      })
      .where(eq(scholarshipGrants.id, grantId))
      .returning();

    // Activity Log
    await db.insert(activityLogs).values({
      userId: Number(session.user.id),
      action: "UPDATE",
      module: "PRIZE",
      recordId: updatedGrant.id,
      description:
        updatedGrant.prizeStatus === "received"
          ? `Prize receipt confirmed for student grant ID: ${updatedGrant.id}`
          : `Prize status reverted to pending for grant ID: ${updatedGrant.id}`,
      previousData: existingGrant,
      newData: updatedGrant,
    });

    return NextResponse.json({
      message: isReceived
        ? "Prize receipt confirmed successfully."
        : "Prize status reverted to pending.",
      grant: updatedGrant,
    });
  } catch (error) {
    console.error("PATCH /api/prizes/[id] error:", error);

    return NextResponse.json(
      { message: "Failed to update prize confirmation status." },
      { status: 500 },
    );
  }
}
