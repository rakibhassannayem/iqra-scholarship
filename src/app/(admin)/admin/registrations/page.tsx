"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
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
import RegistrationTable, {
  type Registration,
} from "@/components/admin/registrations/RegistrationTable";

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<Registration | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

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
    void fetchRegistrations();
  }, [fetchRegistrations]);

  async function handleDelete() {
    if (!deleteTarget) return;

    setDeleting(true);
    setDeleteError("");
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/registrations/${deleteTarget.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete registration.");
      }

      setDeleteTarget(null);
      setSuccess("Registration deleted successfully.");

      await fetchRegistrations();
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete registration.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Registrations</h1>
        <p className="text-sm text-muted-foreground">
          View and manage scholarship registrations.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 text-sm text-destructive"
        >
          <AlertCircle className="size-4" />
          {error}
        </div>
      )}

      {success && (
        <p role="status" className="text-sm text-green-600">
          {success}
        </p>
      )}

      <RegistrationTable
        registrations={registrations}
        loading={loading}
        onDelete={(registration) => {
          setDeleteError("");
          setDeleteTarget(registration);
        }}
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
            <AlertDialogTitle>Delete this registration?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove
              {deleteTarget
                ? ` ${deleteTarget.studentName}'s registration for ${deleteTarget.scholarshipName}`
                : " this registration"}
              . The student and scholarship records will remain unchanged.
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
