"use client";

import { useMemo, useState } from "react";
import { Search, Eye, Check, X, RotateCcw, ClipboardList } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Registration = {
  id: number;
  studentDbId: number;
  studentId: string;
  studentName: string;
  studentClass: number;
  studentRoll: number;
  institutionId: number;
  institutionName: string;
  scholarshipId: number;
  scholarshipName: string;
  registrationFee: number;
  status: "Pending" | "Approved" | "Cancelled";
  paymentStatus: "Unpaid" | "Paid";
  registeredAt: string;
};

type RegistrationTableProps = {
  registrations: Registration[];
  loading: boolean;
  onView: (registration: Registration) => void;
  onStatusChange: (
    registration: Registration,
    status: Registration["status"],
  ) => void;
};

function convertToEnglishDigits(value: string) {
  const banglaDigits = "০১২৩৪৫৬৭৮৯";
  const arabicDigits = "٠١٢٣٤٥٦٧٨٩";

  return value
    .replace(/[০-৯]/g, (digit) => String(banglaDigits.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(arabicDigits.indexOf(digit)));
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function RegistrationTable({
  registrations,
  loading,
  onView,
  onStatusChange,
}: RegistrationTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [scholarshipFilter, setScholarshipFilter] = useState("all");

  const scholarships = useMemo(() => {
    return Array.from(
      new Map(
        registrations.map((registration) => [
          registration.scholarshipId,
          registration.scholarshipName,
        ]),
      ),
    );
  }, [registrations]);

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((registration) => {
      const query = convertToEnglishDigits(search.trim()).toLowerCase();

      const matchesSearch =
        !query ||
        registration.studentName.toLowerCase().includes(query) ||
        registration.studentId.toLowerCase().includes(query) ||
        registration.institutionName.toLowerCase().includes(query) ||
        String(registration.studentRoll).includes(query);

      const matchesStatus =
        statusFilter === "all" || registration.status === statusFilter;

      const matchesClass =
        classFilter === "all" ||
        String(registration.studentClass) === classFilter;

      const matchesScholarship =
        scholarshipFilter === "all" ||
        String(registration.scholarshipId) === scholarshipFilter;

      return (
        matchesSearch && matchesStatus && matchesClass && matchesScholarship
      );
    });
  }, [registrations, search, statusFilter, classFilter, scholarshipFilter]);

  const hasActiveFilters =
    search.trim() !== "" ||
    statusFilter !== "all" ||
    classFilter !== "all" ||
    scholarshipFilter !== "all";

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setClassFilter("all");
    setScholarshipFilter("all");
  }

  function getStatusVariant(status: Registration["status"]) {
    switch (status) {
      case "Approved":
        return "default";
      case "Cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>All Registrations</span>
          <Badge variant="secondary">
            {filteredRegistrations.length} / {registrations.length}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by student name, ID, roll or institution..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="all">All Classes</option>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((cls) => (
                <option key={cls} value={String(cls)}>
                  Class {cls}
                </option>
              ))}
            </select>

            <select
              value={scholarshipFilter}
              onChange={(e) => setScholarshipFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="all">All Scholarships</option>
              {scholarships.map(([id, name]) => (
                <option key={id} value={String(id)}>
                  {name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearFilters}
              >
                <X className="mr-1 size-4" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Loading registrations...
          </p>
        ) : filteredRegistrations.length === 0 ? (
          <div className="py-10 text-center">
            <ClipboardList className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-3 font-medium">No registrations found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {hasActiveFilters
                ? "Try changing your search or filters."
                : "Scholarship registrations will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Institution</TableHead>
                  <TableHead>Class & Roll</TableHead>
                  <TableHead>Scholarship</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Registered At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredRegistrations.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell>
                      <p className="font-medium">{registration.studentName}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        ID: {registration.studentId}
                      </p>
                    </TableCell>

                    <TableCell>{registration.institutionName}</TableCell>

                    <TableCell className="whitespace-nowrap">
                      <Badge variant="outline">
                        Class {registration.studentClass}
                      </Badge>
                      <span className="ml-2 text-xs text-muted-foreground block mt-1">
                        Roll: {registration.studentRoll}
                      </span>
                    </TableCell>

                    <TableCell>{registration.scholarshipName}</TableCell>

                    <TableCell className="whitespace-nowrap">
                      ৳{registration.registrationFee.toLocaleString("en-BD")}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {formatDate(registration.registeredAt)}
                    </TableCell>

                    <TableCell>
                      <Badge variant={getStatusVariant(registration.status)}>
                        {registration.status}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          registration.paymentStatus === "Paid"
                            ? "default"
                            : "outline"
                        }
                      >
                        {registration.paymentStatus}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          aria-label="View registration"
                          onClick={() => onView(registration)}
                        >
                          <Eye className="size-4" />
                        </Button>

                        {registration.status === "Pending" && (
                          <>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              aria-label="Approve registration"
                              title="Approve"
                              onClick={() =>
                                onStatusChange(registration, "Approved")
                              }
                            >
                              <Check className="size-4 text-green-600" />
                            </Button>

                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              aria-label="Cancel registration"
                              title="Cancel"
                              onClick={() =>
                                onStatusChange(registration, "Cancelled")
                              }
                            >
                              <X className="size-4 text-destructive" />
                            </Button>
                          </>
                        )}

                        {registration.status === "Approved" && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            aria-label="Cancel registration"
                            title="Cancel"
                            onClick={() =>
                              onStatusChange(registration, "Cancelled")
                            }
                          >
                            <X className="size-4 text-destructive" />
                          </Button>
                        )}

                        {registration.status === "Cancelled" && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            aria-label="Restore registration"
                            title="Restore"
                            onClick={() =>
                              onStatusChange(registration, "Approved")
                            }
                          >
                            <RotateCcw className="size-4 text-green-600" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
