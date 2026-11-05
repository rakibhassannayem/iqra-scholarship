import { NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import { aboutPages, activityLogs } from "@/lib/db/schema";
import { auth } from "../../../../../../auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const session = await auth();

    if (
      !session?.user ||
      !["admin", "superadmin"].includes(session.user.role ?? "")
    ) {
      return NextResponse.json(
        { message: "Unauthorized access." },
        { status: 403 },
      );
    }

    const { id } = await params;
    const pageId = Number(id);

    if (!Number.isInteger(pageId) || pageId <= 0) {
      return NextResponse.json({ message: "Invalid page ID." }, { status: 400 });
    }

    const [page] = await db
      .select()
      .from(aboutPages)
      .where(eq(aboutPages.id, pageId))
      .limit(1);

    if (!page) {
      return NextResponse.json({ message: "Page not found." }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error("Failed to fetch about page:", error);
    return NextResponse.json(
      { message: "Failed to fetch about page." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const session = await auth();

    if (
      !session?.user ||
      !["admin", "superadmin"].includes(session.user.role ?? "")
    ) {
      return NextResponse.json(
        { message: "Unauthorized to update pages." },
        { status: 403 },
      );
    }

    const { id } = await params;
    const pageId = Number(id);

    if (!Number.isInteger(pageId) || pageId <= 0) {
      return NextResponse.json({ message: "Invalid page ID." }, { status: 400 });
    }

    const [existing] = await db
      .select()
      .from(aboutPages)
      .where(eq(aboutPages.id, pageId))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ message: "Page not found." }, { status: 404 });
    }

    const body = await request.json();
    const { title, slug, content, order, isPublished } = body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof slug !== "string" ||
      !slug.trim()
    ) {
      return NextResponse.json(
        { message: "Title and slug are required." },
        { status: 400 },
      );
    }

    const cleanSlug = slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\u0980-\u09FF\-_]/gi, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    if (!cleanSlug) {
      return NextResponse.json(
        { message: "Invalid slug format." },
        { status: 400 },
      );
    }

    // Check slug conflict with other pages
    const slugConflict = await db
      .select({ id: aboutPages.id })
      .from(aboutPages)
      .where(and(eq(aboutPages.slug, cleanSlug), ne(aboutPages.id, pageId)))
      .limit(1);

    if (slugConflict.length > 0) {
      return NextResponse.json(
        { message: "Another page with this URL slug already exists." },
        { status: 409 },
      );
    }

    const [updated] = await db
      .update(aboutPages)
      .set({
        title: title.trim(),
        slug: cleanSlug,
        content: typeof content === "string" ? content : existing.content,
        order: typeof order === "number" ? order : existing.order,
        isPublished:
          typeof isPublished === "boolean" ? isPublished : existing.isPublished,
        updatedAt: new Date(),
      })
      .where(eq(aboutPages.id, pageId))
      .returning();

    await db.insert(activityLogs).values({
      userId: Number(session.user.id),
      action: "UPDATE",
      module: "ABOUT_PAGE",
      recordId: updated.id,
      description: `Updated about page: ${updated.title} (${updated.slug})`,
      previousData: existing,
      newData: updated,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update about page:", error);
    return NextResponse.json(
      { message: "Failed to update about page." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const session = await auth();

    if (
      !session?.user ||
      !["admin", "superadmin"].includes(session.user.role ?? "")
    ) {
      return NextResponse.json(
        { message: "Unauthorized to delete pages." },
        { status: 403 },
      );
    }

    const { id } = await params;
    const pageId = Number(id);

    if (!Number.isInteger(pageId) || pageId <= 0) {
      return NextResponse.json({ message: "Invalid page ID." }, { status: 400 });
    }

    const [existing] = await db
      .select()
      .from(aboutPages)
      .where(eq(aboutPages.id, pageId))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ message: "Page not found." }, { status: 404 });
    }

    await db.delete(aboutPages).where(eq(aboutPages.id, pageId));

    await db.insert(activityLogs).values({
      userId: Number(session.user.id),
      action: "DELETE",
      module: "ABOUT_PAGE",
      recordId: pageId,
      description: `Deleted about page: ${existing.title} (${existing.slug})`,
      previousData: existing,
      newData: null,
    });

    return NextResponse.json({ message: "Page deleted successfully." });
  } catch (error) {
    console.error("Failed to delete about page:", error);
    return NextResponse.json(
      { message: "Failed to delete about page." },
      { status: 500 },
    );
  }
}

