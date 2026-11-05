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
import AboutPageForm, {
  emptyAboutPageForm,
  type AboutPageFormValues,
} from "@/components/admin/about-pages/AboutPageForm";
import AboutPageTable, {
  type AboutPageItem,
} from "@/components/admin/about-pages/AboutPageTable";

export default function AboutPagesAdminPage() {
  const [pages, setPages] = useState<AboutPageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<AboutPageItem | null>(null);
  const [formError, setFormError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<AboutPageItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchPages = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/about-pages");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load about pages.");
      }

      setPages(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load about pages.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPages();
  }, [fetchPages]);

  function openCreateForm() {
    setEditingPage(null);
    setFormError("");
    setError("");
    setSuccess("");
    setFormOpen(true);
  }

  function openEditForm(page: AboutPageItem) {
    setEditingPage(page);
    setFormError("");
    setError("");
    setSuccess("");
    setFormOpen(true);
  }

  async function handleTogglePublished(
    page: AboutPageItem,
    isPublished: boolean,
  ) {
    setError("");
    setSuccess("");

    // Optimistic UI update
    setPages((current) =>
      current.map((item) =>
        item.id === page.id ? { ...item, isPublished } : item,
      ),
    );

    try {
      const response = await fetch(`/api/admin/about-pages/${page.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: page.title,
          slug: page.slug,
          content: page.content,
          order: page.order,
          isPublished,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update page status.");
      }

      setSuccess(
        `"${page.title}" is now ${isPublished ? "published" : "draft"}.`,
      );
    } catch (err) {
      // Revert on error
      setPages((current) =>
        current.map((item) =>
          item.id === page.id ? { ...item, isPublished: page.isPublished } : item,
        ),
      );
      setError(
        err instanceof Error ? err.message : "Failed to update page status.",
      );
    }
  }

  async function handleFormSubmit(values: AboutPageFormValues) {
    setSaving(true);
    setFormError("");
    setError("");
    setSuccess("");

    try {
      const isEditing = Boolean(editingPage);
      const url = isEditing
        ? `/api/admin/about-pages/${editingPage!.id}`
        : "/api/admin/about-pages";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save about page.");
      }

      setFormOpen(false);
      setSuccess(
        isEditing
          ? `Page "${values.title}" updated successfully.`
          : `Page "${values.title}" created successfully.`,
      );
      await fetchPages();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to save about page.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;

    setDeleting(true);
    setDeleteError("");
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/admin/about-pages/${deleteTarget.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete page.");
      }

      setSuccess(`Page "${deleteTarget.title}" deleted successfully.`);
      setDeleteTarget(null);
      await fetchPages();
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete page.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">About Sub-Pages</h2>
          <p className="text-sm text-muted-foreground">
            Manage the About Us dropdown menu items and their rich-text content.
          </p>
        </div>

        <Button onClick={openCreateForm} className="gap-2">
          <Plus className="size-4" />
          Add New Page
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-600 dark:text-emerald-400">
          {success}
        </div>
      )}

      <AboutPageTable
        pages={pages}
        loading={loading}
        onEdit={openEditForm}
        onDelete={setDeleteTarget}
        onTogglePublished={handleTogglePublished}
      />

      <AboutPageForm
        open={formOpen}
        onOpenChange={setFormOpen}
        initialValues={
          editingPage
            ? {
                title: editingPage.title,
                slug: editingPage.slug,
                content: editingPage.content,
                order: editingPage.order,
                isPublished: editingPage.isPublished,
              }
            : emptyAboutPageForm
        }
        editing={Boolean(editingPage)}
        saving={saving}
        error={formError}
        onSubmit={handleFormSubmit}
      />

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
            setDeleteError("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this page?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.title}&quot;?
              This will remove the page and its URL &quot;/about/
              {deleteTarget?.slug}&quot; from the public website.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {deleteError && (
            <p className="text-sm text-destructive">{deleteError}</p>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void handleDeleteConfirm();
              }}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete Page"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

