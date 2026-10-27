"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Institution = {
  id: number;
  name: string;
  eiin: string;
};

type Scholarship = {
  id: number;
  name: string;
  isActive: boolean;
};

export type StudentFormValues = {
  name: string;
  institutionId: number;
  scholarshipId?: number;
  class: number;
  roll: number;
};

export type StudentFormInitialValues = {
  name: string;
  institutionId: number;
  scholarshipId?: number | null;
  class: number;
  roll: number;
};

type StudentFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: StudentFormInitialValues | null;
  editing: boolean;
  saving: boolean;
  error: string;
  onSubmit: (values: StudentFormValues) => void;
};

const emptyForm: StudentFormValues = {
  name: "",
  institutionId: 0,
  scholarshipId: undefined,
  class: 1,
  roll: 1,
};

export default function StudentForm({
  open,
  onOpenChange,
  initialValues,
  editing,
  saving,
  error,
  onSubmit,
}: StudentFormProps) {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [form, setForm] = useState<StudentFormValues>(emptyForm);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (initialValues) {
      setForm({
        name: initialValues.name,
        institutionId: initialValues.institutionId,
        scholarshipId: initialValues.scholarshipId ?? undefined,
        class: initialValues.class,
        roll: initialValues.roll,
      });
    } else {
      setForm({ ...emptyForm });
    }
  }, [open, initialValues]);

  useEffect(() => {
    if (!open) return;

    async function loadOptions() {
      setLoadingData(true);
      try {
        const [instRes, scholRes] = await Promise.all([
          fetch("/api/institutions"),
          fetch("/api/scholarships"),
        ]);

        if (instRes.ok) {
          const instData = await instRes.json();
          setInstitutions(instData);
        }

        if (scholRes.ok) {
          const scholData = await scholRes.json();
          setScholarships(scholData);

          // If adding new student and no scholarship selected, preselect active scholarship
          if (!initialValues) {
            const active = scholData.find((s: Scholarship) => s.isActive);
            if (active) {
              setForm((prev) => ({ ...prev, scholarshipId: active.id }));
            }
          }
        }
      } catch (err) {
        console.error("Failed to load options:", err);
      } finally {
        setLoadingData(false);
      }
    }

    loadOptions();
  }, [open, initialValues]);

  function handleChange(field: keyof StudentFormValues, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: field === "name" ? value : Number(value),
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSubmit({
      ...form,
      name: form.name.trim(),
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit Student Registration" : "Register New Student"}
          </DialogTitle>

          <DialogDescription>
            {editing
              ? "Update the student registration and academic details."
              : "Enter the student details to register for a scholarship."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="student-name">Student Name *</Label>
            <Input
              id="student-name"
              value={form.name}
              onChange={(event) => handleChange("name", event.target.value)}
              placeholder="e.g. Abdullah Al Mamun"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="student-institution">Institution / Madrasa / School *</Label>
            <select
              id="student-institution"
              value={form.institutionId || ""}
              onChange={(event) =>
                handleChange("institutionId", event.target.value)
              }
              required
              disabled={loadingData || saving}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="" disabled>
                {loadingData ? "Loading institutions..." : "Select institution"}
              </option>

              {institutions.map((institution) => (
                <option key={institution.id} value={institution.id}>
                  {institution.name} (EIIN: {institution.eiin})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="student-scholarship">Scholarship Program</Label>
            <select
              id="student-scholarship"
              value={form.scholarshipId || ""}
              onChange={(event) =>
                handleChange("scholarshipId", event.target.value)
              }
              disabled={loadingData || saving}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Default Active Scholarship</option>
              {scholarships.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.isActive ? " (Active)" : " (Inactive)"}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="student-class">Class (1 - 10) *</Label>
              <select
                id="student-class"
                value={form.class}
                onChange={(event) => handleChange("class", event.target.value)}
                required
                disabled={saving}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {Array.from({ length: 10 }, (_, index) => index + 1).map(
                  (classNumber) => (
                    <option key={classNumber} value={classNumber}>
                      Class {classNumber}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="student-roll">Roll Number *</Label>
              <Input
                id="student-roll"
                type="number"
                min={1}
                step={1}
                value={form.roll}
                onChange={(event) => handleChange("roll", event.target.value)}
                placeholder="e.g. 15"
                required
              />
            </div>
          </div>

          {error && <p className="text-sm font-medium text-destructive">{error}</p>}

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={saving || loadingData || institutions.length === 0}
            >
              {saving
                ? "Saving..."
                : editing
                  ? "Update Registration"
                  : "Register Student"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
