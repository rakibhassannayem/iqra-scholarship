"use client";

import { useEffect, useMemo, useState } from "react";
import { Award, Building2, Search, User, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Grant } from "./GrantTable";

export type Registration = {
  id: number;
  studentDbId: number;
  studentId: string;
  studentName: string;
  studentClass?: number;
  studentRoll?: number;
  institutionName: string;
  scholarshipId: number;
  scholarshipName: string;
};

export type ScholarshipCategory = {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
};

export type GrantFormValues = {
  studentId: number;
  scholarshipId: number;
  categoryId: number;
};

type GrantFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registrations: Registration[];
  categories: ScholarshipCategory[];
  editingGrant?: Grant | null;
  saving: boolean;
  error: string;
  onSubmit: (values: GrantFormValues) => void;
};

export default function GrantForm({
  open,
  onOpenChange,
  registrations,
  categories,
  editingGrant,
  saving,
  error,
  onSubmit,
}: GrantFormProps) {
  const [studentDbId, setStudentDbId] = useState("");
  const [scholarshipId, setScholarshipId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // Filters for student selection
  const [selectedInstitution, setSelectedInstitution] = useState("all");
  const [studentSearch, setStudentSearch] = useState("");

  const isEditing = Boolean(editingGrant);

  // Sync state when dialog opens or editingGrant changes
  useEffect(() => {
    if (open) {
      if (editingGrant) {
        setStudentDbId(String(editingGrant.studentDbId));
        setScholarshipId(String(editingGrant.scholarshipId));
        setCategoryId(String(editingGrant.categoryId));
      } else {
        setStudentDbId("");
        setScholarshipId("");
        setCategoryId("");
      }
      setSelectedInstitution("all");
      setStudentSearch("");
    }
  }, [open, editingGrant]);

  // Distinct institutions for filter dropdown
  const institutions = useMemo(() => {
    return Array.from(new Set(registrations.map((r) => r.institutionName)))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, "bn"));
  }, [registrations]);

  // Unique registered students
  const uniqueStudents = useMemo(() => {
    return Array.from(
      new Map(
        registrations.map((registration) => [
          registration.studentDbId,
          registration,
        ]),
      ).values(),
    );
  }, [registrations]);

  // Filtered students according to institution and search query
  const filteredStudents = useMemo(() => {
    const q = studentSearch.trim().toLowerCase();

    return uniqueStudents.filter((student) => {
      const matchesInstitution =
        selectedInstitution === "all" ||
        student.institutionName === selectedInstitution;

      if (!matchesInstitution) return false;

      if (!q) return true;

      const nameMatch = student.studentName.toLowerCase().includes(q);
      const idMatch = student.studentId.toLowerCase().includes(q);
      const rollMatch = String(student.studentRoll ?? "").includes(q);
      const classMatch = String(student.studentClass ?? "").includes(q);
      const instMatch = student.institutionName.toLowerCase().includes(q);

      return nameMatch || idMatch || rollMatch || classMatch || instMatch;
    });
  }, [uniqueStudents, selectedInstitution, studentSearch]);

  // Currently selected student object
  const selectedStudent = useMemo(() => {
    return (
      uniqueStudents.find((s) => String(s.studentDbId) === studentDbId) ?? null
    );
  }, [uniqueStudents, studentDbId]);

  const availableScholarships = useMemo(() => {
    return registrations.filter(
      (registration) => String(registration.studentDbId) === studentDbId,
    );
  }, [registrations, studentDbId]);

  function handleStudentChange(value: string | null) {
    const nextStudentId = value ?? "";
    setStudentDbId(nextStudentId);

    // Auto-select scholarship if the student has only 1 registered scholarship
    const studentScholarships = registrations.filter(
      (r) => String(r.studentDbId) === nextStudentId,
    );
    if (studentScholarships.length === 1) {
      setScholarshipId(String(studentScholarships[0].scholarshipId));
    } else {
      setScholarshipId("");
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!studentDbId || !scholarshipId || !categoryId) {
      return;
    }

    onSubmit({
      studentId: Number(studentDbId),
      scholarshipId: Number(scholarshipId),
      categoryId: Number(categoryId),
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Award className="size-5" />
            </div>
            <div>
              <DialogTitle>
                {isEditing ? "Edit Scholarship Grant" : "Grant Scholarship"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? `Update grant details for ${editingGrant?.studentName}.`
                  : "প্রতিষ্ঠান নির্বাচন ও সার্চ করে শিক্ষার্থী খুঁজে scholarship grant করুন।"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isEditing && editingGrant ? (
            /* Read-only preview for student & scholarship during edit */
            <div className="rounded-lg border bg-muted/40 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm">
                    {editingGrant.studentName}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    ID: {editingGrant.studentId}
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <div>{editingGrant.institutionName}</div>
                  <div className="font-medium text-foreground">
                    {editingGrant.scholarshipName}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* 1. Institution Selection (Full width, on top) */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="institution-select"
                  className="text-xs font-semibold flex items-center gap-1.5 text-foreground"
                >
                  <Building2 className="size-3.5 text-primary" />
                  Institution (প্রতিষ্ঠান নির্বাচন করুন)
                </Label>
                <Select
                  value={selectedInstitution}
                  onValueChange={(val) => {
                    setSelectedInstitution(val ?? "all");
                  }}
                >
                  <SelectTrigger id="institution-select" className="w-full text-xs">
                    <SelectValue placeholder="All Institutions (সকল প্রতিষ্ঠান)" />
                  </SelectTrigger>
                  <SelectContent className="max-h-56">
                    <SelectItem value="all">
                      সকল প্রতিষ্ঠান (All Institutions - {institutions.length}টি)
                    </SelectItem>
                    {institutions.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 2. Search Student (Full width, underneath Institution) */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="student-search-input"
                  className="text-xs font-semibold flex items-center gap-1.5 text-foreground"
                >
                  <Search className="size-3.5 text-primary" />
                  Search Student (শিক্ষার্থী অনুসন্ধান - নাম, আইডি বা রোল)
                </Label>
                <div className="relative">
                  <Input
                    id="student-search-input"
                    type="text"
                    placeholder="যেমন: শিক্ষার্থীর নাম, আইডি (ID) বা রোল লিখুন..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="text-xs pr-7"
                  />
                  {studentSearch && (
                    <button
                      type="button"
                      onClick={() => setStudentSearch("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                      title="Clear search"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 3. Student Selection */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="student-select"
                    className="text-xs font-semibold text-foreground"
                  >
                    Select Student (শিক্ষার্থী নির্বাচন করুন) *
                  </Label>
                  <span className="text-xs text-muted-foreground font-mono">
                    {filteredStudents.length} of {uniqueStudents.length} students
                  </span>
                </div>
                <Select
                  value={studentDbId}
                  onValueChange={handleStudentChange}
                  required
                >
                  <SelectTrigger id="student-select" className="w-full text-xs">
                    <SelectValue
                      placeholder={
                        filteredStudents.length === 0
                          ? "কোনো শিক্ষার্থী পাওয়া যায়নি"
                          : "শিক্ষার্থী নির্বাচন করুন"
                      }
                    >
                      {selectedStudent
                        ? `${selectedStudent.studentName} (${selectedStudent.studentId})`
                        : "শিক্ষার্থী নির্বাচন করুন"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {filteredStudents.length === 0 ? (
                      <div className="p-4 text-center text-xs text-muted-foreground">
                        সার্চ বা প্রতিষ্ঠানের সাথে মিল রেখে কোনো শিক্ষার্থী পাওয়া যায়নি।
                      </div>
                    ) : (
                      filteredStudents.map((registration) => {
                        const classInfo = registration.studentClass
                          ? `Class ${registration.studentClass}`
                          : "";
                        const rollInfo = registration.studentRoll
                          ? `Roll ${registration.studentRoll}`
                          : "";
                        const extra = [classInfo, rollInfo]
                          .filter(Boolean)
                          .join(", ");

                        return (
                          <SelectItem
                            key={registration.studentDbId}
                            value={String(registration.studentDbId)}
                          >
                            <div className="flex flex-col text-left py-0.5">
                              <span className="font-semibold text-xs text-foreground">
                                {registration.studentName}
                              </span>
                              <span className="text-[11px] text-muted-foreground">
                                ID: {registration.studentId}{extra ? ` • ${extra}` : ""} • {registration.institutionName}
                              </span>
                            </div>
                          </SelectItem>
                        );
                      })
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Student Confirmation Card */}
              {selectedStudent && (
                <div className="rounded-xl border bg-primary/5 border-primary/20 p-3 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <User className="size-4 text-primary" />
                      <span className="font-semibold text-sm text-foreground">
                        {selectedStudent.studentName}
                      </span>
                    </div>
                    <Badge variant="outline" className="font-mono text-[11px] bg-background">
                      {selectedStudent.studentId}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Building2 className="size-3 text-muted-foreground" />
                      {selectedStudent.institutionName}
                    </span>
                    {selectedStudent.studentClass && (
                      <span className="bg-background px-1.5 py-0.5 rounded border text-[11px]">
                        Class: {selectedStudent.studentClass}
                      </span>
                    )}
                    {selectedStudent.studentRoll && (
                      <span className="bg-background px-1.5 py-0.5 rounded border text-[11px]">
                        Roll: {selectedStudent.studentRoll}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Registered Scholarship Selection */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  Registered Scholarship Program *
                </Label>
                <Select
                  value={scholarshipId}
                  onValueChange={(value) => setScholarshipId(value ?? "")}
                  disabled={!studentDbId || availableScholarships.length === 0}
                  required
                >
                  <SelectTrigger className="w-full text-xs">
                    <SelectValue placeholder="Select a scholarship">
                      {availableScholarships.find(
                        (r) => String(r.scholarshipId) === scholarshipId,
                      )?.scholarshipName ?? "Select a scholarship"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {availableScholarships.map((registration) => (
                      <SelectItem
                        key={registration.scholarshipId}
                        value={String(registration.scholarshipId)}
                      >
                        {registration.scholarshipName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {studentDbId && availableScholarships.length === 0 && (
                  <p className="text-xs text-destructive">
                    This student has no registered scholarship program.
                  </p>
                )}
              </div>
            </>
          )}

          {/* Scholarship Category Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Scholarship Category (ক্যাটাগরি) *
            </Label>
            <Select
              value={categoryId}
              onValueChange={(value) => setCategoryId(value ?? "")}
              required
            >
              <SelectTrigger className="w-full text-xs">
                <SelectValue placeholder="Select a category">
                  {categories.find(
                    (category) => String(category.id) === categoryId,
                  )?.name ?? "Select a category"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    <div className="flex flex-col text-left py-0.5">
                      <span className="font-medium text-xs">{category.name}</span>
                      {category.description && (
                        <span className="text-[11px] text-muted-foreground line-clamp-1">
                          {category.description}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <p role="alert" className="text-xs text-destructive">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              disabled={saving}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={saving}>
              {saving
                ? isEditing
                  ? "Updating..."
                  : "Granting..."
                : isEditing
                  ? "Update Grant"
                  : "Grant Scholarship"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
