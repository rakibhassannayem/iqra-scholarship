import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { auth } from "../../../../../auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const userId = Number(id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json({ error: "Invalid user ID." }, { status: 400 });
    }

    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to fetch user:", error);

    return NextResponse.json(
      { error: "Failed to fetch user." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (session.user.role !== "superadmin") {
    return NextResponse.json(
      { error: "Forbidden. Superadmin access required." },
      { status: 403 },
    );
  }

  try {
    const { id } = await params;
    const userId = Number(id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json({ error: "Invalid user ID." }, { status: 400 });
    }

    const body = await request.json();
    const name = body.name === undefined ? undefined : String(body.name).trim();
    const email =
      body.email === undefined
        ? undefined
        : String(body.email).trim().toLowerCase();
    const role = body.role === undefined ? undefined : String(body.role).trim();
    const password =
      body.password === undefined ? undefined : String(body.password);

    if (name !== undefined && !name) {
      return NextResponse.json(
        { error: "Name cannot be empty." },
        { status: 400 },
      );
    }

    if (email !== undefined && !email) {
      return NextResponse.json(
        { error: "Email cannot be empty." },
        { status: 400 },
      );
    }

    if (role !== undefined && !["admin", "superadmin"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid user role." },
        { status: 400 },
      );
    }

    if (password !== undefined && password.length > 0 && password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const [existingUser] = await db
      .select({ id: users.id, role: users.role })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!existingUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Prevent demoting the last superadmin.
    if (role === "admin" && existingUser.role === "superadmin") {
      const superadmins = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.role, "superadmin"));

      if (superadmins.length <= 1) {
        return NextResponse.json(
          { error: "Cannot demote the last superadmin." },
          { status: 409 },
        );
      }
    }

    if (email !== undefined) {
      const [duplicateEmail] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (duplicateEmail && duplicateEmail.id !== userId) {
        return NextResponse.json(
          { error: "A user with this email already exists." },
          { status: 409 },
        );
      }
    }

    const updates: {
      name?: string;
      email?: string;
      role?: string;
      password?: string;
    } = {};

    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (role !== undefined) updates.role = role;

    if (password !== undefined && password.length > 0) {
      updates.password = await bcrypt.hash(password, 12);
    }

    if (Object.keys(updates).length > 0) {
      await db.update(users).set(updates).where(eq(users.id, userId));
    }

    const [updatedUser] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Failed to update user:", error);

    return NextResponse.json(
      { error: "Failed to update user." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (session.user.role !== "superadmin") {
    return NextResponse.json(
      { error: "Forbidden. Superadmin access required." },
      { status: 403 },
    );
  }

  try {
    const { id } = await params;
    const userId = Number(id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json({ error: "Invalid user ID." }, { status: 400 });
    }

    const [targetUser] = await db
      .select({ id: users.id, role: users.role })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!targetUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Prevent deleting the last superadmin.
    if (targetUser.role === "superadmin") {
      const superadmins = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.role, "superadmin"));

      if (superadmins.length <= 1) {
        return NextResponse.json(
          { error: "Cannot delete the last superadmin." },
          { status: 409 },
        );
      }
    }

    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning({ id: users.id });

    if (!deletedUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete user:", error);

    return NextResponse.json(
      { error: "Failed to delete user." },
      { status: 500 },
    );
  }
}
