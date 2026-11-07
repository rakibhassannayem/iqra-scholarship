"use client";

import { Pencil, BookOpen, Loader2, Calendar } from "lucide-react";
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
import type { Scholarship } from "@/types/scholarship";

export type { Scholarship };

type ScholarshipTableProps = {
  scholarships: Scholarship[];
  loading: boolean;
  onEdit: (scholarship: Scholarship) => void;
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
  onToggleActive,
  togglingId,
}: ScholarshipTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>All Scholarships</span>
          <Badge variant="secondary">{scholarships.length} total</Badge>
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
              Create your first scholarship program to get started.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Program</TableHead>
                <TableHead>Academic Year</TableHead>
                <TableHead>Eligibility</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
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
                      <p className="max-w-80 truncate text-xs text-muted-foreground">
                        {scholarship.description}
                      </p>
                    </TableCell>

                    <TableCell>{scholarship.academicYear}</TableCell>

                    <TableCell>
                      <Badge variant="outline">
                        Class {scholarship.eligibilityClass}
                      </Badge>
                    </TableCell>

                    <TableCell>৳{scholarship.registrationFee}</TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="size-3.5" />
                        <span>{formatDate(scholarship.endDate)}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={scholarship.isActive}
                          disabled={isToggling}
                          onCheckedChange={(checked) =>
                            onToggleActive?.(scholarship, checked)
                          }
                          aria-label={`Toggle active status for ${scholarship.name}`}
                        />
                        {isToggling ? (
                          <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
                        ) : (
                          <span
                            className={cn(
                              "text-xs font-medium",
                              scholarship.isActive
                                ? "text-green-600 dark:text-green-400"
                                : "text-muted-foreground",
                            )}
                          >
                            {scholarship.isActive ? "Active" : "Inactive"}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          aria-label={`Edit ${scholarship.name}`}
                          onClick={() => onEdit(scholarship)}
                        >
                          <Pencil className="size-4" />
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
