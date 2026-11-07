"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserForm, { emptyUserForm } from "@/components/admin/users/UserForm";
import UserTable from "@/components/admin/users/UserTable";
import { useSession } from "next-auth/react";
import type { User, UserFormValues } from "@/types/user";

export default function UsersPage() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || "admin";

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formError, setFormError] = useState("");

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
      const editing = editingUser !== null;
      const url = editing ? `/api/users/${editingUser.id}` : "/api/users";

      const payload = { ...values };
      if (editing && !payload.password) {
        delete (payload as { password?: string }).password;
      }

      const response = await fetch(url, {
        method: editing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save user.");
      }

      setFormOpen(false);
      setEditingUser(null);
      setSuccess(
        editing
          ? "User updated successfully."
          : "User created successfully.",
      );

      await fetchUsers();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to save user.",
      );
    } finally {
      setSaving(false);
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
        role={userRole}
        onEdit={openEditForm}
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
    </div>
  );
}
