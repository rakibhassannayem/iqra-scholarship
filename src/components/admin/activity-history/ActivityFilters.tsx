"use client";

import { Filter, RotateCcw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { ActivityFilters as ActivityFiltersType } from "@/types/activity-log";

type ActivityFiltersProps = {
  filters: ActivityFiltersType;
  onChange: (filters: ActivityFiltersType) => void;
  onReset: () => void;
};

export default function ActivityFilters({
  filters,
  onChange,
  onReset,
}: ActivityFiltersProps) {
  const updateFilter = (key: keyof ActivityFiltersType, value: string) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Filter className="size-5 text-muted-foreground" />
        <h3 className="font-semibold">Filter Activities</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {/* Search */}
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Action */}
        <Select
          value={filters.action || "all"}
          onValueChange={(value) =>
            updateFilter("action", !value || value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue>
              {filters.action
                ? filters.action === "CREATE"
                  ? "Create"
                  : filters.action === "UPDATE"
                    ? "Update"
                    : "Delete"
                : "All Actions"}
            </SelectValue>
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="CREATE">Create</SelectItem>
            <SelectItem value="UPDATE">Update</SelectItem>
            <SelectItem value="DELETE">Delete</SelectItem>
          </SelectContent>
        </Select>

        {/* Module */}
        <Select
          value={filters.module || "all"}
          onValueChange={(value) =>
            updateFilter("module", !value || value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue>
              {filters.module === "STUDENT"
                ? "Student"
                : filters.module === "INSTITUTION"
                  ? "Institution"
                  : filters.module === "SCHOLARSHIP"
                    ? "Scholarship"
                    : filters.module === "SCHOLARSHIP_CATEGORY"
                      ? "Scholarship Category"
                      : filters.module === "SCHOLARSHIP_GRANT"
                        ? "Scholarship Grant"
                        : filters.module === "PRIZE"
                          ? "Prize"
                          : filters.module === "NOTICE"
                            ? "Notice"
                            : "All Modules"}
            </SelectValue>
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            <SelectItem value="STUDENT">Student</SelectItem>
            <SelectItem value="INSTITUTION">Institution</SelectItem>
            <SelectItem value="SCHOLARSHIP">Scholarship</SelectItem>
            <SelectItem value="SCHOLARSHIP_CATEGORY">
              Scholarship Category
            </SelectItem>
            <SelectItem value="SCHOLARSHIP_GRANT">Scholarship Grant</SelectItem>
            <SelectItem value="PRIZE">Prize</SelectItem>
            <SelectItem value="NOTICE">Notice</SelectItem>
          </SelectContent>
        </Select>

        {/* Start Date */}
        <Input
          type="date"
          value={filters.startDate}
          onChange={(e) => updateFilter("startDate", e.target.value)}
          aria-label="Start date"
        />

        {/* End Date */}
        <Input
          type="date"
          value={filters.endDate}
          onChange={(e) => updateFilter("endDate", e.target.value)}
          aria-label="End date"
        />
      </div>

      <div className="mt-4 flex justify-end">
        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="mr-2 size-4" />
          Reset
        </Button>
      </div>
    </div>
  );
}
