"use client";

import { FormEvent } from "react";
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

export type InstitutionFormValues = {
  name: string;
  eiin: string;
};

export const emptyInstitutionForm: InstitutionFormValues = {
  name: "",
  eiin: "",
};

type InstitutionFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: InstitutionFormValues;
  editing: boolean;
  saving: boolean;
  error: string;
  onSubmit: (values: InstitutionFormValues) => void;
};

export default function InstitutionForm({
  open,
  onOpenChange,
  initialValues,
  editing,
  saving,
  error,
  onSubmit,
}: InstitutionFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    onSubmit({
      name: String(formData.get("name") ?? "").trim(),
      eiin: String(formData.get("eiin") ?? "").trim(),
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit Institution" : "Create Institution"}
          </DialogTitle>
          <DialogDescription>
            {editing
              ? "Update the institution name or EIIN."
              : "Add a new institution to the system."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="institution-name">Institution Name</Label>
            <Input
              id="institution-name"
              name="name"
              placeholder="Enter institution name"
              defaultValue={initialValues.name}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="institution-eiin">EIIN</Label>
            <Input
              id="institution-eiin"
              name="eiin"
              placeholder="Enter EIIN"
              defaultValue={initialValues.eiin}
              required
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
              disabled={saving}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editing
                  ? "Save Changes"
                  : "Create Institution"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
