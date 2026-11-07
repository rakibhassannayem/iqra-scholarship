"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import NoticeForm, {
  emptyNoticeForm,
} from "@/components/admin/notices/NoticeForm";
import NoticeTable from "@/components/admin/notices/NoticeTable";
import type { Notice, NoticeFormValues } from "@/types/notice";

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [formError, setFormError] = useState("");

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

  async function handleTogglePublished(notice: Notice, isPublished: boolean) {
    setError("");
    setSuccess("");

    // Optimistic UI update
    setNotices((currentNotices) =>
      currentNotices.map((item) =>
        item.id === notice.id ? { ...item, isPublished } : item,
      ),
    );

    try {
      const response = await fetch(`/api/notices/${notice.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPublished }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update notice.");
      }

      setSuccess(
        `"${notice.title}" is now ${isPublished ? "published" : "draft"}.`,
      );
    } catch (err) {
      // Revert optimistic update
      setNotices((currentNotices) =>
        currentNotices.map((item) =>
          item.id === notice.id
            ? { ...item, isPublished: notice.isPublished }
            : item,
        ),
      );
      setError(
        err instanceof Error ? err.message : "Failed to update notice.",
      );
    }
  }

  async function handleSubmit(values: NoticeFormValues) {
    setSaving(true);
    setFormError("");
    setError("");
    setSuccess("");

    try {
      const editing = editingNotice !== null;
      const url = editing ? `/api/notices/${editingNotice.id}` : "/api/notices";

      const response = await fetch(url, {
        method: editing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save notice.");
      }

      setFormOpen(false);
      setEditingNotice(null);
      setSuccess(
        editing
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
        onTogglePublished={handleTogglePublished}
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
    </div>
  );
}
