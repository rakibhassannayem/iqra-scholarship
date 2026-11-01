import { NextResponse } from "next/server";
import { and, count, desc, eq, gte, lte } from "drizzle-orm";

import { auth } from "../../../../auth";
import { db } from "@/lib/db";
import { activityLogs, users } from "@/lib/db/schema";

export async function GET(request: Request) {
  try {
    // Check authentication and authorization
    const session = await auth();

    if (
      !session?.user ||
      !["admin", "superadmin"].includes(session.user.role ?? "")
    ) {
      return NextResponse.json(
        { message: "Unauthorized access." },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);

    const action = searchParams.get("action");
    const module = searchParams.get("module");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number(searchParams.get("limit")) || 20),
    );

    const conditions = [];

    if (action) {
      conditions.push(eq(activityLogs.action, action));
    }

    if (module) {
      conditions.push(eq(activityLogs.module, module));
    }

    if (startDate) {
      const date = new Date(startDate);

      if (Number.isNaN(date.getTime())) {
        return NextResponse.json(
          { message: "Invalid start date." },
          { status: 400 },
        );
      }

      conditions.push(gte(activityLogs.createdAt, date));
    }

    if (endDate) {
      const date = new Date(endDate);

      if (Number.isNaN(date.getTime())) {
        return NextResponse.json(
          { message: "Invalid end date." },
          { status: 400 },
        );
      }

      // Include the entire selected end date
      date.setHours(23, 59, 59, 999);

      conditions.push(lte(activityLogs.createdAt, date));
    }

    const whereCondition =
      conditions.length > 0 ? and(...conditions) : undefined;

    const offset = (page - 1) * limit;

    const [logs, [totalResult]] = await Promise.all([
      db
        .select({
          id: activityLogs.id,
          userId: activityLogs.userId,
          userName: users.name,
          userEmail: users.email,
          action: activityLogs.action,
          module: activityLogs.module,
          recordId: activityLogs.recordId,
          description: activityLogs.description,
          previousData: activityLogs.previousData,
          newData: activityLogs.newData,
          createdAt: activityLogs.createdAt,
        })
        .from(activityLogs)
        .leftJoin(users, eq(activityLogs.userId, users.id))
        .where(whereCondition)
        .orderBy(desc(activityLogs.createdAt))
        .limit(limit)
        .offset(offset),

      db.select({ total: count() }).from(activityLogs).where(whereCondition),
    ]);

    const total = totalResult.total;

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch activity logs:", error);

    return NextResponse.json(
      { message: "Failed to fetch activity logs." },
      { status: 500 },
    );
  }
}
