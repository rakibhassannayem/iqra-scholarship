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
import type {
  StudentFormValues,
  StudentFormInitialValues,
} from "@/types/student";
import type { Institution } from "@/types/institution";
import type { Scholarship } from "@/types/scholarship";

export type { StudentFormValues, StudentFormInitialValues };

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
  const [form, setForm] = useState<StudentFormValues>(emptyForm);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setForm({
        name: initialValues.name,
        institutionId: initialValues.institutionId,
        scholarshipId: initialValues.scholarshipId ?? undefined,
        class: initialValues.class,
        roll: initialValues.roll,
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialValues, open]);

  // Load dropdown choices
  useEffect(() => {
    if (!open) return;

    let mounted = true;
    setLoadingData(true);

    Promise.all([fetch("/api/institutions"), fetch("/api/scholarships")])
      .then(async ([instRes, schRes]) => {
        if (!mounted) return;
        if (instRes.ok) {
          const instData = await instRes.json();
          setInstitutions(instData);
          if (!initialValues && instData.length > 0 && form.institutionId === 0) {
            setForm((prev) => ({ ...prev, institutionId: instData[0].id }));
          }
        }
        if (schRes.ok) {
          const schData = await schRes.json();
          setScholarships(schData);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (mounted) setLoadingData(false);
      });

    return () => {
      mounted = false;
    };
  }, [open, initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.institutionId) return;
    onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit Student Registration" : "Register Student"}
          </DialogTitle>
          <DialogDescription>
            {editing
              ? "Update the student's information and institutional allocation."
              : "Enter student details to generate their unique scholarship ID."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              required
              placeholder="e.g. Abdullah Al Mamun"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>

          {/* Institution */}
          <div className="space-y-1.5">
            <Label htmlFor="institution">Educational Institution</Label>
            <select
              id="institution"
              required
              disabled={loadingData}
              value={form.institutionId || ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  institutionId: Number(e.target.value),
                }))
              }
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="" disabled>
                {loadingData ? "Loading institutions..." : "Select an institution"}
              </option>
              {institutions.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name} ({inst.eiin})
                </option>
              ))}
            </select>
          </div>

          {/* Class & Roll */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="class">Class</Label>
              <select
                id="class"
                required
                value={form.class}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    class: Number(e.target.value),
                  }))
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((cls) => (
                  <option key={cls} value={cls}>
                    Class {cls}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="roll">Roll Number</Label>
              <Input
                id="roll"
                type="number"
                min={1}
                required
                value={form.roll || ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    roll: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          {/* Scholarship Program (Optional) */}
          <div className="space-y-1.5">
            <Label htmlFor="scholarship">
              Assign to Scholarship <span className="text-xs text-muted-foreground">(Optional)</span>
            </Label>
            <select
              id="scholarship"
              disabled={loadingData}
              value={form.scholarshipId || ""}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : undefined;
                setForm((prev) => ({ ...prev, scholarshipId: val }));
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">None (Register directly without specific exam)</option>
              {scholarships.map((sch) => (
                <option key={sch.id} value={sch.id}>
                  {sch.name} {sch.isActive ? "(Active)" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <p className="rounded-md bg-destructive/10 p-2 text-xs font-medium text-destructive">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
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
                ? "Saving..."
                : editing
                  ? "Update Registration"
                  : "Complete Registration"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
