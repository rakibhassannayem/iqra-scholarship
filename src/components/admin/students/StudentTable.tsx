"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Eye,
  Pencil,
  Trash2,
  Copy,
  Check,
  Filter,
  X,
  School,
  GraduationCap,
  Calendar,
} from "lucide-react";

export type Student = {
  id: number;
  studentId: string;
  name: string;
  class: number;
  roll: number;
  institutionId: number;
  institutionName: string;
  institutionEiin?: string;
  scholarshipId?: number | null;
  scholarshipName?: string | null;
  createdAt: string;
};

type StudentTableProps = {
  students: Student[];
  institutions: {
    id: number;
    name: string;
    eiin: string;
  }[];
  onView: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
};

export default function StudentTable({
  students,
  institutions,
  onView,
  onEdit,
  onDelete,
}: StudentTableProps) {
  const [search, setSearch] = useState("");
  const [selectedInstitution, setSelectedInstitution] = useState<string>("all");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedScholarship, setSelectedScholarship] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Extract distinct scholarships from data
  const distinctScholarships = useMemo(() => {
    const map = new Map<string, string>();
    students.forEach((s) => {
      if (s.scholarshipName) {
        map.set(s.scholarshipName, s.scholarshipName);
      }
    });
    return Array.from(map.values());
  }, [students]);

  // Filtering
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // Search query filter
      const q = search.trim().toLowerCase();
      if (q) {
        const matchesName = student.name.toLowerCase().includes(q);
        const matchesId = student.studentId.toLowerCase().includes(q);
        const matchesRoll = String(student.roll).includes(q);
        const matchesInst = student.institutionName?.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesRoll && !matchesInst) {
          return false;
        }
      }

      // Institution filter
      if (
        selectedInstitution !== "all" &&
        String(student.institutionId) !== selectedInstitution
      ) {
        return false;
      }

      // Class filter
      if (selectedClass !== "all" && String(student.class) !== selectedClass) {
        return false;
      }

      // Scholarship filter
      if (
        selectedScholarship !== "all" &&
        student.scholarshipName !== selectedScholarship
      ) {
        return false;
      }

      return true;
    });
  }, [students, search, selectedInstitution, selectedClass, selectedScholarship]);

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedInstitution !== "all" ||
    selectedClass !== "all" ||
    selectedScholarship !== "all";

  function clearFilters() {
    setSearch("");
    setSelectedInstitution("all");
    setSelectedClass("all");
    setSelectedScholarship("all");
  }

  async function handleCopy(id: string) {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by student name, ID, roll or school..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Institution Filter */}
          <select
            value={selectedInstitution}
            onChange={(e) => setSelectedInstitution(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="all">All Institutions</option>
            {institutions.map((inst) => (
              <option key={inst.id} value={String(inst.id)}>
                {inst.name}
              </option>
            ))}
          </select>

          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="all">All Classes</option>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((cls) => (
              <option key={cls} value={String(cls)}>
                Class {cls}
              </option>
            ))}
          </select>

          {/* Scholarship Filter */}
          {distinctScholarships.length > 0 && (
            <select
              value={selectedScholarship}
              onChange={(e) => setSelectedScholarship(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="all">All Scholarships</option>
              {distinctScholarships.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          )}

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-9 gap-1 px-2.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
        <span>
          Showing{" "}
          <strong className="text-foreground">{filteredStudents.length}</strong>{" "}
          of {students.length} registrations
        </span>
        {hasActiveFilters && (
          <span className="text-primary font-medium">Filtered results</span>
        )}
      </div>

      {/* Table */}
      {filteredStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <GraduationCap className="size-12 text-muted-foreground/40" />
          <h3 className="mt-4 text-base font-semibold">No students found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {hasActiveFilters
              ? "No student matches your search or filter criteria."
              : "No student registrations have been added yet."}
          </p>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="mt-4 gap-1.5"
            >
              <X className="size-3.5" /> Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3.5 font-semibold">Student Name & ID</th>
                  <th className="px-4 py-3.5 font-semibold">Institution</th>
                  <th className="px-4 py-3.5 font-semibold">Class & Roll</th>
                  <th className="px-4 py-3.5 font-semibold">Scholarship</th>
                  <th className="px-4 py-3.5 font-semibold">Registered At</th>
                  <th className="px-4 py-3.5 text-right font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {filteredStudents.map((student) => {
                  const isCopied = copiedId === student.studentId;
                  const regDate = student.createdAt
                    ? new Date(student.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—";

                  return (
                    <tr
                      key={student.id}
                      className="transition-colors hover:bg-muted/40"
                    >
                      {/* Name & ID */}
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-foreground">
                          {student.name}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <Badge
                            variant="secondary"
                            className="font-mono text-[11px] font-medium"
                          >
                            {student.studentId}
                          </Badge>
                          <button
                            type="button"
                            onClick={() => handleCopy(student.studentId)}
                            title="Copy Student ID"
                            aria-label="Copy Student ID"
                            className="rounded p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                          >
                            {isCopied ? (
                              <Check className="size-3 text-green-600" />
                            ) : (
                              <Copy className="size-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Institution */}
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-foreground">
                          {student.institutionName}
                        </div>
                        {student.institutionEiin && (
                          <span className="font-mono text-xs text-muted-foreground">
                            EIIN: {student.institutionEiin}
                          </span>
                        )}
                      </td>

                      {/* Class & Roll */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            Class {student.class}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Roll: <strong className="text-foreground">{student.roll}</strong>
                          </span>
                        </div>
                      </td>

                      {/* Scholarship */}
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          <GraduationCap className="size-3.5" />
                          {student.scholarshipName ?? "Active Scholarship"}
                        </span>
                      </td>

                      {/* Registered Date */}
                      <td className="px-4 py-3.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="size-3.5 text-muted-foreground" />
                          {regDate}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onView(student)}
                            title="View Details"
                            aria-label="View Details"
                            className="size-8 text-muted-foreground hover:text-foreground"
                          >
                            <Eye className="size-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(student)}
                            title="Edit Student"
                            aria-label="Edit Student"
                            className="size-8 text-muted-foreground hover:text-foreground"
                          >
                            <Pencil className="size-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(student)}
                            title="Delete Student"
                            aria-label="Delete Student"
                            className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
