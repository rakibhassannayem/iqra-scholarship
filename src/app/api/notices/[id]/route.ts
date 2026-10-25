import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { notices } from "@/lib/db/schema";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function getNoticeId(context: RouteContext) {
  const { id } = await context.params;
  const noticeId = Number(id);

  if (!Number.isInteger(noticeId) || noticeId <= 0) {
    return null;
  }

  return noticeId;
}

// GET: নির্দিষ্ট notice দেখা
export async function GET(_request: Request, context: RouteContext) {
  try {
    const id = await getNoticeId(context);

    if (id === null) {
      return NextResponse.json(
        { message: "Invalid notice ID." },
        { status: 400 },
      );
    }

    const [notice] = await db
      .select()
      .from(notices)
      .where(eq(notices.id, id))
      .limit(1);

    if (!notice) {
      return NextResponse.json(
        { message: "Notice not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(notice);
  } catch (error) {
    console.error("Failed to fetch notice:", error);

    return NextResponse.json(
      { message: "Failed to fetch notice." },
      { status: 500 },
    );
  }
}

// PATCH: notice update করা
export async function PATCH(request: Request, context: RouteContext) {
  try {
    const id = await getNoticeId(context);

    if (id === null) {
      return NextResponse.json(
        { message: "Invalid notice ID." },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { title, content, isPublished } = body;

    if (
      title === undefined &&
      content === undefined &&
      isPublished === undefined
    ) {
      return NextResponse.json(
        { message: "Provide at least one field to update." },
        { status: 400 },
      );
    }

    if (
      (title !== undefined && (typeof title !== "string" || !title.trim())) ||
      (content !== undefined &&
        (typeof content !== "string" || !content.trim())) ||
      (isPublished !== undefined && typeof isPublished !== "boolean")
    ) {
      return NextResponse.json(
        { message: "Invalid notice fields." },
        { status: 400 },
      );
    }

    const updates: {
      title?: string;
      content?: string;
      isPublished?: boolean;
    } = {};

    if (title !== undefined) updates.title = title.trim();
    if (content !== undefined) updates.content = content.trim();
    if (isPublished !== undefined) {
      updates.isPublished = isPublished;
    }

    const [updatedNotice] = await db
      .update(notices)
      .set(updates)
      .where(eq(notices.id, id))
      .returning();

    if (!updatedNotice) {
      return NextResponse.json(
        { message: "Notice not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Notice updated successfully.",
      notice: updatedNotice,
    });
  } catch (error) {
    console.error("Failed to update notice:", error);

    return NextResponse.json(
      { message: "Failed to update notice." },
      { status: 500 },
    );
  }
}

// DELETE: notice delete করা
export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const id = await getNoticeId(context);

    if (id === null) {
      return NextResponse.json(
        { message: "Invalid notice ID." },
        { status: 400 },
      );
    }

    const [deletedNotice] = await db
      .delete(notices)
      .where(eq(notices.id, id))
      .returning();

    if (!deletedNotice) {
      return NextResponse.json(
        { message: "Notice not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Notice deleted successfully.",
      notice: deletedNotice,
    });
  } catch (error) {
    console.error("Failed to delete notice:", error);

    return NextResponse.json(
      { message: "Failed to delete notice." },
      { status: 500 },
    );
  }
}
