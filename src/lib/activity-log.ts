import { db } from "@/lib/db";
import { activityLogs } from "@/lib/db/schema";
import type { CreateActivityLogInput } from "@/types/activity-log";

export type { CreateActivityLogInput };

export async function createActivityLog(data: CreateActivityLogInput) {
  await db.insert(activityLogs).values({
    userId: data.userId ?? null,
    action: data.action,
    module: data.module,
    recordId: data.recordId ?? null,
    description: data.description,
    previousData: data.previousData ?? null,
    newData: data.newData ?? null,
  });
}
