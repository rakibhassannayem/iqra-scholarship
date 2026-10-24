"use client";

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
import { Textarea } from "@/components/ui/textarea";

export type ScholarshipFormValues = {
  name: string;
  description: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  amount: string;
  eligibility: string;
};

type ScholarshipFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: ScholarshipFormValues;
  editing: boolean;
  saving: boolean;
  error: string;
  onSubmit: (values: ScholarshipFormValues) => void;
};

export const emptyScholarshipForm: ScholarshipFormValues = {
  name: "",
  description: "",
  academicYear: "",
  startDate: "",
  endDate: "",
  amount: "",
  eligibility: "",
};

export default function ScholarshipForm({
  open,
  onOpenChange,
  initialValues,
  editing,
  saving,
  error,
  onSubmit,
}: ScholarshipFormProps) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    onSubmit({
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      academicYear: String(formData.get("academicYear") ?? ""),
      startDate: String(formData.get("startDate") ?? ""),
      endDate: String(formData.get("endDate") ?? ""),
      amount: String(formData.get("amount") ?? ""),
      eligibility: String(formData.get("eligibility") ?? ""),
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit Scholarship" : "Create Scholarship"}
          </DialogTitle>
          <DialogDescription>Scholarship-এর তথ্য পূরণ করো।</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Scholarship Name</Label>
              <Input
                id="name"
                name="name"
                required
                maxLength={255}
                defaultValue={initialValues.name}
                placeholder="Annual Scholarship 2026"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="academicYear">Academic Year</Label>
              <Input
                id="academicYear"
                name="academicYear"
                required
                maxLength={20}
                defaultValue={initialValues.academicYear}
                placeholder="2026"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                required
                defaultValue={initialValues.startDate}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                required
                min={initialValues.startDate || undefined}
                defaultValue={initialValues.endDate}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="amount">Scholarship Amount (৳)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="1"
                step="1"
                required
                defaultValue={initialValues.amount}
                placeholder="5000"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                required
                maxLength={2000}
                defaultValue={initialValues.description}
                placeholder="Scholarship সম্পর্কে বিবরণ"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="eligibility">Eligibility Criteria</Label>
              <Textarea
                id="eligibility"
                name="eligibility"
                required
                maxLength={2000}
                defaultValue={initialValues.eligibility}
                placeholder="আবেদনের যোগ্যতা"
              />
            </div>
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
              {saving
                ? "Saving..."
                : editing
                  ? "Update Scholarship"
                  : "Create Scholarship"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
