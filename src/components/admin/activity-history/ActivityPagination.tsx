"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ActivityPagination as ActivityPaginationType } from "@/types/activity-log";

type ActivityPaginationProps = {
  pagination: ActivityPaginationType;
  onPageChange: (page: number) => void;
  loading?: boolean;
};

export default function ActivityPagination({
  pagination,
  onPageChange,
  loading = false,
}: ActivityPaginationProps) {
  const { page, limit, total, totalPages } = pagination;

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  if (totalPages <= 1) {
    return (
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>
          Showing {start}–{end} of {total} activities
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <p className="text-sm text-muted-foreground">
        Showing {start}–{end} of {total} activities
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1 || loading}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="mr-1 size-4" />
          Previous
        </Button>

        <span className="whitespace-nowrap text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages || loading}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight className="ml-1 size-4" />
        </Button>
      </div>
    </div>
  );
}
