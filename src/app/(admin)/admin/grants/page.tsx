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
import GrantForm, {
  type GrantFormValues,
  type Registration,
  type ScholarshipCategory,
} from "@/components/admin/grants/GrantForm";
import GrantTable, { type Grant } from "@/components/admin/grants/GrantTable";
import GrantDetailsModal from "@/components/admin/grants/GrantDetailsModal";

export default function GrantsPage() {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [categories, setCategories] = useState<ScholarshipCategory[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form Modal (Create & Edit)
  const [formOpen, setFormOpen] = useState(false);
  const [editingGrant, setEditingGrant] = useState<Grant | null>(null);

  // Details Modal
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);

  // Delete Confirmation Dialog
  const [deleteTarget, setDeleteTarget] = useState<Grant | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchGrants = useCallback(async () => {
    try {
      const response = await fetch("/api/grants");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load grants.");
      }

      setGrants(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load grant data.",
      );
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      setLoading(true);
      setError("");

      try {
        const [grantsResponse, registrationsResponse, categoriesResponse] =
          await Promise.all([
            fetch("/api/grants"),
            fetch("/api/registrations"),
            fetch("/api/scholarship-categories"),
          ]);

        const [grantsData, registrationsData, categoriesData] =
          await Promise.all([
            grantsResponse.json(),
            registrationsResponse.json(),
            categoriesResponse.json(),
          ]);

        if (!grantsResponse.ok) {
          throw new Error(grantsData.message || "Failed to load grants.");
        }

        if (!registrationsResponse.ok) {
          throw new Error(
            registrationsData.message ||
              registrationsData.error ||
              "Failed to load registrations.",
          );
        }

        if (!categoriesResponse.ok) {
          throw new Error(
            categoriesData.message || "Failed to load categories.",
          );
        }

        if (cancelled) return;

        setGrants(grantsData);
        setRegistrations(registrationsData);
        setCategories(
          categoriesData.filter(
            (category: ScholarshipCategory) => category.isActive,
          ),
        );
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof Error ? err.message : "Failed to load grant data.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void initialize();

    return () => {
      cancelled = true;
    };
  }, []);

  function openCreateForm() {
    setEditingGrant(null);
    setError("");
    setSuccess("");
    setFormOpen(true);
  }

  function openEditForm(grant: Grant) {
    setEditingGrant(grant);
    setError("");
    setSuccess("");
    setFormOpen(true);
  }

  function openDetailsModal(grant: Grant) {
    setSelectedGrant(grant);
    setDetailsOpen(true);
  }

  async function handleSaveGrant(values: GrantFormValues) {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const isEditing = Boolean(editingGrant);

      const response = await fetch(
        isEditing ? `/api/grants/${editingGrant!.id}` : "/api/grants",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            isEditing
              ? {
                  categoryId: Number(values.categoryId),
                }
              : values,
          ),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save scholarship grant.");
      }

      setFormOpen(false);
      setEditingGrant(null);
      setSuccess(
        isEditing
          ? "Scholarship grant updated successfully."
          : "Scholarship granted successfully.",
      );

      await fetchGrants();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save scholarship grant.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteGrant() {
    if (!deleteTarget) return;

    setDeleting(true);
    setDeleteError("");
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/grants/${deleteTarget.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete scholarship grant.");
      }

      setDeleteTarget(null);
      setSuccess(
        `Scholarship grant for "${deleteTarget.studentName}" deleted successfully.`,
      );

      await fetchGrants();
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete grant.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Scholarship Grants & Recipients
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage scholarship awards, granted students, categories, and distribution.
          </p>
        </div>

        <Button onClick={openCreateForm} className="shadow-xs">
          <Plus className="size-4" />
          Grant Scholarship
        </Button>
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive rounded-lg border border-destructive/30 bg-destructive/10 p-3">
          {error}
        </p>
      )}

      {success && (
        <p role="status" className="text-sm text-green-700 dark:text-green-400 rounded-lg border border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-950/30 p-3">
          {success}
        </p>
      )}

      {/* Grant Table with Search, Filters, Stats, View Details, Edit, Delete */}
      <GrantTable
        grants={grants}
        loading={loading}
        onViewDetails={openDetailsModal}
        onEdit={openEditForm}
        onDelete={(grant) => {
          setDeleteError("");
          setDeleteTarget(grant);
        }}
      />

      {/* Create / Edit Form Modal (Spacious sm:max-w-2xl with stacked institution & search) */}
      <GrantForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingGrant(null);
        }}
        registrations={registrations}
        categories={categories}
        editingGrant={editingGrant}
        saving={saving}
        error={error}
        onSubmit={handleSaveGrant}
      />

      {/* View Details Modal */}
      <GrantDetailsModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        grant={selectedGrant}
        onEdit={(grant) => {
          openEditForm(grant);
        }}
      />

      {/* Delete Confirmation Alert Dialog */}
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
            <AlertDialogTitle>Delete scholarship grant?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the scholarship grant for{" "}
              <strong>&quot;{deleteTarget?.studentName}&quot;</strong> (ID:{" "}
              {deleteTarget?.studentId})? This action cannot be undone.
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
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(event) => {
                event.preventDefault();
                void handleDeleteGrant();
              }}
            >
              {deleting ? "Deleting..." : "Delete Grant"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
