"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import RegistrationTable, {
  type Registration,
} from "@/components/admin/registrations/RegistrationTable";
import RegistrationDetailsModal from "@/components/admin/registrations/RegistrationDetailsModal";

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedRegistration, setSelectedRegistration] =
    useState<Registration | null>(null);

  const [pendingStatus, setPendingStatus] = useState<
    Registration["status"] | null
  >(null);

  const [viewingRegistration, setViewingRegistration] =
    useState<Registration | null>(null);

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

  function openStatusConfirmation(
    registration: Registration,
    status: Registration["status"],
  ) {
    setSelectedRegistration(registration);
    setPendingStatus(status);
  }

  async function handleStatusChange() {
    if (!selectedRegistration || !pendingStatus) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `/api/registrations/${selectedRegistration.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: pendingStatus,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update registration status.");
      }

      setSelectedRegistration(null);
      setPendingStatus(null);

      setSuccess(
        `Registration status updated to ${pendingStatus} successfully.`,
      );

      await fetchRegistrations();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update registration status.",
      );
    } finally {
      setSaving(false);
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
            Manage scholarship registrations and their approval status.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchRegistrations}
          disabled={loading}
          className="gap-1.5"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
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
          onStatusChange={openStatusConfirmation}
        />
      )}

      <RegistrationDetailsModal
        registration={viewingRegistration}
        open={Boolean(viewingRegistration)}
        onOpenChange={(open) => {
          if (!open) setViewingRegistration(null);
        }}
      />

      {/* Status Confirmation */}
      <AlertDialog
        open={Boolean(selectedRegistration && pendingStatus)}
        onOpenChange={(open) => {
          if (!open && !saving) {
            setSelectedRegistration(null);
            setPendingStatus(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Registration Status?</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to change the registration status of{" "}
              <strong>{selectedRegistration?.studentName}</strong> from{" "}
              <strong>{selectedRegistration?.status}</strong> to{" "}
              <strong>{pendingStatus}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>

            <AlertDialogAction
              disabled={saving}
              onClick={(event) => {
                event.preventDefault();
                handleStatusChange();
              }}
            >
              {saving ? "Updating..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
