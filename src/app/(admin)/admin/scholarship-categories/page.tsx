"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import CategoryForm, {
  type Category,
} from "@/components/admin/scholarship-categories/CategoryForm";
import CategoryTable from "@/components/admin/scholarship-categories/CategoryTable";

export default function ScholarshipCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function fetchCategories() {
    const response = await fetch("/api/scholarship-categories");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to load categories.");
    }

    setCategories(data);
  }

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      try {
        const response = await fetch("/api/scholarship-categories");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load categories.");
        }

        if (!cancelled) setCategories(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load categories.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void initialize();

    return () => {
      cancelled = true;
    };
  }, []);

  function openCreateDialog() {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setError("");
    setSuccess("");
    setDialogOpen(true);
  }

  function openEditDialog(category: Category) {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description ?? "");
    setError("");
    setSuccess("");
    setDialogOpen(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const isEditing = editingCategory !== null;

      const response = await fetch("/api/scholarship-categories", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(isEditing ? { id: editingCategory.id } : {}),
          name: name.trim(),
          description: description.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save category.");
      }

      setDialogOpen(false);
      setSuccess(
        isEditing
          ? "Category updated successfully."
          : "Category created successfully.",
      );

      await fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save category.");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(category: Category) {
    const nextActive = !category.isActive;

    if (
      !window.confirm(
        nextActive
          ? `Activate "${category.name}"?`
          : `Deactivate "${category.name}"?`,
      )
    ) {
      return;
    }

    setUpdatingId(category.id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/scholarship-categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: category.id,
          isActive: nextActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update category.");
      }

      setSuccess(
        nextActive
          ? "Category activated successfully."
          : "Category deactivated successfully.",
      );

      await fetchCategories();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update category.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(category: Category) {
    if (
      !window.confirm(
        `Are you sure you want to delete "${category.name}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setUpdatingId(category.id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `/api/scholarship-categories?id=${category.id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete category.");
      }

      setSuccess("Category deleted successfully.");
      await fetchCategories();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete category.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Scholarship Categories
          </h2>
          <p className="text-sm text-muted-foreground">
            Create and manage scholarship grant categories.
          </p>
        </div>

        <Button onClick={openCreateDialog} disabled={saving}>
          <Plus />
          Add Category
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

      <CategoryTable
        categories={categories}
        loading={loading}
        updatingId={updatingId}
        onEdit={openEditDialog}
        onToggleActive={handleToggleActive}
        onDelete={handleDelete}
      />

      <CategoryForm
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editingCategory}
        name={name}
        description={description}
        setName={setName}
        setDescription={setDescription}
        saving={saving}
        error={error}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
