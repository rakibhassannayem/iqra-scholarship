"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  Loader2,
  RotateCcw,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "cn";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminResultItem } from "@/types/result";
import type { Category } from "@/types/scholarship-category";

type ResultTableProps = {
  students: AdminResultItem[];
  categories: Category[];
  loading: boolean;
  hasScholarship?: boolean;
  onSaveSingle: (studentId: number, marks: number) => Promise<void>;
  onSaveBulk: (entries: { studentId: number; marks: number }[]) => Promise<void>;
};

function getPredictedCategory(marks: number, categories: Category[]) {
  for (const cat of categories) {
    if (cat.minMarks !== null && cat.maxMarks !== null) {
      if (marks >= cat.minMarks && marks <= cat.maxMarks) {
        return cat;
      }
    } else if (cat.minMarks !== null && cat.maxMarks === null) {
      if (marks >= cat.minMarks) {
        return cat;
      }
    } else if (cat.minMarks === null && cat.maxMarks !== null) {
      if (marks <= cat.maxMarks) {
        return cat;
      }
    }
  }
  return null;
}

export default function ResultTable({
  students,
  categories,
  loading,
  hasScholarship = true,
  onSaveSingle,
  onSaveBulk,
}: ResultTableProps) {
  // Local state for inline editable marks: { [studentDbId]: string }
  const [marksState, setMarksState] = useState<Record<number, string>>({});
  const [savingRows, setSavingRows] = useState<Record<number, boolean>>({});
  const [bulkSaving, setBulkSaving] = useState(false);

  // Initialize marksState whenever students list changes
  useEffect(() => {
    const initialMarks: Record<number, string> = {};
    for (const student of students) {
      initialMarks[student.studentDbId] =
        student.marks !== null && student.marks !== undefined
          ? String(student.marks)
          : "";
    }
    setMarksState(initialMarks);
  }, [students]);

  const handleMarkChange = (studentDbId: number, value: string) => {
    setMarksState((prev) => ({
      ...prev,
      [studentDbId]: value,
    }));
  };

  const handleRowSave = async (studentDbId: number) => {
    const rawVal = marksState[studentDbId]?.trim();
    if (rawVal === "" || rawVal === undefined) return;

    const num = Math.round(Number(rawVal));
    if (Number.isNaN(num) || num < 0) return;

    setSavingRows((prev) => ({ ...prev, [studentDbId]: true }));
    try {
      await onSaveSingle(studentDbId, num);
    } finally {
      setSavingRows((prev) => ({ ...prev, [studentDbId]: false }));
    }
  };

  // Find all students whose marks were changed from their original server value
  const changedStudents = students.filter((s) => {
    const currentVal = marksState[s.studentDbId]?.trim() ?? "";
    const originalVal = s.marks !== null ? String(s.marks) : "";
    return currentVal !== "" && currentVal !== originalVal;
  });

  const handleSaveAll = async () => {
    if (changedStudents.length === 0) return;

    const entries = changedStudents.map((s) => ({
      studentId: s.studentDbId,
      marks: Math.round(Number(marksState[s.studentDbId])),
    }));

    setBulkSaving(true);
    try {
      await onSaveBulk(entries);
    } finally {
      setBulkSaving(false);
    }
  };

  const handleResetChanges = () => {
    const resetMarks: Record<number, string> = {};
    for (const student of students) {
      resetMarks[student.studentDbId] =
        student.marks !== null && student.marks !== undefined
          ? String(student.marks)
          : "";
    }
    setMarksState(resetMarks);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-12 text-center text-muted-foreground">
        <Loader2 className="mb-3 size-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Loading student list & results...</p>
      </div>
    );
  }

  if (!hasScholarship) {
    return (
      <div className="rounded-xl border border-dashed bg-card p-12 text-center text-muted-foreground">
        <p className="text-base font-semibold">কোনো বৃত্তি কর্মসূচি পাওয়া যায়নি</p>
        <p className="mt-1 text-sm">
          ফলাফল ব্যবস্থাপনা শুরু করার আগে একটি বৃত্তি কর্মসূচি তৈরি করুন।
        </p>
        <div className="mt-4">
          <Link
            href="/admin/scholarships"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            বৃত্তি কর্মসূচি তৈরি করুন &rarr;
          </Link>
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-card p-12 text-center text-muted-foreground">
        <p className="text-base font-semibold">কোনো শিক্ষার্থী বা ফলাফল পাওয়া যায়নি</p>
        <p className="mt-1 text-sm">
          নির্বাচিত ফিল্টারের সাথে মিলে এমন কোনো নিবন্ধিত শিক্ষার্থী পাওয়া যায়নি।
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table Toolbar / Bulk Save Banner */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <strong>{students.length}</strong> students. Enter marks below to
          automatically calculate scholarship awards.
        </p>

        {changedStudents.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              {changedStudents.length} unsaved change(s)
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={handleResetChanges}
              disabled={bulkSaving}
              className="gap-1.5"
            >
              <RotateCcw className="size-3.5" />
              Reset
            </Button>

            <Button
              size="sm"
              onClick={handleSaveAll}
              disabled={bulkSaving}
              className="gap-1.5"
            >
              {bulkSaving ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Save className="size-3.5" />
              )}
              Save All ({changedStudents.length})
            </Button>
          </div>
        )}
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto rounded-xl border bg-card shadow-xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">Student ID</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Institution</TableHead>
              <TableHead className="w-24">Class / Roll</TableHead>
              <TableHead className="w-36">Obtained Marks</TableHead>
              <TableHead className="w-48">Result & Category</TableHead>
              <TableHead className="w-24 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {students.map((student) => {
              const currentInput = marksState[student.studentDbId] ?? "";
              const originalVal =
                student.marks !== null ? String(student.marks) : "";
              const isDirty = currentInput !== "" && currentInput !== originalVal;
              const isSaving = Boolean(savingRows[student.studentDbId]);

              const parsedNum =
                currentInput.trim() !== "" ? Number(currentInput.trim()) : null;
              const hasValidNumber =
                parsedNum !== null && !Number.isNaN(parsedNum) && parsedNum >= 0;

              // Calculate matched category in real-time
              const matchedCat = hasValidNumber
                ? getPredictedCategory(parsedNum!, categories)
                : null;

              return (
                <TableRow
                  key={student.studentDbId}
                  className={isDirty ? "bg-muted/30" : undefined}
                >
                  <TableCell className="font-mono text-xs font-semibold">
                    {student.studentId}
                  </TableCell>

                  <TableCell className="font-medium">
                    {student.name}
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground">
                    {student.institutionName}
                  </TableCell>

                  <TableCell className="text-xs font-medium">
                    Class {student.class} / Roll {student.roll}
                  </TableCell>

                  {/* Marks Input Field */}
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Input
                        type="number"
                        min="0"
                        max="1000"
                        placeholder="Marks"
                        value={currentInput}
                        onChange={(e) =>
                          handleMarkChange(student.studentDbId, e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            void handleRowSave(student.studentDbId);
                          }
                        }}
                        className={`h-9 w-24 font-mono text-sm font-semibold ${
                          isDirty ? "border-primary ring-1 ring-primary/30" : ""
                        }`}
                      />
                    </div>
                  </TableCell>

                  {/* Dynamic Category & Result Badge */}
                  <TableCell>
                    {hasValidNumber ? (
                      matchedCat ? (
                        <div className="flex items-center gap-1.5">
                          <Badge className="gap-1 bg-emerald-600 text-white hover:bg-emerald-700">
                            <Trophy className="size-3" />
                            {matchedCat.name}
                          </Badge>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <Badge
                            variant="secondary"
                            className="text-xs text-muted-foreground"
                          >
                            <XCircle className="size-3 text-rose-500 mr-1" />
                            Not Awarded
                          </Badge>
                        </div>
                      )
                    ) : (
                      <Badge
                        variant="outline"
                        className="gap-1 border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400"
                      >
                        <Clock className="size-3" />
                        Pending
                      </Badge>
                    )}
                  </TableCell>

                  {/* Action Button */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant={isDirty ? "default" : "outline"}
                        disabled={!isDirty || isSaving || !hasValidNumber}
                        onClick={() => handleRowSave(student.studentDbId)}
                        className="h-8 gap-1 text-xs"
                      >
                        {isSaving ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="size-3.5" />
                        )}
                        Save
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
