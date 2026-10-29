import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { notices } from "@/lib/db/schema";
import { auth } from "../../../../auth";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (
      !session?.user ||
      !["admin", "superadmin"].includes(session.user.role ?? "")
    ) {
      return NextResponse.json(
        { message: "You are not authorized to create notices." },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { title, content, isPublished } = body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof content !== "string" ||
      !content.trim()
    ) {
      return NextResponse.json(
        { message: "Notice title and content are required." },
        { status: 400 },
      );
    }

    if (isPublished !== undefined && typeof isPublished !== "boolean") {
      return NextResponse.json(
        { message: "Published status must be true or false." },
        { status: 400 },
      );
    }

    const [notice] = await db
      .insert(notices)
      .values({
        title: title.trim(),
        content: content.trim(),
        isPublished: isPublished ?? false,
      })
      .returning();

    return NextResponse.json(notice, { status: 201 });
  } catch (error) {
    console.error("Failed to create notice:", error);

    return NextResponse.json(
      { message: "Failed to create notice." },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get("published") === "true";

    const allNotices = await db
      .select()
      .from(notices)
      .where(publishedOnly ? eq(notices.isPublished, true) : undefined)
      .orderBy(desc(notices.createdAt));

    return NextResponse.json(allNotices);
  } catch (error) {
    console.error("Failed to fetch notices:", error);

    return NextResponse.json(
      { message: "Failed to fetch notices." },
      { status: 500 },
    );
  }
}
