"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/toast";

import { Button } from "@/components/ui/button";

import ActivitySummary from "@/components/admin/activity-history/ActivitySummary";
import ActivityFilters from "@/components/admin/activity-history/ActivityFilters";
import ActivityTable from "@/components/admin/activity-history/ActivityTable";
import ActivityDetailsModal from "@/components/admin/activity-history/ActivityDetailsModal";
import ActivityPagination from "@/components/admin/activity-history/ActivityPagination";

import type {
  ActivityLog,
  ActivityFilters as ActivityFiltersType,
  ActivityPagination as ActivityPaginationType,
  ActivitySummaryData,
} from "@/types/activity-log";
import { getSession } from "next-auth/react";

const initialFilters: ActivityFiltersType = {
  search: "",
  action: "",
  module: "",
  startDate: "",
  endDate: "",
};

const initialPagination: ActivityPaginationType = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

const initialSummary: ActivitySummaryData = {
  total: 0,
  create: 0,
  update: 0,
  delete: 0,
};

export default function ActivityHistoryPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [summary, setSummary] = useState<ActivitySummaryData>(initialSummary);

  const [pagination, setPagination] =
    useState<ActivityPaginationType>(initialPagination);

  const [filters, setFilters] = useState<ActivityFiltersType>(initialFilters);

  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);

  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);

  const [userRole, setUserRole] = useState("");

  // Fetch activity logs
  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit),
      });

      if (filters.action) {
        params.set("action", filters.action);
      }

      if (filters.module) {
        params.set("module", filters.module);
      }

      if (filters.startDate) {
        params.set("startDate", filters.startDate);
      }

      if (filters.endDate) {
        params.set("endDate", filters.endDate);
      }

      const response = await fetch(`/api/activity-logs?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch activity logs.");
      }

      const data = await response.json();

      setLogs(data.logs);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Activity logs fetch error:", error);

      toast.add({
        title: "Failed to load activity history.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    pagination.limit,
    filters.action,
    filters.module,
    filters.startDate,
    filters.endDate,
  ]);

  // Fetch summary counts
  const fetchSummary = useCallback(async () => {
    try {
      setSummaryLoading(true);

      const actions = ["", "CREATE", "UPDATE", "DELETE"];

      const results = await Promise.all(
        actions.map(async (action) => {
          const params = new URLSearchParams({ limit: "1" });

          if (action) {
            params.set("action", action);
          }

          const response = await fetch(
            `/api/activity-logs?${params.toString()}`,
          );

          if (!response.ok) {
            throw new Error("Failed to fetch activity summary.");
          }

          return response.json();
        }),
      );

      setSummary({
        total: results[0].pagination.total,
        create: results[1].pagination.total,
        update: results[2].pagination.total,
        delete: results[3].pagination.total,
      });
    } catch (error) {
      console.error("Activity summary fetch error:", error);

      toast.add({
        title: "Failed to load activity summary.",
        type: "error",
      });
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  // Load logs when page or applied filters change
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Load summary once
  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  // Get logged-in user's role
  useEffect(() => {
    const fetchUserRole = async () => {
      const session = await getSession();
      setUserRole(session?.user?.role ?? "");
    };

    fetchUserRole();
  }, []);

  const handleFilterChange = (newFilters: ActivityFiltersType) => {
    setFilters(newFilters);

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters(initialFilters);

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  // Change page
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      page,
    }));
  };

  // Refresh data
  const handleRefresh = () => {
    fetchLogs();
    fetchSummary();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Activity History
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Track all activities performed in the system.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={loading || summaryLoading}
        >
          <RefreshCw
            className={`mr-2 size-4 ${
              loading || summaryLoading ? "animate-spin" : ""
            }`}
          />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <ActivitySummary summary={summary} loading={summaryLoading} />

      {/* Filters */}
      <ActivityFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Activity Table */}
      <ActivityTable
        logs={logs}
        loading={loading}
        search={filters.search}
        role={userRole}
        onView={setSelectedLog}
      />

      {/* Pagination */}
      <ActivityPagination
        pagination={pagination}
        onPageChange={handlePageChange}
        loading={loading}
      />

      {/* Details Modal */}
      <ActivityDetailsModal
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
