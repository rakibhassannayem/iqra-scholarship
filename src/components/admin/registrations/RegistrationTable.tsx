"use client";

import { useMemo, useState } from "react";
import { Search, Eye, X, ClipboardList } from "lucide-react";

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
import type { Registration } from "@/types/registration";

export type { Registration };

type RegistrationTableProps = {
  registrations: Registration[];
  loading: boolean;
  onView: (registration: Registration) => void;
};

function convertToEnglishDigits(value: string) {
  const banglaDigits = "০১২৩৪৫৬৭৮৯";
  const arabicDigits = "٠١٢٣٥٦٧٨٩";

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
    const rawSearch = search.trim();
    const normalizedSearch = convertToEnglishDigits(rawSearch).toLowerCase();

    return registrations.filter((registration) => {
      const studentId = registration.studentId.toLowerCase();
      const studentName = registration.studentName.toLowerCase();
      const institutionName = registration.institutionName.toLowerCase();
      const rollNumber = String(registration.studentRoll);

      const matchesSearch =
        !rawSearch ||
        studentId.includes(normalizedSearch) ||
        studentName.includes(rawSearch.toLowerCase()) ||
        institutionName.includes(rawSearch.toLowerCase()) ||
        rollNumber === normalizedSearch;

      const matchesStatus =
        statusFilter === "all" || registration.paymentStatus === statusFilter;

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span>Student Registrations</span>
            <Badge variant="secondary">
              {filteredRegistrations.length} of {registrations.length} total
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search ID, name, roll, institution..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9 pr-9"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="all">All Payment</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>

            <select
              value={classFilter}
              onChange={(event) => setClassFilter(event.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="all">All Classes</option>
              {Array.from({ length: 12 }, (_, index) => index + 1).map(
                (classNumber) => (
                  <option key={classNumber} value={String(classNumber)}>
                    Class {classNumber}
                  </option>
                ),
              )}
            </select>

            {scholarships.length > 0 && (
              <select
                value={scholarshipFilter}
                onChange={(event) => setScholarshipFilter(event.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="all">All Scholarships</option>
                {scholarships.map(([id, name]) => (
                  <option key={id} value={String(id)}>
                    {name}
                  </option>
                ))}
              </select>
            )}

            {(search ||
              statusFilter !== "all" ||
              classFilter !== "all" ||
              scholarshipFilter !== "all") && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setClassFilter("all");
                  setScholarshipFilter("all");
                }}
              >
                Reset
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Loading registrations...
          </p>
        ) : filteredRegistrations.length === 0 ? (
          <div className="py-10 text-center">
            <ClipboardList className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-3 font-medium">No registrations found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {search ||
              statusFilter !== "all" ||
              classFilter !== "all" ||
              scholarshipFilter !== "all"
                ? "Try adjusting your search filters."
                : "No student registrations have been recorded yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Institution</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Roll</TableHead>
                  <TableHead>Scholarship</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Registered At</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredRegistrations.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {registration.studentName}
                        </p>
                        <p className="font-mono text-xs text-muted-foreground">
                          {registration.studentId}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>{registration.institutionName}</TableCell>

                    <TableCell>
                      <Badge variant="outline">
                        Class {registration.studentClass}
                      </Badge>
                    </TableCell>

                    <TableCell className="font-mono text-xs">
                      {registration.studentRoll}
                    </TableCell>

                    <TableCell>{registration.scholarshipName}</TableCell>

                    <TableCell>৳{registration.registrationFee}</TableCell>

                    <TableCell className="whitespace-nowrap">
                      {formatDate(registration.registeredAt)}
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

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="View registration details"
                          onClick={() => onView(registration)}
                        >
                          <Eye className="size-4" />
                        </Button>
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
