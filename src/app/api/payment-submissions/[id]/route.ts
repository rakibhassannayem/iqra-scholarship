import { auth } from "../../../../../auth";
import { db } from "@/lib/db";
import {
  activityLogs,
  paymentSubmissionItems,
  paymentSubmissions,
  scholarshipRegistrations,
} from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Only admin and superadmin can review payments.
    const session = await auth();

    if (
      !session?.user ||
      !["admin", "superadmin"].includes(session.user.role)
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const paymentId = Number(id);

    if (!Number.isInteger(paymentId) || paymentId <= 0) {
      return NextResponse.json(
        { message: "Invalid payment ID" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { status, adminNote } = body;

    if (!["Approved", "Rejected"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid payment status" },
        { status: 400 },
      );
    }

    if (
      adminNote !== undefined &&
      (typeof adminNote !== "string" || adminNote.length > 1000)
    ) {
      return NextResponse.json(
        { message: "Admin note must be within 1000 characters" },
        { status: 400 },
      );
    }

    const result = await db.transaction(async (tx) => {
      // Lock payment submission.
      const [payment] = await tx
        .select()
        .from(paymentSubmissions)
        .where(eq(paymentSubmissions.id, paymentId))
        .for("update");

      if (!payment) {
        throw new Error("PAYMENT_NOT_FOUND");
      }

      if (payment.status === status) {
        throw new Error("PAYMENT_STATUS_UNCHANGED");
      }

      // Get linked registrations.
      const items = await tx
        .select({
          registrationId: paymentSubmissionItems.registrationId,
        })
        .from(paymentSubmissionItems)
        .where(eq(paymentSubmissionItems.paymentSubmissionId, paymentId));

      if (items.length === 0) {
        throw new Error("NO_PAYMENT_ITEMS");
      }

      const registrationIds = items.map((item) => item.registrationId);

      // Lock registrations.
      const registrations = await tx
        .select({
          id: scholarshipRegistrations.id,
          paymentStatus: scholarshipRegistrations.paymentStatus,
        })
        .from(scholarshipRegistrations)
        .where(inArray(scholarshipRegistrations.id, registrationIds))
        .for("update");

      const expectedPaymentStatus = {
        Pending: "Pending",
        Approved: "Paid",
        Rejected: "Unpaid",
      }[payment.status];

      if (
        registrations.length !== registrationIds.length ||
        registrations.some(
          (registration) =>
            registration.paymentStatus !== expectedPaymentStatus,
        )
      ) {
        throw new Error("REGISTRATION_PAYMENT_CONFLICT");
      }

      // Approve or reject linked registrations.
      if (status === "Approved") {
        await tx
          .update(scholarshipRegistrations)
          .set({
            paymentStatus: "Paid",
            status: "Approved",
          })
          .where(inArray(scholarshipRegistrations.id, registrationIds));
      } else {
        await tx
          .update(scholarshipRegistrations)
          .set({
            paymentStatus: "Unpaid",
            status: "Pending",
          })
          .where(inArray(scholarshipRegistrations.id, registrationIds));
      }

      // Update payment submission.
      const [updatedPayment] = await tx
        .update(paymentSubmissions)
        .set({
          status,
          adminNote: adminNote?.trim() || null,
          reviewedAt: new Date(),
        })
        .where(eq(paymentSubmissions.id, paymentId))
        .returning();

      // Activity log.
      await tx.insert(activityLogs).values({
        userId: Number(session.user.id),
        action: status,
        module: "Payment",
        recordId: paymentId,
        description: `Payment submission ${status.toLowerCase()}.`,
        previousData: payment,
        newData: updatedPayment,
      });

      return updatedPayment;
    });

    return NextResponse.json({
      message: `Payment ${status.toLowerCase()} successfully.`,
      payment: result,
    });
  } catch (error) {
    console.error("Payment review error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "UNKNOWN_ERROR";

    const errors: Record<string, { message: string; status: number }> = {
      PAYMENT_NOT_FOUND: {
        message: "Payment submission not found.",
        status: 404,
      },
      PAYMENT_STATUS_UNCHANGED: {
        message: `Payment is already ${status.toLowerCase()}.`,
        status: 409,
      },
      NO_PAYMENT_ITEMS: {
        message: "No registrations found in this payment.",
        status: 400,
      },
      REGISTRATION_PAYMENT_CONFLICT: {
        message: "One or more registrations have an invalid payment status.",
        status: 409,
      },
    };

    const knownError = errors[errorMessage];

    if (knownError) {
      return NextResponse.json(
        { message: knownError.message },
        { status: knownError.status },
      );
    }

    return NextResponse.json(
      { message: "Unable to review payment submission." },
      { status: 500 },
    );
  }
}
