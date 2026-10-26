"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import GrantForm, {
  type GrantFormValues,
  type Registration,
  type ScholarshipCategory,
} from "@/components/admin/grants/GrantForm";
import GrantTable, { type Grant } from "@/components/admin/grants/GrantTable";

export default function GrantsPage() {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [categories, setCategories] = useState<ScholarshipCategory[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const fetchGrants = useCallback(async () => {
    const response = await fetch("/api/grants");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to load grants.");
    }

    setGrants(data);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      try {
        const [grantsResponse, registrationsResponse, categoriesResponse] =
          await Promise.all([
            fetch("/api/grants"),
            fetch("/api/registrations"),
            fetch("/api/scholarship-categories"),
          ]);

        const [grantsData, registrationsData, categoriesData] =
          await Promise.all([
            grantsResponse.json(),
            registrationsResponse.json(),
            categoriesResponse.json(),
          ]);

        if (!grantsResponse.ok) {
          throw new Error(grantsData.message || "Failed to load grants.");
        }

        if (!registrationsResponse.ok) {
          throw new Error(
            registrationsData.message ||
              registrationsData.error ||
              "Failed to load registrations.",
          );
        }

        if (!categoriesResponse.ok) {
          throw new Error(
            categoriesData.message || "Failed to load categories.",
          );
        }

        if (cancelled) return;

        setGrants(grantsData);
        setRegistrations(registrationsData);
        setCategories(
          categoriesData.filter(
            (category: ScholarshipCategory) => category.isActive,
          ),
        );
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof Error ? err.message : "Failed to load grant data.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void initialize();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCreateGrant(values: GrantFormValues) {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/grants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          awardAmount: Number(values.awardAmount),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to grant scholarship.");
      }

      setFormOpen(false);
      setSuccess("Scholarship granted successfully.");
      await fetchGrants();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to grant scholarship.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus(grant: Grant) {
    const nextStatus = grant.status === "granted" ? "revoked" : "granted";

    setUpdatingId(grant.id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/grants/${grant.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update grant status.");
      }

      setSuccess(
        nextStatus === "revoked"
          ? "Scholarship grant revoked successfully."
          : "Scholarship grant restored successfully.",
      );

      await fetchGrants();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update grant status.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  function openCreateForm() {
    setError("");
    setSuccess("");
    setFormOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Scholarship Grants
          </h2>
          <p className="text-sm text-muted-foreground">
            Grant scholarships to registered students and manage their status.
          </p>
        </div>

        <Button onClick={openCreateForm}>
          <Plus />
          Grant Scholarship
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

      <GrantTable
        grants={grants}
        loading={loading}
        onToggleStatus={handleToggleStatus}
        updatingId={updatingId}
      />

      <GrantForm
        open={formOpen}
        onOpenChange={setFormOpen}
        registrations={registrations}
        categories={categories}
        saving={saving}
        error={error}
        onSubmit={handleCreateGrant}
      />
    </div>
  );
}
