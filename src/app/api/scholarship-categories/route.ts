import { NextResponse } from "next/server";
import { asc, eq, sql } from "drizzle-orm";
import { auth } from "../../../../auth";
import { db } from "@/lib/db";
import { scholarshipCategories, scholarshipGrants } from "@/lib/db/schema";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const categories = await db
      .select({
        id: scholarshipCategories.id,
        name: scholarshipCategories.name,
        description: scholarshipCategories.description,
        isActive: scholarshipCategories.isActive,
        createdAt: scholarshipCategories.createdAt,
        updatedAt: scholarshipCategories.updatedAt,
      })
      .from(scholarshipCategories)
      .orderBy(asc(scholarshipCategories.name));

    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET scholarship categories error:", error);

    return NextResponse.json(
      { message: "Failed to fetch scholarship categories." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const description =
      typeof body.description === "string" ? body.description.trim() : "";

    if (!name) {
      return NextResponse.json(
        { message: "Category name is required." },
        { status: 400 },
      );
    }

    if (name.length > 100 || description.length > 1000) {
      return NextResponse.json(
        { message: "Category name or description is too long." },
        { status: 400 },
      );
    }

    const existing = await db
      .select({ id: scholarshipCategories.id })
      .from(scholarshipCategories)
      .where(sql`lower(${scholarshipCategories.name}) = lower(${name})`)
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { message: "This category already exists." },
        { status: 409 },
      );
    }

    const [category] = await db
      .insert(scholarshipCategories)
      .values({
        name,
        description: description || null,
      })
      .returning();

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("POST scholarship category error:", error);

    return NextResponse.json(
      { message: "Failed to create scholarship category." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const id = Number(body.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { message: "Valid category ID is required." },
        { status: 400 },
      );
    }

    const updates: {
      name?: string;
      description?: string | null;
      isActive?: boolean;
      updatedAt: Date;
    } = {
      updatedAt: new Date(),
    };

    if (body.name !== undefined) {
      if (typeof body.name !== "string" || !body.name.trim()) {
        return NextResponse.json(
          { message: "Category name is required." },
          { status: 400 },
        );
      }

      const name = body.name.trim();

      if (name.length > 100) {
        return NextResponse.json(
          { message: "Category name must be 100 characters or fewer." },
          { status: 400 },
        );
      }

      const existing = await db
        .select({ id: scholarshipCategories.id })
        .from(scholarshipCategories)
        .where(eq(scholarshipCategories.name, name))
        .limit(1);

      if (existing.length > 0 && existing[0].id !== id) {
        return NextResponse.json(
          { message: "This category name already exists." },
          { status: 409 },
        );
      }

      updates.name = name;
    }

    if (body.description !== undefined) {
      if (body.description !== null && typeof body.description !== "string") {
        return NextResponse.json(
          { message: "Description must be text." },
          { status: 400 },
        );
      }

      const description =
        typeof body.description === "string" ? body.description.trim() : "";

      if (description.length > 1000) {
        return NextResponse.json(
          { message: "Description must be 1000 characters or fewer." },
          { status: 400 },
        );
      }

      updates.description = description || null;
    }

    if (body.isActive !== undefined) {
      if (typeof body.isActive !== "boolean") {
        return NextResponse.json(
          { message: "isActive must be true or false." },
          { status: 400 },
        );
      }

      updates.isActive = body.isActive;
    }

    const [category] = await db
      .update(scholarshipCategories)
      .set(updates)
      .where(eq(scholarshipCategories.id, id))
      .returning();

    if (!category) {
      return NextResponse.json(
        { message: "Category not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("PATCH scholarship category error:", error);

    return NextResponse.json(
      { message: "Failed to update scholarship category." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = Number(new URL(request.url).searchParams.get("id"));

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { message: "Invalid category ID." },
        { status: 400 },
      );
    }

    // Check whether this category is used by any scholarship grant.
    const existingGrant = await db
      .select({ id: scholarshipGrants.id })
      .from(scholarshipGrants)
      .where(eq(scholarshipGrants.categoryId, id))
      .limit(1);

    if (existingGrant.length > 0) {
      return NextResponse.json(
        {
          message:
            "This category cannot be deleted because it is used by scholarship grants.",
        },
        { status: 409 },
      );
    }

    const [deletedCategory] = await db
      .delete(scholarshipCategories)
      .where(eq(scholarshipCategories.id, id))
      .returning({ id: scholarshipCategories.id });

    if (!deletedCategory) {
      return NextResponse.json(
        { message: "Category not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Category deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE scholarship category error:", error);

    return NextResponse.json(
      { message: "Failed to delete category." },
      { status: 500 },
    );
  }
}
