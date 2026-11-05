import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { aboutPages } from "@/lib/db/schema";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const [page] = await db
        .select()
        .from(aboutPages)
        .where(eq(aboutPages.slug, slug))
        .limit(1);

      if (!page || !page.isPublished) {
        return NextResponse.json({ message: "Page not found" }, { status: 404 });
      }

      return NextResponse.json(page);
    }

    const pages = await db
      .select({
        id: aboutPages.id,
        title: aboutPages.title,
        slug: aboutPages.slug,
        order: aboutPages.order,
        isPublished: aboutPages.isPublished,
        updatedAt: aboutPages.updatedAt,
      })
      .from(aboutPages)
      .where(eq(aboutPages.isPublished, true))
      .orderBy(asc(aboutPages.order), asc(aboutPages.id));

    return NextResponse.json(pages);
  } catch (error) {
    console.error("Failed to fetch public about pages:", error);
    return NextResponse.json(
      { message: "Failed to fetch about pages." },
      { status: 500 },
    );
  }
}

