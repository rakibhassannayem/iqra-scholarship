import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { activityLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "../../../../../auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// DELETE: Delete an activity log (Superadmin only)
export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    // Check authentication and authorization
    const session = await auth();

    if (!session?.user || session.user.role !== "superadmin") {
      return NextResponse.json(
        { message: "Only superadmin can delete activity logs." },
        { status: 403 },
      );
    }

    // Validate activity log ID
    const { id } = await params;
    const logId = Number(id);

    if (!Number.isInteger(logId) || logId < 1) {
      return NextResponse.json(
        { message: "Invalid activity log ID." },
        { status: 400 },
      );
    }

    // Delete activity log
    const [deletedLog] = await db
      .delete(activityLogs)
      .where(eq(activityLogs.id, logId))
      .returning();

    if (!deletedLog) {
      return NextResponse.json(
        { message: "Activity log not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Activity log deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete activity log:", error);

    return NextResponse.json(
      { message: "Failed to delete activity log." },
      { status: 500 },
    );
  }
}
