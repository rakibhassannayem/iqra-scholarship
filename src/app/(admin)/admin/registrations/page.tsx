"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import RegistrationTable from "@/components/admin/registrations/RegistrationTable";
import RegistrationDetailsModal from "@/components/admin/registrations/RegistrationDetailsModal";
import DirectRegisterModal, {
  type DirectRegisterFormData,
} from "@/components/admin/registrations/DirectRegisterModal";
import type { Registration } from "@/types/registration";

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [viewingRegistration, setViewingRegistration] =
    useState<Registration | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/registrations");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to load registrations.");
      }

      setRegistrations(data);
    } catch (err) {
      toast.add({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to load registrations.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchRegistrations();
  }, [fetchRegistrations]);

  function openCreateForm() {
    setFormError("");
    setFormOpen(true);
  }

  async function handleDirectRegister(formData: DirectRegisterFormData) {
    setSaving(true);
    setFormError("");

    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to register student.");
      }

      setFormOpen(false);
      toast.add({
        title: "Registration Successful",
        description: `Student ${formData.name} registered successfully (ID: ${data.studentId || data.student?.studentId || "Generated"}).`,
        type: "success",
      });
      await fetchRegistrations();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to register student.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Student Registrations
          </h2>
          <p className="text-sm text-muted-foreground">
            Track scholarship applications, fees, and verification status.
          </p>
        </div>

        <Button onClick={openCreateForm} className="gap-2">
          <Plus className="size-4" />
          Add Registration
        </Button>
      </div>

      <RegistrationTable
        registrations={registrations}
        loading={loading}
        onView={setViewingRegistration}
      />

      <RegistrationDetailsModal
        registration={viewingRegistration}
        open={Boolean(viewingRegistration)}
        onOpenChange={(open) => {
          if (!open) {
            setViewingRegistration(null);
          }
        }}
      />

      <DirectRegisterModal
        open={formOpen}
        onOpenChange={setFormOpen}
        saving={saving}
        error={formError}
        onSubmit={handleDirectRegister}
      />
    </div>
  );
}
