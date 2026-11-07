"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScholarshipForm, {
  emptyScholarshipForm,
} from "@/components/admin/scholarships/ScholarshipForm";
import ScholarshipTable from "@/components/admin/scholarships/ScholarshipTable";
import type { Scholarship, ScholarshipFormValues } from "@/types/scholarship";

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
    setFormValues(emptyScholarshipForm);
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
      eligibilityClass: scholarship.eligibilityClass,
      registrationFee: scholarship.registrationFee,
      examCenter: scholarship.examCenter ?? "",
      examDate: scholarship.examDate ?? "",
      examTime: scholarship.examTime ?? "",
      examStartTime: scholarship.examStartTime ?? "",
      examEndTime: scholarship.examEndTime ?? "",
    });
    setError("");
    setSuccess("");
    setFormOpen(true);
  }

  async function handleToggleActive(scholarship: Scholarship, active: boolean) {
    setTogglingId(scholarship.id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/scholarships/${scholarship.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: active }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update scholarship status.");
      }

      setSuccess(
        active
          ? `"${scholarship.name}" is now the active scholarship.`
          : `"${scholarship.name}" has been deactivated.`,
      );

      await fetchScholarships();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update scholarship status.",
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
      const url = editing
        ? `/api/scholarships/${editingScholarship.id}`
        : "/api/scholarships";

      const response = await fetch(
        url,
        editing
          ? {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            }
          : {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...values, isActive: false }),
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Scholarships</h2>
          <p className="text-sm text-muted-foreground">
            Create and manage scholarship programs. Only one scholarship can be
            active at a time.
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
    </div>
  );
}
