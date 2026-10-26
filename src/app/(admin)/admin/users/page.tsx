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
import UserForm, {
  emptyUserForm,
  type UserFormValues,
} from "@/components/admin/users/UserForm";
import UserTable, { type User } from "@/components/admin/users/UserTable";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formError, setFormError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/users");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load users.");
      }

      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  function openCreateForm() {
    setEditingUser(null);
    setFormError("");
    setError("");
    setSuccess("");
    setFormOpen(true);
  }

  function openEditForm(user: User) {
    setEditingUser(user);
    setFormError("");
    setError("");
    setSuccess("");
    setFormOpen(true);
  }

  async function handleSubmit(values: UserFormValues) {
    setSaving(true);
    setFormError("");
    setError("");
    setSuccess("");

    try {
      const isEditing = editingUser !== null;

      const payload = {
        name: values.name,
        email: values.email,
        role: values.role,
        ...(values.password ? { password: values.password } : {}),
      };

      const response = await fetch(
        isEditing ? `/api/users/${editingUser.id}` : "/api/users",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save user.");
      }

      setFormOpen(false);
      setEditingUser(null);
      setSuccess(
        isEditing ? "User updated successfully." : "User created successfully.",
      );

      await fetchUsers();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save user.");
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
      const response = await fetch(`/api/users/${deleteTarget.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete user.");
      }

      setDeleteTarget(null);
      setSuccess("User deleted successfully.");

      await fetchUsers();
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete user.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage admin users.
          </p>
        </div>

        <Button onClick={openCreateForm}>
          <Plus className="mr-2 size-4" />
          Create User
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

      <UserTable
        users={users}
        loading={loading}
        onEdit={openEditForm}
        onDelete={(user) => {
          setDeleteError("");
          setDeleteTarget(user);
        }}
      />

      <UserForm
        key={editingUser?.id ?? "new-user"}
        open={formOpen}
        onOpenChange={setFormOpen}
        initialValues={
          editingUser
            ? {
                name: editingUser.name,
                email: editingUser.email,
                password: "",
                role: editingUser.role,
              }
            : emptyUserForm
        }
        editing={editingUser !== null}
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
            <AlertDialogTitle>Delete this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete
              {deleteTarget ? ` "${deleteTarget.name}"` : " this user"}. This
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
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
