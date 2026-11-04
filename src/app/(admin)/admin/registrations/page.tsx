"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, AlertCircle, CheckCircle2, UserPlus } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import StudentForm, {
  type StudentFormValues,
} from "@/components/admin/students/StudentForm";

import RegistrationTable, {
  type Registration,
} from "@/components/admin/registrations/RegistrationTable";
import RegistrationDetailsModal from "@/components/admin/registrations/RegistrationDetailsModal";
import { toast } from "@/components/ui/toast";

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [deleteError, setDeleteError] = useState("");

  const [viewingRegistration, setViewingRegistration] =
    useState<Registration | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [formError, setFormError] = useState("");

  const [registrationToDelete, setRegistrationToDelete] =
    useState<Registration | null>(null);

  const [deleting, setDeleting] = useState(false);

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/registrations");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load registrations.");
      }

      setRegistrations(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load registrations.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  function openCreateForm() {
    setFormError("");
    setFormOpen(true);
  }

  async function handleSubmit(values: StudentFormValues) {
    setSaving(true);
    setFormError("");
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to register student.");
      }

      setFormOpen(false);

      setSuccess(
        `Student registered successfully with ID: ${data.studentId || data.student?.studentId || "Generated"}`,
      );

      await fetchRegistrations();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to register student.",
      );
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(registration: Registration) {
    setDeleteError("");
    setRegistrationToDelete(registration);
  }

  async function handleConfirmDelete() {
    if (!registrationToDelete) return;

    setDeleting(true);
    setDeleteError("");

    try {
      const response = await fetch(
        `/api/registrations/${registrationToDelete.id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete registration.");
      }

      toast.add({
        title: data.message || "Registration deleted successfully.",
        type: "success",
      });

      setRegistrationToDelete(null);
      await fetchRegistrations();
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete registration.",
      );
    } finally {
      setDeleting(false);
    }
  }

  const pendingCount = registrations.filter(
    (registration) => registration.status === "Pending",
  ).length;

  const approvedCount = registrations.filter(
    (registration) => registration.status === "Approved",
  ).length;

  const cancelledCount = registrations.filter(
    (registration) => registration.status === "Cancelled",
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Scholarship Registrations
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage scholarship registrations and track their payment approval
            status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchRegistrations}
            disabled={loading}
            className="gap-1.5"
          >
            <RefreshCw
              className={`size-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button onClick={openCreateForm} className="gap-1.5">
            <UserPlus className="size-4" />
            Register Student
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
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

      {/* Registration Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{pendingCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{approvedCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cancelled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{cancelledCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Registration Table */}
      {loading && registrations.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
          <div className="mb-3 inline-flex size-10 animate-spin items-center justify-center rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm">Loading registrations...</p>
        </div>
      ) : (
        <RegistrationTable
          registrations={registrations}
          loading={loading}
          onView={(registration) => {
            setViewingRegistration(registration);
          }}
          onDelete={handleDelete}
        />
      )}

      <RegistrationDetailsModal
        registration={viewingRegistration}
        open={Boolean(viewingRegistration)}
        onOpenChange={(open) => {
          if (!open) setViewingRegistration(null);
        }}
      />

      {/* Register Student Modal */}
      <StudentForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);

          if (!open) {
            setFormError("");
          }
        }}
        initialValues={null}
        editing={false}
        saving={saving}
        error={formError}
        onSubmit={handleSubmit}
      />

      <AlertDialog
        open={Boolean(registrationToDelete)}
        onOpenChange={(open) => {
          if (!open && !deleting) {
            setRegistrationToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Registration?</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete registration #
              {registrationToDelete?.id} for {registrationToDelete?.studentName}
              ? If this student has no other registrations, their student record
              will also be deleted. Registrations with payment history cannot be
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {deleteError && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {deleteError}
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>

            <AlertDialogAction
              disabled={deleting}
              onClick={(event) => {
                event.preventDefault();
                void handleConfirmDelete();
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
