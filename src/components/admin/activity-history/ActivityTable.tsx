"use client";

import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ActivityLog } from "@/types/activity-log";

type ActivityTableProps = {
  logs: ActivityLog[];
  loading: boolean;
  search: string;
  role: string;
  onView: (log: ActivityLog) => void;
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
  onView,
}: ActivityTableProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-200 dark:bg-yellow-900">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3">Timestamp</th>
              <th className="px-5 py-3">User</th>
              <th className="px-5 py-3">Action</th>
              <th className="px-5 py-3">Module</th>
              <th className="px-5 py-3">Description</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span>Loading logs...</span>
                  </div>
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-muted-foreground"
                >
                  No activity logs found.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-4 whitespace-nowrap text-xs text-muted-foreground">
                    {formatDate(log.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-foreground">
                        {log.userName || "System"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {log.userEmail || "N/A"}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      variant="outline"
                      className={`font-semibold ${
                        actionStyles[log.action] || ""
                      }`}
                    >
                      {log.action}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant="secondary" className="font-normal text-xs">
                      {log.module}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 max-w-md truncate text-muted-foreground">
                    {highlightMatch(log.description, search)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView(log)}
                      >
                        <Eye className="mr-2 size-4" />
                        View
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
