"use client";

import { useState } from "react";
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

export type Registration = {
  id: number;
  studentDbId: number;
  studentId: string;
  studentName: string;
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
  awardAmount: string;
};

type GrantFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registrations: Registration[];
  categories: ScholarshipCategory[];
  saving: boolean;
  error: string;
  onSubmit: (values: GrantFormValues) => void;
};

export default function GrantForm({
  open,
  onOpenChange,
  registrations,
  categories,
  saving,
  error,
  onSubmit,
}: GrantFormProps) {
  const [studentDbId, setStudentDbId] = useState("");
  const [scholarshipId, setScholarshipId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [awardAmount, setAwardAmount] = useState("");

  const availableScholarships = registrations.filter(
    (registration) => String(registration.studentDbId) === studentDbId,
  );

  function handleStudentChange(value: string | null) {
    setStudentDbId(value ?? "");
    setScholarshipId("");
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
      awardAmount,
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setStudentDbId("");
          setScholarshipId("");
          setCategoryId("");
          setAwardAmount("");
        }

        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Grant Scholarship</DialogTitle>
          <DialogDescription>
            Registered student নির্বাচন করে scholarship grant করো।
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Student</Label>
            <Select
              value={studentDbId}
              onValueChange={handleStudentChange}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {registrations.find(
                    (registration) =>
                      String(registration.studentDbId) === studentDbId,
                  )
                    ? (() => {
                        const student = registrations.find(
                          (registration) =>
                            String(registration.studentDbId) === studentDbId,
                        );

                        return `${student!.studentName} (${student!.studentId}) — ${student!.institutionName}`;
                      })()
                    : "Select a student"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Array.from(
                  new Map(
                    registrations.map((registration) => [
                      registration.studentDbId,
                      registration,
                    ]),
                  ).values(),
                ).map((registration) => (
                  <SelectItem
                    key={registration.studentDbId}
                    value={String(registration.studentDbId)}
                  >
                    {registration.studentName} ({registration.studentId}) —{" "}
                    {registration.institutionName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Registered Scholarship</Label>
            <Select
              value={scholarshipId}
              onValueChange={(value) => setScholarshipId(value ?? "")}
              disabled={!studentDbId || availableScholarships.length === 0}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {availableScholarships.find(
                    (registration) =>
                      String(registration.scholarshipId) === scholarshipId,
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
              <p className="text-sm text-muted-foreground">
                This student has no registered scholarships.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Scholarship Category</Label>
            <Select
              value={categoryId}
              onValueChange={(value) => setCategoryId(value ?? "")}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {categories.find(
                    (category) => String(category.id) === categoryId,
                  )?.name ?? "Select a category"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="awardAmount">Award Amount (৳)</Label>
            <Input
              id="awardAmount"
              type="number"
              min="1"
              step="1"
              required
              value={awardAmount}
              onChange={(event) => setAwardAmount(event.target.value)}
              placeholder="10000"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={saving}>
              {saving ? "Granting..." : "Grant Scholarship"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
