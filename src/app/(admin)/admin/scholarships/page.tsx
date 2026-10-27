"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ScholarshipForm, {
  emptyScholarshipForm,
  type ScholarshipFormValues,
} from "@/components/admin/scholarships/ScholarshipForm";
import ScholarshipTable, {
  type Scholarship,
} from "@/components/admin/scholarships/ScholarshipTable";

function toDateInput(date: string) {
  return new Date(date).toISOString().slice(0, 10);
}

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingScholarship, setEditingScholarship] =
    useState<Scholarship | null>(null);
  const [formValues, setFormValues] =
    useState<ScholarshipFormValues>(emptyScholarshipForm);

  const [deleteTarget, setDeleteTarget] = useState<Scholarship | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const fetchScholarships = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/scholarships");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load scholarships.");
      }

      setScholarships(data);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load scholarships.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchScholarships();
  }, [fetchScholarships]);

  function openCreateForm() {
    setEditingScholarship(null);
    setFormValues({ ...emptyScholarshipForm });
    setError("");
    setSuccess("");
    setFormOpen(true);
  }

  function openEditForm(scholarship: Scholarship) {
    setEditingScholarship(scholarship);
    setFormValues({
      name: scholarship.name,
      description: scholarship.description,
      academicYear: scholarship.academicYear,
      endDate: toDateInput(scholarship.endDate),
      eligibility: scholarship.eligibility,
      examCenter: scholarship.examCenter ?? "",
      examDate: scholarship.examDate ?? "",
      examTime: scholarship.examTime ?? "",
    });
    setError("");
    setSuccess("");
    setFormOpen(true);
  }

  async function handleToggleActive(scholarship: Scholarship, nextActive: boolean) {
    setTogglingId(scholarship.id);
    setError("");
    setSuccess("");

    // Optimistically update: only ONE scholarship can be active at a time
    const previousScholarships = scholarships;
    setScholarships((prev) =>
      prev.map((s) => {
        if (nextActive) {
          // If turning this one ON, set this one to true and all others to false
          return { ...s, isActive: s.id === scholarship.id };
        } else {
          // If turning this one OFF, only deactivate this one
          return s.id === scholarship.id ? { ...s, isActive: false } : s;
        }
      }),
    );

    try {
      const response = await fetch(`/api/scholarships/${scholarship.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextActive }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update scholarship status.");
      }

      setSuccess(
        nextActive
          ? `"${scholarship.name}" is now active. All other scholarships are inactive.`
          : `"${scholarship.name}" is now inactive.`,
      );

      await fetchScholarships();
    } catch (err) {
      setScholarships(previousScholarships);
      setError(
        err instanceof Error ? err.message : "Failed to update scholarship status.",
      );
    } finally {
      setTogglingId(null);
    }
  }

  async function handleSubmit(values: ScholarshipFormValues) {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const editing = editingScholarship !== null;

      const response = await fetch(
        editing
          ? `/api/scholarships/${editingScholarship.id}`
          : "/api/scholarships",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save scholarship.");
      }

      setFormOpen(false);
      setEditingScholarship(null);
      setSuccess(
        editing
          ? "Scholarship updated successfully."
          : "Scholarship created successfully.",
      );

      await fetchScholarships();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save scholarship.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    setDeleting(true);
    setDeleteError("");
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/scholarships/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete scholarship.");
      }

      setDeleteTarget(null);
      setSuccess("Scholarship deleted successfully.");
      await fetchScholarships();
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete scholarship.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Scholarships</h2>
          <p className="text-sm text-muted-foreground">
            Create and manage scholarship programs. Only one scholarship can be active at a time.
          </p>
        </div>

        <Button onClick={openCreateForm}>
          <Plus />
          Create Scholarship
        </Button>
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      {success && (
        <p role="status" className="text-sm text-green-700 dark:text-green-400">
          {success}
        </p>
      )}

      <ScholarshipTable
        scholarships={scholarships}
        loading={loading}
        onEdit={openEditForm}
        onDelete={(scholarship) => {
          setDeleteError("");
          setDeleteTarget(scholarship);
        }}
        onToggleActive={handleToggleActive}
        togglingId={togglingId}
      />

      <ScholarshipForm
        key={editingScholarship?.id ?? "new-scholarship"}
        open={formOpen}
        onOpenChange={setFormOpen}
        initialValues={formValues}
        editing={editingScholarship !== null}
        saving={saving}
        error={error}
        onSubmit={handleSubmit}
      />

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) {
            setDeleteTarget(null);
            setDeleteError("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete scholarship?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;
              {deleteTarget?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
            {deleteError && (
              <p role="alert" className="text-sm text-destructive">
                {deleteError}
              </p>
            )}
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={(event) => {
                event.preventDefault();
                void handleDelete();
              }}
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
