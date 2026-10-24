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
import InstitutionForm, {
  emptyInstitutionForm,
  type InstitutionFormValues,
} from "@/components/admin/institutions/InstitutionForm";
import InstitutionTable, {
  type Institution,
} from "@/components/admin/institutions/InstitutionTable";

export default function InstitutionsPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingInstitution, setEditingInstitution] =
    useState<Institution | null>(null);
  const [formValues, setFormValues] =
    useState<InstitutionFormValues>(emptyInstitutionForm);

  const [deleteTarget, setDeleteTarget] = useState<Institution | null>(null);

  const fetchInstitutions = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/institutions");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load institutions.");
      }

      setInstitutions(data);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load institutions.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchInstitutions();
  }, [fetchInstitutions]);

  function openCreateForm() {
    setEditingInstitution(null);
    setFormValues({ ...emptyInstitutionForm });
    setError("");
    setSuccess("");
    setFormOpen(true);
  }

  function openEditForm(institution: Institution) {
    setEditingInstitution(institution);
    setFormValues({
      name: institution.name,
      eiin: institution.eiin,
    });
    setError("");
    setSuccess("");
    setFormOpen(true);
  }

  async function handleSubmit(values: InstitutionFormValues) {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const editing = editingInstitution !== null;

      const response = await fetch(
        editing
          ? `/api/institutions/${editingInstitution.id}`
          : "/api/institutions",
        {
          method: editing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save institution.");
      }

      setFormOpen(false);
      setEditingInstitution(null);

      setSuccess(
        editing
          ? "Institution updated successfully."
          : "Institution created successfully.",
      );

      await fetchInstitutions();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save institution.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    setDeleting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/institutions/${deleteTarget.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete institution.");
      }

      setDeleteTarget(null);
      setSuccess("Institution deleted successfully.");

      await fetchInstitutions();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete institution.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Institutions</h2>
          <p className="text-sm text-muted-foreground">
            Create and manage registered institutions.
          </p>
        </div>

        <Button onClick={openCreateForm}>
          <Plus />
          Add Institution
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

      <InstitutionTable
        institutions={institutions}
        loading={loading}
        onEdit={openEditForm}
        onDelete={setDeleteTarget}
      />

      <InstitutionForm
        key={editingInstitution?.id ?? "new-institution"}
        open={formOpen}
        onOpenChange={setFormOpen}
        initialValues={formValues}
        editing={editingInstitution !== null}
        saving={saving}
        error={formOpen ? error : ""}
        onSubmit={handleSubmit}
      />

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) {
            setDeleteTarget(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete institution?</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete &quot;
              {deleteTarget?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
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
