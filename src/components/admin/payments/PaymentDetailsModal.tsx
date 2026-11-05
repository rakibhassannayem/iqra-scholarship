"use client";

import { useState } from "react";
import { X, Check, Ban, Loader2 } from "lucide-react";
import type { PaymentSubmission } from "./PaymentTable";
import Image from "next/image";

type PaymentDetailsModalProps = {
  payment: PaymentSubmission | null;
  onClose: () => void;
  onReview: (
    status: "Approved" | "Rejected",
    adminNote: string,
  ) => Promise<void>;
};

export default function PaymentDetailsModal({
  payment,
  onClose,
  onReview,
}: PaymentDetailsModalProps) {
  const [adminNote, setAdminNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [reviewAction, setReviewAction] = useState<
    "Approved" | "Rejected" | null
  >(null);
  const [reviewError, setReviewError] = useState("");

  if (!payment) return null;

  const formatAmount = (amount: number) => `৳${amount.toLocaleString("en-BD")}`;

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleReview = async (status: "Approved" | "Rejected") => {
    if (loading) return;

    setLoading(true);
    setReviewAction(status);
    setReviewError("");

    try {
      await onReview(status, adminNote.trim());
    } catch (error) {
      setReviewError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
      setReviewAction(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onClose();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-background shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b bg-background px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">Payment Details</h2>
            <p className="text-sm text-muted-foreground">
              Payment Submission #{payment.id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close modal"
            className="rounded-md p-2 hover:bg-muted disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailItem label="Institution" value={payment.institutionName} />
            <DetailItem label="Scholarship" value={payment.scholarshipName} />
            <DetailItem
              label="Total Amount"
              value={formatAmount(payment.totalAmount)}
            />
            <DetailItem label="Payment Method" value={payment.paymentMethod} />
            <DetailItem label="Transaction ID" value={payment.transactionId} />
            <DetailItem
              label="Submitted At"
              value={formatDate(payment.submittedAt)}
            />
            <DetailItem label="Status" value={payment.status} />
            <DetailItem label="Admin Note" value={payment.adminNote || "—"} />
          </div>

          <div>
            <h3 className="mb-3 font-semibold">
              Included Students ({payment.students.length})
            </h3>

            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left">
                  <tr>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">
                      Student ID
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">
                      Name
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">
                      Class
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">
                      Roll
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-right font-medium">
                      Fee
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {payment.students.map((student) => (
                    <tr key={student.registrationId}>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">
                        {student.studentId}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {student.studentName}
                      </td>
                      <td className="px-4 py-3">{student.studentClass}</td>
                      <td className="px-4 py-3">{student.studentRoll}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        {formatAmount(student.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Payment Proof</h3>
            <div className="relative h-125 w-full">
              <Image
                src={`/api/payment-submissions/${payment.id}/screenshot`}
                alt="Payment proof"
                fill
                unoptimized
                className="rounded-lg border object-contain"
                sizes="(max-width: 768px) 100vw, 700px"
              />
            </div>
          </div>

          {(payment.status === "Pending" ||
            payment.status === "Approved" ||
            payment.status === "Rejected") && (
            <div className="space-y-4 border-t pt-5">
              <div>
                <label
                  htmlFor="adminNote"
                  className="mb-2 block text-sm font-medium"
                >
                  Admin Note (Optional)
                </label>
                <textarea
                  id="adminNote"
                  value={adminNote}
                  onChange={(event) => setAdminNote(event.target.value)}
                  maxLength={1000}
                  rows={3}
                  disabled={loading}
                  placeholder="Write a note about this payment..."
                  className="w-full rounded-lg border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                />
              </div>

              {reviewError && (
                <p className="text-sm text-destructive">{reviewError}</p>
              )}

              <div className="flex flex-wrap justify-end gap-3">
                {payment.status !== "Approved" && (
                  <button
                    type="button"
                    onClick={() => handleReview("Approved")}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                  >
                    {loading && reviewAction === "Approved" ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Check className="size-4" />
                    )}
                    Approve Payment
                  </button>
                )}

                {payment.status !== "Rejected" && (
                  <button
                    type="button"
                    onClick={() => handleReview("Rejected")}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-lg border border-destructive px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
                  >
                    {loading && reviewAction === "Rejected" ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Ban className="size-4" />
                    )}
                    Reject Payment
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="wrap-break-word text-sm font-medium">{value}</p>
    </div>
  );
}
