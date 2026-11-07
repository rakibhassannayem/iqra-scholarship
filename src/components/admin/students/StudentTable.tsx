"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Eye,
  Pencil,
  Copy,
  Check,
  Filter,
  X,
  School,
  GraduationCap,
  Calendar,
} from "lucide-react";
import type { Student } from "@/types/student";

export type { Student };

type StudentTableProps = {
  students: Student[];
  institutions: {
    id: number;
    name: string;
    eiin: string;
  }[];
  onView: (student: Student) => void;
  onEdit: (student: Student) => void;
};

export default function StudentTable({
  students,
  institutions,
  onView,
  onEdit,
}: StudentTableProps) {
  const [search, setSearch] = useState("");
  const [selectedInstitution, setSelectedInstitution] = useState<string>("all");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedScholarship, setSelectedScholarship] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Extract distinct scholarships from data
  const availableScholarships = useMemo(() => {
    const list: { id: number; name: string }[] = [];
    const seen = new Set<number>();
    students.forEach((s) => {
      if (s.scholarshipId && s.scholarshipName && !seen.has(s.scholarshipId)) {
        seen.add(s.scholarshipId);
        list.push({ id: s.scholarshipId, name: s.scholarshipName });
      }
    });
    return list;
  }, [students]);

  // Filter logic
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // Text search (name, studentId, roll)
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        student.name.toLowerCase().includes(q) ||
        student.studentId.toLowerCase().includes(q) ||
        String(student.roll).includes(q) ||
        student.institutionName.toLowerCase().includes(q);

      // Institution filter
      const matchesInstitution =
        selectedInstitution === "all" ||
        String(student.institutionId) === selectedInstitution;

      // Class filter
      const matchesClass =
        selectedClass === "all" || String(student.class) === selectedClass;

      // Scholarship filter
      const matchesScholarship =
        selectedScholarship === "all" ||
        (selectedScholarship === "none"
          ? !student.scholarshipId
          : String(student.scholarshipId) === selectedScholarship);

      return (
        matchesSearch &&
        matchesInstitution &&
        matchesClass &&
        matchesScholarship
      );
    });
  }, [
    students,
    search,
    selectedInstitution,
    selectedClass,
    selectedScholarship,
  ]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const hasActiveFilters =
    Boolean(search) ||
    selectedInstitution !== "all" ||
    selectedClass !== "all" ||
    selectedScholarship !== "all";

  const resetFilters = () => {
    setSearch("");
    setSelectedInstitution("all");
    setSelectedClass("all");
    setSelectedScholarship("all");
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by student name, ID, roll..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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

          {/* Quick counts */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>
              Showing <strong>{filteredStudents.length}</strong> of{" "}
              {students.length} students
            </span>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-7 px-2 text-xs text-primary"
              >
                Reset filters
              </Button>
            )}
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 pt-2 border-t">
          {/* Institution Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
              <School className="size-3" /> Institution
            </label>
            <select
              value={selectedInstitution}
              onChange={(e) => setSelectedInstitution(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="all">All Institutions</option>
              {institutions.map((inst) => (
                <option key={inst.id} value={String(inst.id)}>
                  {inst.name} ({inst.eiin})
                </option>
              ))}
            </select>
          </div>

          {/* Class Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
              <GraduationCap className="size-3" /> Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="all">All Classes</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((cls) => (
                <option key={cls} value={String(cls)}>
                  Class {cls}
                </option>
              ))}
            </select>
          </div>

          {/* Scholarship Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
              <Calendar className="size-3" /> Scholarship Program
            </label>
            <select
              value={selectedScholarship}
              onChange={(e) => setSelectedScholarship(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="all">All Scholarships</option>
              <option value="none">No Scholarship (Direct)</option>
              {availableScholarships.map((sch) => (
                <option key={sch.id} value={String(sch.id)}>
                  {sch.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      {filteredStudents.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center shadow-sm">
          <Filter className="mx-auto size-10 text-muted-foreground/60 mb-3" />
          <h3 className="font-semibold text-foreground">No students found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {hasActiveFilters
              ? "No student matches your current filter criteria. Try clearing some filters."
              : "No students have registered yet. Use the 'Register Student' button above to add one."}
          </p>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="mt-4 text-xs"
            >
              Clear all filters
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Roll</th>
                  <th className="py-3 px-4">Institution</th>
                  <th className="py-3 px-4">Scholarship</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredStudents.map((student) => {
                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      {/* Student ID with copy */}
                      <td className="py-3 px-4 font-mono text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-primary">
                            {student.studentId}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(student.studentId)}
                            title="Copy Student ID"
                            aria-label={`Copy Student ID ${student.studentId}`}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {copiedId === student.studentId ? (
                              <Check className="size-3 text-green-600" />
                            ) : (
                              <Copy className="size-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Name */}
                      <td className="py-3 px-4 font-medium text-foreground">
                        {student.name}
                      </td>

                      {/* Class */}
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-xs">
                          Class {student.class}
                        </Badge>
                      </td>

                      {/* Roll */}
                      <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                        #{student.roll}
                      </td>

                      {/* Institution */}
                      <td className="py-3 px-4 text-muted-foreground">
                        <div className="font-medium text-foreground">
                          {student.institutionName}
                        </div>
                        {student.institutionEiin && (
                          <div className="text-[11px] text-muted-foreground/70">
                            EIIN: {student.institutionEiin}
                          </div>
                        )}
                      </td>

                      {/* Scholarship */}
                      <td className="py-3 px-4">
                        {student.scholarshipName ? (
                          <Badge
                            variant="secondary"
                            className="text-xs font-normal"
                          >
                            {student.scholarshipName}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground/50 italic">
                            None (Direct)
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
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
