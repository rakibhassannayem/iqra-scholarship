import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { auth } from "../../../../auth";

export async function GET() {
  try {
    const allSettings = await db.select().from(settings);

    const settingsObject = Object.fromEntries(
      allSettings.map((setting) => [setting.key, setting.value]),
    );

    return NextResponse.json(settingsObject);
  } catch (error) {
    console.error("Failed to fetch settings:", error);

    return NextResponse.json(
      { message: "Failed to fetch settings." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (
      !session?.user ||
      !["admin", "superadmin"].includes(session.user.role)
    ) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 403 });
    }

    const body = await request.json();
    const { key, value } = body;

    if (key !== "public_background" || typeof value !== "string" || !value) {
      return NextResponse.json(
        { message: "Invalid setting data." },
        { status: 400 },
      );
    }

    const [updatedSetting] = await db
      .insert(settings)
      .values({ key, value })
      .onConflictDoUpdate({
        target: settings.key,
        set: {
          value,
          updatedAt: new Date(),
        },
      })
      .returning();

    return NextResponse.json(updatedSetting);
  } catch (error) {
    console.error("Failed to update settings:", error);

    return NextResponse.json(
      { message: "Failed to update settings." },
      { status: 500 },
    );
  }
}
