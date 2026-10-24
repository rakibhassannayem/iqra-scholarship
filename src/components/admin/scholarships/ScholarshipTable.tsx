"use client";

import { Pencil, Trash2, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Scholarship = {
  id: number;
  name: string;
  description: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  amount: number;
  eligibility: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type ScholarshipTableProps = {
  scholarships: Scholarship[];
  loading: boolean;
  onEdit: (scholarship: Scholarship) => void;
  onDelete: (scholarship: Scholarship) => void;
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
              Create your first scholarship to see it here.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Scholarship</TableHead>
                <TableHead>Academic Year</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Registration Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {scholarships.map((scholarship) => (
                <TableRow key={scholarship.id}>
                  <TableCell>
                    <p className="font-medium">{scholarship.name}</p>
                    <p className="mt-1 max-w-52 truncate text-xs text-muted-foreground">
                      {scholarship.description}
                    </p>
                  </TableCell>

                  <TableCell>{scholarship.academicYear}</TableCell>

                  <TableCell className="whitespace-nowrap">
                    ৳{scholarship.amount.toLocaleString("en-BD")}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <p>{formatDate(scholarship.startDate)}</p>
                    <p className="text-xs text-muted-foreground">
                      to {formatDate(scholarship.endDate)}
                    </p>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={scholarship.isActive ? "default" : "secondary"}
                    >
                      {scholarship.isActive ? "Active" : "Inactive"}
                    </Badge>
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
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
