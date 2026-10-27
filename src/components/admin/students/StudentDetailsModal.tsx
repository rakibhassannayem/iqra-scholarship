"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  School,
  Calendar,
  Hash,
  User,
  Copy,
  Check,
  Award,
} from "lucide-react";
import type { Student } from "./StudentTable";

type StudentDetailsModalProps = {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (student: Student) => void;
};

export default function StudentDetailsModal({
  student,
  open,
  onOpenChange,
  onEdit,
}: StudentDetailsModalProps) {
  const [copied, setCopied] = useState(false);

  if (!student) return null;

  async function handleCopyId() {
    if (!student) return;
    try {
      await navigator.clipboard.writeText(student.studentId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  const formattedDate = student.createdAt
    ? new Date(student.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <User className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-xl">{student.name}</DialogTitle>
              <DialogDescription>Student Registration Details</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Student ID Card */}
          <div className="flex items-center justify-between rounded-xl border bg-muted/40 p-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Student ID
              </p>
              <p className="mt-1 font-mono text-base font-bold text-foreground">
                {student.studentId}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyId}
              className="gap-1.5 text-xs"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-green-600" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  Copy ID
                </>
              )}
            </Button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <School className="size-4 shrink-0 text-primary" />
                <span className="text-xs font-medium">Institution</span>
              </div>
              <p className="mt-1.5 font-semibold text-foreground line-clamp-2">
                {student.institutionName}
              </p>
              {student.institutionEiin && (
                <Badge variant="outline" className="mt-1 text-[11px] font-mono">
                  EIIN: {student.institutionEiin}
                </Badge>
              )}
            </div>

            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <GraduationCap className="size-4 shrink-0 text-primary" />
                <span className="text-xs font-medium">Class & Roll</span>
              </div>
              <p className="mt-1.5 font-semibold text-foreground">
                Class {student.class}
              </p>
              <p className="text-xs text-muted-foreground">
                Roll No: <span className="font-medium text-foreground">{student.roll}</span>
              </p>
            </div>

            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Award className="size-4 shrink-0 text-primary" />
                <span className="text-xs font-medium">Scholarship</span>
              </div>
              <p className="mt-1.5 font-semibold text-foreground">
                {student.scholarshipName ?? "Default Active Scholarship"}
              </p>
            </div>

            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="size-4 shrink-0 text-primary" />
                <span className="text-xs font-medium">Registration Date</span>
              </div>
              <p className="mt-1.5 text-xs font-medium text-foreground">
                {formattedDate}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2 border-t pt-4">
          {onEdit && (
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                onEdit(student);
              }}
            >
              Edit Student
            </Button>
          )}
          <Button variant="default" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
