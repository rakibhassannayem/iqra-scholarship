import { auth } from "../../../../../../auth";
import { db } from "@/lib/db";
import { paymentSubmissions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Only admin and superadmin can view payment screenshots.
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

    const [payment] = await db
      .select({
        screenshotUrl: paymentSubmissions.screenshotUrl,
      })
      .from(paymentSubmissions)
      .where(eq(paymentSubmissions.id, paymentId))
      .limit(1);

    if (!payment?.screenshotUrl) {
      return NextResponse.json(
        { message: "Screenshot not found" },
        { status: 404 },
      );
    }

    // Allow files only from the payment-proofs directory.
    const filename = path.basename(payment.screenshotUrl);

    if (
      !payment.screenshotUrl.startsWith("payment-proofs/") ||
      filename !== payment.screenshotUrl.slice("payment-proofs/".length)
    ) {
      return NextResponse.json(
        { message: "Invalid screenshot path" },
        { status: 400 },
      );
    }

    const extension = path.extname(filename).toLowerCase();

    const contentTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
    };

    const contentType = contentTypes[extension];

    if (!contentType) {
      return NextResponse.json(
        { message: "Unsupported image format" },
        { status: 400 },
      );
    }

    const filePath = path.join(
      process.cwd(),
      "storage",
      "payment-proofs",
      filename,
    );

    const image = await readFile(filePath);

    return new NextResponse(new Uint8Array(image), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Payment screenshot error:", error);

    return NextResponse.json(
      { message: "Unable to load screenshot" },
      { status: 500 },
    );
  }
}
