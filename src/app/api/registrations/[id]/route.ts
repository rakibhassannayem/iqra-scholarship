import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  activityLogs,
  paymentSubmissionItems,
  scholarshipRegistrations,
  students,
} from "@/lib/db/schema";
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

    const allowedStatuses = ["Pending", "Cancelled"];

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
    // Admin authentication
    const session = await auth();

    if (
      !session?.user ||
      !["admin", "superadmin"].includes(session.user.role ?? "")
    ) {
      return NextResponse.json(
        { message: "You are not authorized to delete registrations." },
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

    const result = await db.transaction(async (tx) => {
      // Find and lock the registration
      const [registration] = await tx
        .select()
        .from(scholarshipRegistrations)
        .where(eq(scholarshipRegistrations.id, registrationId))
        .for("update")
        .limit(1);

      if (!registration) {
        throw new Error("REGISTRATION_NOT_FOUND");
      }

      // Check payment history
      const [paymentItem] = await tx
        .select({ id: paymentSubmissionItems.id })
        .from(paymentSubmissionItems)
        .where(eq(paymentSubmissionItems.registrationId, registrationId))
        .limit(1);

      if (paymentItem) {
        throw new Error("REGISTRATION_HAS_PAYMENT_HISTORY");
      }

      // Record deletion activity
      await tx.insert(activityLogs).values({
        userId: Number(session.user.id),
        action: "DELETE",
        module: "REGISTRATION",
        recordId: registration.id,
        description: `Registration #${registration.id} deleted.`,
        previousData: {
          studentId: registration.studentId,
          scholarshipId: registration.scholarshipId,
          registrationFee: registration.registrationFee,
          status: registration.status,
          paymentStatus: registration.paymentStatus,
        },
        newData: null,
      });

      // Delete the selected registration
      await tx
        .delete(scholarshipRegistrations)
        .where(eq(scholarshipRegistrations.id, registrationId));

      // Lock the associated student
      const [student] = await tx
        .select({ id: students.id })
        .from(students)
        .where(eq(students.id, registration.studentId))
        .for("update")
        .limit(1);

      if (!student) {
        throw new Error("STUDENT_NOT_FOUND");
      }

      // Check whether this student has other registrations
      const [remainingRegistration] = await tx
        .select({ id: scholarshipRegistrations.id })
        .from(scholarshipRegistrations)
        .where(eq(scholarshipRegistrations.studentId, registration.studentId))
        .limit(1);

      let studentDeleted = false;

      // Delete student only if no other registration exists
      if (!remainingRegistration) {
        await tx
          .delete(students)
          .where(eq(students.id, registration.studentId));

        studentDeleted = true;
      }

      return { studentDeleted };
    });

    return NextResponse.json({
      message: result.studentDeleted
        ? "Registration and associated student deleted successfully."
        : "Registration deleted successfully. Student record was preserved because other registrations exist.",
      studentDeleted: result.studentDeleted,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "REGISTRATION_NOT_FOUND") {
      return NextResponse.json(
        { message: "Registration not found." },
        { status: 404 },
      );
    }

    if (error instanceof Error && error.message === "STUDENT_NOT_FOUND") {
      return NextResponse.json(
        { message: "Associated student record not found." },
        { status: 404 },
      );
    }

    if (
      error instanceof Error &&
      error.message === "REGISTRATION_HAS_PAYMENT_HISTORY"
    ) {
      return NextResponse.json(
        {
          message:
            "This registration cannot be deleted because it has payment history.",
        },
        { status: 409 },
      );
    }

    console.error("Failed to delete registration:", error);

    return NextResponse.json(
      { message: "Failed to delete registration." },
      { status: 500 },
    );
  }
}
