"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
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
import InstitutionDetailsModal from "@/components/admin/institutions/InstitutionDetailsModal";

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
  const [viewingInstitution, setViewingInstitution] =
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
      principal: institution.principal || "",
      principalPhone: institution.principalPhone || "",
      representative: institution.representative || "",
      representativePhone: institution.representativePhone || "",
      division: institution.division || "",
      district: institution.district || "",
      upazila: institution.upazila || "",
      village: institution.village || "",
      block: institution.block || "",
      address: institution.address || "",
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
          ? `Institution "${values.name}" updated successfully.`
          : `Institution "${values.name}" created successfully.`,
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
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Institutions</h1>
          <p className="text-sm text-muted-foreground">
            Manage participating schools, madrasas, contacts, and address information.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchInstitutions}
            disabled={loading}
            className="gap-1.5"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button onClick={openCreateForm} className="gap-1.5">
            <Plus className="size-4" />
            Add Institution
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {error && !formOpen && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-lg border border-green-600/30 bg-green-600/10 p-4 text-sm text-green-700 dark:text-green-400">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Table */}
      <InstitutionTable
        institutions={institutions}
        loading={loading}
        onView={(inst) => setViewingInstitution(inst)}
        onEdit={openEditForm}
        onDelete={setDeleteTarget}
      />

      {/* Details View Modal */}
      <InstitutionDetailsModal
        institution={viewingInstitution}
        open={Boolean(viewingInstitution)}
        onOpenChange={(open) => {
          if (!open) setViewingInstitution(null);
        }}
        onEdit={(inst) => {
          setViewingInstitution(null);
          openEditForm(inst);
        }}
      />

      {/* Create / Edit Form Modal */}
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

      {/* Delete Confirmation Alert */}
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
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete Institution"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
