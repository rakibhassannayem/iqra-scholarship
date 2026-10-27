"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import PrizeTable, { type PrizeItem } from "@/components/admin/prizes/PrizeTable";
import PrizeConfirmModal from "@/components/admin/prizes/PrizeConfirmModal";

export default function PrizeConfirmationPage() {
  const { data: session } = useSession();
  const [prizes, setPrizes] = useState<PrizeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [selectedItem, setSelectedItem] = useState<PrizeItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchPrizes = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/prizes");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load prize confirmation records.");
      }

      setPrizes(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load prize confirmation records.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrizes();
  }, [fetchPrizes]);

  function handleOpenModal(item: PrizeItem) {
    setSelectedItem(item);
    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  async function handleConfirm(values: {
    grantId: number;
    prizeStatus: "received" | "pending";
    confirmedBy: string;
    prizeNotes: string;
    prizeReceivedAt?: string;
  }) {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/prizes/${values.grantId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update prize confirmation.");
      }

      setModalOpen(false);
      setSelectedItem(null);
      setSuccess(data.message || "Prize status updated successfully.");

      await fetchPrizes();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update prize confirmation.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleQuickToggle(item: PrizeItem) {
    const nextStatus = item.prizeStatus === "received" ? "pending" : "received";
    setUpdatingId(item.grantId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/prizes/${item.grantId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prizeStatus: nextStatus,
          confirmedBy: session?.user?.name || session?.user?.email || "Admin",
          prizeReceivedAt: nextStatus === "received" ? new Date().toISOString() : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to toggle prize status.");
      }

      setSuccess(
        nextStatus === "received"
          ? `Prize marked as received for ${item.studentName}.`
          : `Prize reverted to pending for ${item.studentName}.`,
      );

      await fetchPrizes();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to toggle prize status.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Prize Confirmation</h1>
          <p className="text-sm text-muted-foreground">
            Confirm and manage scholarship award distribution and prize receipts.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchPrizes}
          disabled={loading}
          className="gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Notifications */}
      {error && !modalOpen && (
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

      {/* Table Content */}
      {loading && prizes.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
          <div className="inline-flex size-10 animate-spin items-center justify-center rounded-full border-4 border-primary border-t-transparent mb-3" />
          <p className="text-sm">Loading prize confirmation records...</p>
        </div>
      ) : (
        <PrizeTable
          prizes={prizes}
          onOpenConfirmModal={handleOpenModal}
          onQuickToggle={handleQuickToggle}
          updatingId={updatingId}
        />
      )}

      {/* Modal */}
      <PrizeConfirmModal
        item={selectedItem}
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setSelectedItem(null);
        }}
        currentUserName={session?.user?.name || session?.user?.email || "Admin"}
        saving={saving}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
