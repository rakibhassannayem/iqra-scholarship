"use client";

import { useState } from "react";
import { Eye, Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { ActivityLog } from "@/types/activity-log";

type ActivityTableProps = {
  logs: ActivityLog[];
  loading: boolean;
  search: string;
  role: string;
  onView: (log: ActivityLog) => void;
  onDelete: (id: number) => Promise<void>;
};

const actionStyles: Record<string, string> = {
  CREATE: "bg-green-500/10 text-green-700 border-green-500/20",
  UPDATE: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  DELETE: "bg-red-500/10 text-red-700 border-red-500/20",
};

export default function ActivityTable({
  logs,
  loading,
  search,
  role,
  onView,
  onDelete,
}: ActivityTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

  const isSuperadmin = role === "superadmin";

  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id);
      await onDelete(id);
    } catch (error) {
      console.error("Failed to delete activity log:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) return true;

    return [
      log.userName,
      log.userEmail,
      log.action,
      log.module,
      log.description,
      String(log.recordId ?? ""),
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(searchText));
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-BD", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="border-b px-5 py-4">
        <h3 className="font-semibold">Activity Records</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Showing {filteredLogs.length} activities
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-225 text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-5 py-3 font-medium">User</th>
              <th className="px-5 py-3 font-medium">Action</th>
              <th className="px-5 py-3 font-medium">Module</th>
              <th className="px-5 py-3 font-medium">Record ID</th>
              <th className="px-5 py-3 font-medium">Description</th>
              <th className="px-5 py-3 font-medium">Date & Time</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="size-5 animate-spin" />
                    Loading activities...
                  </div>
                </td>
              </tr>
            ) : filteredLogs.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-12 text-center text-muted-foreground"
                >
                  No activity records found.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium">{log.userName || "Public"}</p>
                    {log.userEmail && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {log.userEmail}
                      </p>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <Badge
                      variant="outline"
                      className={actionStyles[log.action] || ""}
                    >
                      {log.action}
                    </Badge>
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-medium">{log.module}</span>
                  </td>

                  <td className="px-5 py-4">{log.recordId ?? "—"}</td>

                  <td className="max-w-62.5 px-5 py-4">
                    <p className="truncate" title={log.description}>
                      {log.description}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                    {formatDate(log.createdAt)}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView(log)}
                      >
                        <Eye className="mr-2 size-4" />
                      </Button>

                      {isSuperadmin && (
                        <button
                          type="button"
                          disabled={deletingId === log.id}
                          onClick={() => setSelectedDeleteId(log.id)}
                          className="inline-flex size-9 items-center justify-center rounded-md border border-destructive bg-destructive text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:pointer-events-none disabled:opacity-50"
                        >
                          {deletingId === log.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <AlertDialog
        open={selectedDeleteId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Activity Log?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this activity record?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              disabled={deletingId !== null}
              onClick={() => {
                if (selectedDeleteId !== null) {
                  handleDelete(selectedDeleteId);
                  setSelectedDeleteId(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
