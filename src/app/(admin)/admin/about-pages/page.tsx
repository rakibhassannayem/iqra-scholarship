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
import { toast } from "@/components/ui/toast";
import AboutPageForm, {
  emptyAboutPageForm,
} from "@/components/admin/about-pages/AboutPageForm";
import AboutPageTable from "@/components/admin/about-pages/AboutPageTable";
import type { AboutPageItem, AboutPageFormValues } from "@/types/about-page";

export default function AboutPagesAdminPage() {
  const [pages, setPages] = useState<AboutPageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<AboutPageItem | null>(null);
  const [formError, setFormError] = useState("");

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<AboutPageItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPages = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/about-pages");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load about pages.");
      }

      setPages(data);
    } catch (err) {
      toast.add({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to load about pages.",
        type: "error",
      });
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
    setFormOpen(true);
  }

  function openEditForm(page: AboutPageItem) {
    setEditingPage(page);
    setFormError("");
    setFormOpen(true);
  }

  async function handleTogglePublished(
    page: AboutPageItem,
    isPublished: boolean,
  ) {
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

      toast.add({
        title: "Status Updated",
        description: `"${page.title}" is now ${isPublished ? "published" : "draft"}.`,
        type: "success",
      });
    } catch (err) {
      // Revert on error
      setPages((current) =>
        current.map((item) =>
          item.id === page.id ? { ...item, isPublished: page.isPublished } : item,
        ),
      );
      toast.add({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to update page status.",
        type: "error",
      });
    }
  }

  async function handleFormSubmit(values: AboutPageFormValues) {
    setSaving(true);
    setFormError("");

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
      toast.add({
        title: isEditing ? "Page Updated" : "Page Created",
        description: isEditing
          ? `Page "${values.title}" updated successfully.`
          : `Page "${values.title}" created successfully.`,
        type: "success",
      });
      await fetchPages();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to save about page.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeletePage() {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      const response = await fetch(
        `/api/admin/about-pages/${deleteTarget.id}`,
        { method: "DELETE" },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete page.");
      }

      toast.add({
        title: "Page Deleted",
        description: `"${deleteTarget.title}" has been deleted.`,
        type: "success",
      });

      setDeleteTarget(null);
      await fetchPages();
    } catch (err) {
      toast.add({
        title: "Delete Failed",
        description:
          err instanceof Error ? err.message : "Failed to delete page.",
        type: "error",
      });
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete About Page</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.title}&quot;?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePage}
              disabled={deleting}
              variant="destructive"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
