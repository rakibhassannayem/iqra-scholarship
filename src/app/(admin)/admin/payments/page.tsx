"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

import PaymentSummary from "@/components/admin/payments/PaymentSummary";
import PaymentTable, {
  type PaymentSubmission,
} from "@/components/admin/payments/PaymentTable";
import PaymentDetailsModal from "@/components/admin/payments/PaymentDetailsModal";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentSubmission[]>([]);
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentSubmission | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/payment-submissions");

      if (!response.ok) {
        throw new Error("Failed to fetch payment submissions.");
      }

      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load payment submissions.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleReview = async (
    status: "Approved" | "Rejected",
    adminNote: string,
  ) => {
    if (!selectedPayment) return;

    try {
      const response = await fetch(
        `/api/payment-submissions/${selectedPayment.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            adminNote,
          }),
        },
      );

      const responseText = await response.text();

      let data: { message?: string } = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          // Response is not valid JSON.
        }
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to review payment submission.");
      }

      setSelectedPayment(null);
      await fetchPayments();
    } catch (error) {
      console.error(error);

      throw error instanceof Error
        ? error
        : new Error("Something went wrong while reviewing payment.");
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const pendingCount = payments.filter(
    (payment) => payment.status === "Pending",
  ).length;

  const approvedCount = payments.filter(
    (payment) => payment.status === "Approved",
  ).length;

  const rejectedCount = payments.filter(
    (payment) => payment.status === "Rejected",
  ).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Payment Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Review and manage student payment submissions.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchPayments}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <PaymentSummary
        total={payments.length}
        pending={pendingCount}
        approved={approvedCount}
        rejected={rejectedCount}
      />

      {/* Error / Loading / Table */}
      {error ? (
        <div className="rounded-xl border bg-card p-8 text-center">
          <p className="text-sm text-destructive">{error}</p>

          <button
            type="button"
            onClick={fetchPayments}
            className="mt-3 text-sm font-medium text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      ) : loading ? (
        <div className="rounded-xl border bg-card p-10 text-center text-sm text-muted-foreground">
          Loading payment submissions...
        </div>
      ) : (
        <PaymentTable payments={payments} onView={setSelectedPayment} />
      )}

      {/* Details Modal */}
      <PaymentDetailsModal
        payment={selectedPayment}
        onClose={() => setSelectedPayment(null)}
        onReview={handleReview}
      />
    </div>
  );
}
