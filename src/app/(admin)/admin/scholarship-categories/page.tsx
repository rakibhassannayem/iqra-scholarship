"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import CategoryForm from "@/components/admin/scholarship-categories/CategoryForm";
import CategoryTable from "@/components/admin/scholarship-categories/CategoryTable";
import type { Category } from "@/types/scholarship-category";

export default function ScholarshipCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [minMarks, setMinMarks] = useState("");
  const [maxMarks, setMaxMarks] = useState("");
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const fetchCategories = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/scholarship-categories");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load categories.");
      }

      setCategories(data);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load categories.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  function openCreateDialog() {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setMinMarks("");
    setMaxMarks("");
    setError("");
    setDialogOpen(true);
  }

  function openEditDialog(category: Category) {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description || "");
    setMinMarks(category.minMarks !== null ? String(category.minMarks) : "");
    setMaxMarks(category.maxMarks !== null ? String(category.maxMarks) : "");
    setError("");
    setDialogOpen(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const isEditing = editingCategory !== null;
      const url = "/api/scholarship-categories";
      const method = isEditing ? "PUT" : "POST";
      const parsedMin = minMarks.trim() !== "" ? Number(minMarks.trim()) : null;
      const parsedMax = maxMarks.trim() !== "" ? Number(maxMarks.trim()) : null;

      if (parsedMin !== null && parsedMax !== null && parsedMin > parsedMax) {
        throw new Error("Minimum marks cannot be greater than maximum marks.");
      }

      const payload = isEditing
        ? {
            id: editingCategory.id,
            name: name.trim(),
            description: description.trim(),
            minMarks: parsedMin,
            maxMarks: parsedMax,
          }
        : {
            name: name.trim(),
            description: description.trim(),
            minMarks: parsedMin,
            maxMarks: parsedMax,
          };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save category.");
      }

      setDialogOpen(false);
      toast.add({
        title: isEditing ? "Category updated" : "Category created",
        description: isEditing
          ? `Category "${name}" updated successfully.`
          : `Category "${name}" created successfully.`,
        type: "success",
      });
      await fetchCategories();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save category.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(category: Category) {
    setUpdatingId(category.id);
    setError("");

    try {
      const nextActive = !category.isActive;
      const response = await fetch("/api/scholarship-categories", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: category.id,
          isActive: nextActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update category.");
      }

      toast.add({
        title: "Status updated",
        description: nextActive
          ? `Category "${category.name}" activated.`
          : `Category "${category.name}" deactivated.`,
        type: "success",
      });

      await fetchCategories();
    } catch (err) {
      toast.add({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update category.",
        type: "error",
      });
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
            Create and manage scholarship categories and their marks limits.
          </p>
        </div>

        <Button onClick={openCreateDialog} disabled={saving}>
          <Plus />
          Add Category
        </Button>
      </div>

      {error && !dialogOpen && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <CategoryTable
        categories={categories}
        loading={loading}
        updatingId={updatingId}
        onEdit={openEditDialog}
        onToggleActive={handleToggleActive}
      />

      <CategoryForm
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editingCategory}
        name={name}
        description={description}
        minMarks={minMarks}
        maxMarks={maxMarks}
        setName={setName}
        setDescription={setDescription}
        setMinMarks={setMinMarks}
        setMaxMarks={setMaxMarks}
        saving={saving}
        error={error}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
