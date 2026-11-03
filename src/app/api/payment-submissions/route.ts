import { NextRequest, NextResponse } from "next/server";
import { and, eq, inArray, desc } from "drizzle-orm";
import { randomUUID } from "crypto";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";

import { db } from "@/lib/db";
import {
  students,
  institutions,
  scholarships,
  scholarshipRegistrations,
  paymentSubmissions,
  paymentSubmissionItems,
} from "@/lib/db/schema";

import { auth } from "../../../../auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedMimeTypes: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export async function GET() {
  try {
    // Admin authorization
    const session = await auth();

    if (
      !session?.user ||
      !["admin", "superadmin"].includes(session.user.role ?? "")
    ) {
      return NextResponse.json(
        { message: "You are not authorized to view payments." },
        { status: 403 },
      );
    }

    // Fetch all payment submissions
    const submissions = await db
      .select({
        id: paymentSubmissions.id,
        institutionId: paymentSubmissions.institutionId,
        institutionName: institutions.name,
        scholarshipId: paymentSubmissions.scholarshipId,
        scholarshipName: scholarships.name,
        totalAmount: paymentSubmissions.totalAmount,
        paymentMethod: paymentSubmissions.paymentMethod,
        transactionId: paymentSubmissions.transactionId,
        screenshotUrl: paymentSubmissions.screenshotUrl,
        status: paymentSubmissions.status,
        adminNote: paymentSubmissions.adminNote,
        reviewedAt: paymentSubmissions.reviewedAt,
        submittedAt: paymentSubmissions.submittedAt,
      })
      .from(paymentSubmissions)
      .innerJoin(
        institutions,
        eq(paymentSubmissions.institutionId, institutions.id),
      )
      .innerJoin(
        scholarships,
        eq(paymentSubmissions.scholarshipId, scholarships.id),
      )
      .orderBy(desc(paymentSubmissions.submittedAt));

    // Fetch students included in each submission
    const items = await db
      .select({
        paymentSubmissionId: paymentSubmissionItems.paymentSubmissionId,
        registrationId: scholarshipRegistrations.id,
        studentId: students.studentId,
        studentName: students.name,
        studentClass: students.class,
        studentRoll: students.roll,
        amount: paymentSubmissionItems.amount,
      })
      .from(paymentSubmissionItems)
      .innerJoin(
        scholarshipRegistrations,
        eq(paymentSubmissionItems.registrationId, scholarshipRegistrations.id),
      )
      .innerJoin(students, eq(scholarshipRegistrations.studentId, students.id));

    // Attach students to their respective submissions
    const payments = submissions.map((submission) => ({
      ...submission,
      students: items.filter(
        (item) => item.paymentSubmissionId === submission.id,
      ),
    }));

    return NextResponse.json(payments);
  } catch (error) {
    console.error("Failed to fetch payment submissions:", error);

    return NextResponse.json(
      { message: "Failed to fetch payment submissions." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  let savedFilePath: string | null = null;

  try {
    const formData = await request.formData();

    const institutionId = Number(formData.get("institutionId"));
    const scholarshipId = Number(formData.get("scholarshipId"));
    const registrationIdsRaw = formData.get("registrationIds");
    const paymentMethod = String(formData.get("paymentMethod") || "");
    const transactionId = String(formData.get("transactionId") || "").trim();
    const screenshot = formData.get("screenshot");

    if (
      !Number.isInteger(institutionId) ||
      institutionId <= 0 ||
      !Number.isInteger(scholarshipId) ||
      scholarshipId <= 0
    ) {
      return NextResponse.json(
        { message: "Invalid institution or scholarship." },
        { status: 400 },
      );
    }

    if (
      typeof registrationIdsRaw !== "string" ||
      !["bKash", "Nagad", "Rocket", "Bank"].includes(paymentMethod) ||
      !transactionId
    ) {
      return NextResponse.json(
        { message: "Please provide valid payment information." },
        { status: 400 },
      );
    }

    let registrationIds: number[];

    try {
      const parsed = JSON.parse(registrationIdsRaw);

      if (
        !Array.isArray(parsed) ||
        parsed.length === 0 ||
        !parsed.every((id) => Number.isInteger(id) && id > 0)
      ) {
        throw new Error("Invalid registration IDs");
      }

      registrationIds = [...new Set(parsed)];

      if (registrationIds.length !== parsed.length) {
        throw new Error("Duplicate registration IDs");
      }
    } catch {
      return NextResponse.json(
        { message: "Invalid registration selection." },
        { status: 400 },
      );
    }

    if (!(screenshot instanceof File) || screenshot.size === 0) {
      return NextResponse.json(
        { message: "Payment screenshot is required." },
        { status: 400 },
      );
    }

    const extension = allowedMimeTypes[screenshot.type];

    if (!extension || screenshot.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "Invalid image type or file size. Maximum size is 5 MB." },
        { status: 400 },
      );
    }

    const fileName = `${randomUUID()}${extension}`;
    const uploadDirectory = path.join(
      process.cwd(),
      "storage",
      "payment-proofs",
    );

    await mkdir(uploadDirectory, { recursive: true });

    savedFilePath = path.join(uploadDirectory, fileName);

    const fileBuffer = Buffer.from(await screenshot.arrayBuffer());

    await writeFile(savedFilePath, fileBuffer, { flag: "wx" });

    const result = await db.transaction(async (tx) => {
      // Lock selected registrations to prevent concurrent submissions.
      const selectedRegistrations = await tx
        .select({
          id: scholarshipRegistrations.id,
          registrationFee: scholarshipRegistrations.registrationFee,
          paymentStatus: scholarshipRegistrations.paymentStatus,
          studentId: students.id,
          institutionId: students.institutionId,
        })
        .from(scholarshipRegistrations)
        .innerJoin(
          students,
          eq(scholarshipRegistrations.studentId, students.id),
        )
        .where(
          and(
            inArray(scholarshipRegistrations.id, registrationIds),
            eq(scholarshipRegistrations.scholarshipId, scholarshipId),
            eq(students.institutionId, institutionId),
          ),
        )
        .for("update");

      if (selectedRegistrations.length !== registrationIds.length) {
        throw new Error("INVALID_REGISTRATIONS");
      }

      if (
        selectedRegistrations.some(
          (registration) => registration.paymentStatus !== "Unpaid",
        )
      ) {
        throw new Error("REGISTRATION_NOT_UNPAID");
      }

      const pendingItems = await tx
        .select({
          registrationId: paymentSubmissionItems.registrationId,
        })
        .from(paymentSubmissionItems)
        .innerJoin(
          paymentSubmissions,
          eq(paymentSubmissionItems.paymentSubmissionId, paymentSubmissions.id),
        )
        .where(
          and(
            inArray(paymentSubmissionItems.registrationId, registrationIds),
            eq(paymentSubmissions.status, "Pending"),
          ),
        );

      if (pendingItems.length > 0) {
        throw new Error("PAYMENT_ALREADY_PENDING");
      }

      const totalAmount = selectedRegistrations.reduce(
        (total, registration) => total + registration.registrationFee,
        0,
      );

      const [submission] = await tx
        .insert(paymentSubmissions)
        .values({
          institutionId,
          scholarshipId,
          totalAmount,
          paymentMethod,
          transactionId,
          screenshotUrl: `payment-proofs/${fileName}`,
          status: "Pending",
        })
        .returning({ id: paymentSubmissions.id });

      await tx.insert(paymentSubmissionItems).values(
        selectedRegistrations.map((registration) => ({
          paymentSubmissionId: submission.id,
          registrationId: registration.id,
          amount: registration.registrationFee,
        })),
      );

      // Mark selected registrations as payment pending.
      await tx
        .update(scholarshipRegistrations)
        .set({
          paymentStatus: "Pending",
        })
        .where(inArray(scholarshipRegistrations.id, registrationIds));

      return {
        id: submission.id,
        totalAmount,
      };
    });

    return NextResponse.json(
      {
        message: "Payment information submitted successfully.",
        paymentSubmission: result,
      },
      { status: 201 },
    );
  } catch (error) {
    if (savedFilePath) {
      await unlink(savedFilePath).catch(() => {});
    }

    if (error instanceof Error) {
      if (error.message === "INVALID_REGISTRATIONS") {
        return NextResponse.json(
          { message: "Some selected registrations are invalid." },
          { status: 400 },
        );
      }

      if (error.message === "REGISTRATION_NOT_UNPAID") {
        return NextResponse.json(
          { message: "Only unpaid registrations can be submitted." },
          { status: 409 },
        );
      }

      if (error.message === "PAYMENT_ALREADY_PENDING") {
        return NextResponse.json(
          {
            message:
              "A payment submission is already pending for a selected student.",
          },
          { status: 409 },
        );
      }
    }

    console.error("Payment submission error:", error);

    return NextResponse.json(
      { message: "Something went wrong while submitting payment." },
      { status: 500 },
    );
  }
}
