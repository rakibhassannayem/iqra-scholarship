"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ActivityLog } from "@/types/activity-log";

type ActivityDetailsModalProps = {
  log: ActivityLog | null;
  onClose: () => void;
};

export default function ActivityDetailsModal({
  log,
  onClose,
}: ActivityDetailsModalProps) {
  if (!log) return null;

  const formatData = (data: Record<string, unknown> | null) => {
    if (!data || Object.keys(data).length === 0) {
      return "No data available";
    }

    return JSON.stringify(data, null, 2);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-BD", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border bg-background shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">Activity Details</h2>
            <p className="text-sm text-muted-foreground">
              Activity ID: #{log.id}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close details"
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Activity Information */}
        <div className="space-y-6 p-6">
          <section>
            <h3 className="mb-3 font-semibold">Activity Information</h3>

            <div className="grid grid-cols-1 gap-4 rounded-lg border p-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">User</p>
                <p className="mt-1 font-medium">
                  {log.userName || "System / Public"}
                </p>
                {log.userEmail && (
                  <p className="text-sm text-muted-foreground">
                    {log.userEmail}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Action</p>
                <p className="mt-1 font-medium">{log.action}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Module</p>
                <p className="mt-1 font-medium">{log.module}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Record ID</p>
                <p className="mt-1 font-medium">{log.recordId ?? "—"}</p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="mt-1 font-medium">{log.description}</p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-sm text-muted-foreground">Date & Time</p>
                <p className="mt-1 font-medium">{formatDate(log.createdAt)}</p>
              </div>
            </div>
          </section>

          {/* Previous Data */}
          <section>
            <h3 className="mb-3 font-semibold">Previous Data</h3>

            <pre className="overflow-x-auto rounded-lg border bg-muted/40 p-4 text-xs leading-relaxed">
              {formatData(log.previousData)}
            </pre>
          </section>

          {/* New Data */}
          <section>
            <h3 className="mb-3 font-semibold">New Data</h3>

            <pre className="overflow-x-auto rounded-lg border bg-muted/40 p-4 text-xs leading-relaxed">
              {formatData(log.newData)}
            </pre>
          </section>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
