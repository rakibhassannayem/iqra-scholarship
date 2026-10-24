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

export type StudentFormValues = {
  name: string;
  institutionId: number;
  class: number;
  roll: number;
};

export type StudentFormInitialValues = {
  name: string;
  institutionId: number;
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
  const [form, setForm] = useState<StudentFormValues>(emptyForm);
  const [loadingInstitutions, setLoadingInstitutions] = useState(false);

  useEffect(() => {
    if (!open) return;

    setForm(initialValues ? { ...initialValues } : { ...emptyForm });
  }, [open, initialValues]);

  useEffect(() => {
    if (!open) return;

    async function fetchInstitutions() {
      setLoadingInstitutions(true);

      try {
        const response = await fetch("/api/institutions");

        if (!response.ok) {
          throw new Error("Failed to load institutions.");
        }

        const data = await response.json();
        setInstitutions(data);
      } catch (error) {
        console.error("Failed to fetch institutions:", error);
      } finally {
        setLoadingInstitutions(false);
      }
    }

    fetchInstitutions();
  }, [open]);

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
          <DialogTitle>{editing ? "Edit Student" : "Add Student"}</DialogTitle>

          <DialogDescription>
            {editing
              ? "Update the student's information."
              : "Enter the student's information to register."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="student-name">Student Name</Label>
            <Input
              id="student-name"
              value={form.name}
              onChange={(event) => handleChange("name", event.target.value)}
              placeholder="Enter student name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="student-institution">Institution</Label>
            <select
              id="student-institution"
              value={form.institutionId || ""}
              onChange={(event) =>
                handleChange("institutionId", event.target.value)
              }
              required
              disabled={loadingInstitutions || saving}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="" disabled>
                {loadingInstitutions
                  ? "Loading institutions..."
                  : "Select institution"}
              </option>

              {institutions.map((institution) => (
                <option key={institution.id} value={institution.id}>
                  {institution.name} ({institution.eiin})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="student-class">Class</Label>
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
              <Label htmlFor="student-roll">Roll</Label>
              <Input
                id="student-roll"
                type="number"
                min={1}
                step={1}
                value={form.roll}
                onChange={(event) => handleChange("roll", event.target.value)}
                required
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2">
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
              disabled={
                saving || loadingInstitutions || institutions.length === 0
              }
            >
              {saving
                ? "Saving..."
                : editing
                  ? "Update Student"
                  : "Register Student"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
