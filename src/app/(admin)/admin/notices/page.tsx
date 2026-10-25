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
import NoticeForm, {
  emptyNoticeForm,
  type NoticeFormValues,
} from "@/components/admin/notices/NoticeForm";
import NoticeTable, {
  type Notice,
} from "@/components/admin/notices/NoticeTable";

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [formError, setFormError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/notices");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load notices.");
      }

      setNotices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load notices.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchNotices();
  }, [fetchNotices]);

  function openCreateForm() {
    setEditingNotice(null);
    setFormError("");
    setError("");
    setSuccess("");
    setFormOpen(true);
  }

  function openEditForm(notice: Notice) {
    setEditingNotice(notice);
    setFormError("");
    setError("");
    setSuccess("");
    setFormOpen(true);
  }

  async function handleSubmit(values: NoticeFormValues) {
    setSaving(true);
    setFormError("");
    setError("");
    setSuccess("");

    try {
      const isEditing = editingNotice !== null;

      const response = await fetch(
        isEditing ? `/api/notices/${editingNotice.id}` : "/api/notices",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save notice.");
      }

      setFormOpen(false);
      setEditingNotice(null);
      setSuccess(
        isEditing
          ? "Notice updated successfully."
          : "Notice created successfully.",
      );

      await fetchNotices();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to save notice.",
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
      const response = await fetch(`/api/notices/${deleteTarget.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete notice.");
      }

      setDeleteTarget(null);
      setSuccess("Notice deleted successfully.");
      await fetchNotices();
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete notice.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notices</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage website notices.
          </p>
        </div>

        <Button onClick={openCreateForm}>
          <Plus className="mr-2 size-4" />
          Create Notice
        </Button>
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      {success && (
        <p role="status" className="text-sm text-green-600">
          {success}
        </p>
      )}

      <NoticeTable
        notices={notices}
        loading={loading}
        onEdit={openEditForm}
        onDelete={(notice) => {
          setDeleteError("");
          setDeleteTarget(notice);
        }}
      />

      <NoticeForm
        key={editingNotice?.id ?? "new-notice"}
        open={formOpen}
        onOpenChange={setFormOpen}
        initialValues={
          editingNotice
            ? {
                title: editingNotice.title,
                content: editingNotice.content,
                isPublished: editingNotice.isPublished,
              }
            : emptyNoticeForm
        }
        editing={editingNotice !== null}
        saving={saving}
        error={formError}
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
            <AlertDialogTitle>Delete this notice?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete
              {deleteTarget ? ` "${deleteTarget.title}"` : " this notice"}. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {deleteError && (
            <p role="alert" className="text-sm text-destructive">
              {deleteError}
            </p>
          )}

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
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
