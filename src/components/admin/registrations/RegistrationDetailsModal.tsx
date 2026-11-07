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
  User,
  Copy,
  Check,
  Award,
  CreditCard,
  ClipboardList,
} from "lucide-react";
import type { Registration } from "@/types/registration";

type RegistrationDetailsModalProps = {
  registration: Registration | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function RegistrationDetailsModal({
  registration,
  open,
  onOpenChange,
}: RegistrationDetailsModalProps) {
  const [copied, setCopied] = useState(false);

  if (!registration) return null;
  const studentId = registration.studentId;

  async function handleCopyId() {
    try {
      await navigator.clipboard.writeText(studentId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard errors
    }
  }

  const formattedDate = registration.registeredAt
    ? new Date(registration.registeredAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  const statusVariant =
    registration.status === "Approved"
      ? "default"
      : registration.status === "Cancelled"
        ? "destructive"
        : "secondary";

  const paymentVariant =
    registration.paymentStatus === "Paid" ? "default" : "outline";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ClipboardList className="size-5" />
            </div>

            <div>
              <DialogTitle className="text-xl">
                Registration Details
              </DialogTitle>
              <DialogDescription>{registration.studentName}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Student ID Card */}
          <div className="flex items-center justify-between rounded-xl border bg-muted/40 p-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Student ID
              </p>

              <p className="mt-1 font-mono text-base font-bold text-foreground">
                {registration.studentId}
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
                <User className="size-4 shrink-0 text-primary" />
                <span className="text-xs font-medium">Student Name</span>
              </div>

              <p className="mt-1.5 font-semibold text-foreground">
                {registration.studentName}
              </p>
            </div>

            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <School className="size-4 shrink-0 text-primary" />
                <span className="text-xs font-medium">Institution</span>
              </div>

              <p className="mt-1.5 font-semibold text-foreground">
                {registration.institutionName}
              </p>
            </div>

            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <GraduationCap className="size-4 shrink-0 text-primary" />
                <span className="text-xs font-medium">Class & Roll</span>
              </div>

              <p className="mt-1.5 font-semibold text-foreground">
                Class {registration.studentClass}
              </p>

              <p className="text-xs text-muted-foreground">
                Roll No:{" "}
                <span className="font-medium text-foreground">
                  {registration.studentRoll}
                </span>
              </p>
            </div>

            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Award className="size-4 shrink-0 text-primary" />
                <span className="text-xs font-medium">Scholarship</span>
              </div>

              <p className="mt-1.5 font-semibold text-foreground">
                {registration.scholarshipName}
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

            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CreditCard className="size-4 shrink-0 text-primary" />
                <span className="text-xs font-medium">Registration Fee</span>
              </div>

              <p className="mt-1.5 font-semibold text-foreground">
                ৳{registration.registrationFee.toLocaleString("en-BD")}
              </p>
            </div>
          </div>

          {/* Status Information */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border p-3">
              <p className="text-xs font-medium text-muted-foreground">
                Registration Status
              </p>

              <Badge variant={statusVariant} className="mt-2">
                {registration.status}
              </Badge>
            </div>

            <div className="rounded-lg border p-3">
              <p className="text-xs font-medium text-muted-foreground">
                Payment Status
              </p>

              <Badge variant={paymentVariant} className="mt-2">
                {registration.paymentStatus}
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end border-t pt-4">
          <Button variant="default" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
