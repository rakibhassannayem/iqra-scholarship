"use client";

import { Pencil, Trash2, BookOpen, Loader2, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "cn";

export type Scholarship = {
  id: number;
  name: string;
  description: string;
  academicYear: string;
  endDate: string;
  eligibility: string;
  isActive: boolean;
  examCenter: string | null;
  examDate: string | null;
  examTime: string | null;
  createdAt: string;
  updatedAt: string;
  examStartTime: string | null;
  examEndTime: string | null;
};

type ScholarshipTableProps = {
  scholarships: Scholarship[];
  loading: boolean;
  onEdit: (scholarship: Scholarship) => void;
  onDelete: (scholarship: Scholarship) => void;
  onToggleActive?: (scholarship: Scholarship, active: boolean) => void;
  togglingId?: number | null;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ScholarshipTable({
  scholarships,
  loading,
  onEdit,
  onDelete,
  onToggleActive,
  togglingId,
}: ScholarshipTableProps) {
  const activeScholarship = scholarships.find((s) => s.isActive);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-2">
          <span>All Scholarships</span>
          <div className="flex items-center gap-2">
            {activeScholarship ? (
              <Badge
                variant="outline"
                className="border-emerald-500/40 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
              >
                <span className="mr-1.5 size-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                Active: {activeScholarship.name}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">
                No active scholarship
              </Badge>
            )}
            <Badge variant="secondary">{scholarships.length} total</Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Loading scholarships...
          </p>
        ) : scholarships.length === 0 ? (
          <div className="py-10 text-center">
            <BookOpen className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-3 font-medium">No scholarships yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first scholarship to see it here.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Scholarship</TableHead>
                <TableHead>Academic Year</TableHead>
                <TableHead>Registration Deadline</TableHead>
                <TableHead>
                  <div className="flex flex-col">
                    <span>Status</span>
                    <span className="text-[10px] font-normal text-muted-foreground">
                      (Max 1 active)
                    </span>
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {scholarships.map((scholarship) => {
                const isToggling = togglingId === scholarship.id;

                return (
                  <TableRow key={scholarship.id}>
                    <TableCell>
                      <p className="font-medium">{scholarship.name}</p>
                      <p className="mt-1 max-w-64 truncate text-xs text-muted-foreground">
                        {scholarship.description}
                      </p>
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        {scholarship.academicYear}
                      </Badge>
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Calendar className="size-3.5 text-muted-foreground" />
                        <span>{formatDate(scholarship.endDate)}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Switch
                          id={`scholarship-toggle-${scholarship.id}`}
                          checked={scholarship.isActive}
                          disabled={isToggling || !onToggleActive}
                          onCheckedChange={(checked) => {
                            if (onToggleActive && !isToggling) {
                              onToggleActive(scholarship, Boolean(checked));
                            }
                          }}
                          aria-label={`Toggle active status for ${scholarship.name}`}
                        />

                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
                            scholarship.isActive
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-500/30"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {isToggling ? (
                            <Loader2 className="size-3 animate-spin text-muted-foreground" />
                          ) : (
                            <span
                              className={cn(
                                "size-1.5 rounded-full",
                                scholarship.isActive
                                  ? "bg-emerald-500 animate-pulse"
                                  : "bg-muted-foreground/50",
                              )}
                            />
                          )}
                          <span>
                            {isToggling
                              ? "Updating..."
                              : scholarship.isActive
                                ? "Active"
                                : "Inactive"}
                          </span>
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          aria-label={`Edit ${scholarship.name}`}
                          onClick={() => onEdit(scholarship)}
                        >
                          <Pencil className="size-4" />
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          aria-label={`Delete ${scholarship.name}`}
                          onClick={() => onDelete(scholarship)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
