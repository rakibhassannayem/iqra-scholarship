import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { aboutPages, activityLogs } from "@/lib/db/schema";
import { auth } from "../../../../../auth";

export async function GET() {
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

    const pages = await db
      .select()
      .from(aboutPages)
      .orderBy(asc(aboutPages.order), asc(aboutPages.id));

    return NextResponse.json(pages);
  } catch (error) {
    console.error("Failed to fetch admin about pages:", error);
    return NextResponse.json(
      { message: "Failed to fetch about pages." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (
      !session?.user ||
      !["admin", "superadmin"].includes(session.user.role ?? "")
    ) {
      return NextResponse.json(
        { message: "Unauthorized to create pages." },
        { status: 403 },
      );
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

    const existing = await db
      .select({ id: aboutPages.id })
      .from(aboutPages)
      .where(eq(aboutPages.slug, cleanSlug))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { message: "A page with this URL slug already exists." },
        { status: 409 },
      );
    }

    const [newPage] = await db
      .insert(aboutPages)
      .values({
        title: title.trim(),
        slug: cleanSlug,
        content: typeof content === "string" ? content : "",
        order: typeof order === "number" ? order : 0,
        isPublished: typeof isPublished === "boolean" ? isPublished : true,
      })
      .returning();

    await db.insert(activityLogs).values({
      userId: Number(session.user.id),
      action: "CREATE",
      module: "ABOUT_PAGE",
      recordId: newPage.id,
      description: `Created about page: ${newPage.title} (${newPage.slug})`,
      previousData: null,
      newData: newPage,
    });

    return NextResponse.json(newPage, { status: 201 });
  } catch (error) {
    console.error("Failed to create about page:", error);
    return NextResponse.json(
      { message: "Failed to create about page." },
      { status: 500 },
    );
  }
}

