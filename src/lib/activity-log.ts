import { db } from "@/lib/db";
import { activityLogs } from "@/lib/db/schema";

type CreateActivityLogInput = {
  userId?: number | null;
  action: string;
  module: string;
  recordId?: number | null;
  description: string;
  previousData?: Record<string, unknown> | null;
  newData?: Record<string, unknown> | null;
};

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
