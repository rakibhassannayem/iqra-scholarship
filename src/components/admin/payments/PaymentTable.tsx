export type PaymentStudent = {
  registrationId: number;
  studentId: string;
  studentName: string;
  studentClass: number;
  studentRoll: number;
  amount: number;
};

export type PaymentSubmission = {
  id: number;
  institutionId: number;
  institutionName: string;
  scholarshipId: number;
  scholarshipName: string;
  totalAmount: number;
  paymentMethod: string;
  transactionId: string;
  screenshotUrl: string;
  status: "Pending" | "Approved" | "Rejected";
  adminNote: string | null;
  reviewedAt: string | null;
  submittedAt: string;
  students: PaymentStudent[];
};

type PaymentTableProps = {
  payments: PaymentSubmission[];
  onView: (payment: PaymentSubmission) => void;
};

export default function PaymentTable({ payments, onView }: PaymentTableProps) {
  const formatAmount = (amount: number) => `৳${amount.toLocaleString("en-BD")}`;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const statusStyles: Record<PaymentSubmission["status"], string> = {
    Pending: "bg-yellow-100 text-yellow-800",
    Approved: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="border-b px-5 py-4">
        <h3 className="font-semibold">Payment Submissions</h3>
        <p className="text-sm text-muted-foreground">
          All submitted payment records.
        </p>
      </div>

      {payments.length === 0 ? (
        <div className="p-10 text-center text-sm text-muted-foreground">
          No payment submissions found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="whitespace-nowrap px-5 py-3 font-medium">
                  Institution
                </th>
                <th className="whitespace-nowrap px-5 py-3 font-medium">
                  Scholarship
                </th>
                <th className="whitespace-nowrap px-5 py-3 font-medium">
                  Amount
                </th>
                <th className="whitespace-nowrap px-5 py-3 font-medium">
                  Method
                </th>
                <th className="whitespace-nowrap px-5 py-3 font-medium">
                  Transaction ID
                </th>
                <th className="whitespace-nowrap px-5 py-3 font-medium">
                  Submitted At
                </th>
                <th className="whitespace-nowrap px-5 py-3 font-medium">
                  Status
                </th>
                <th className="whitespace-nowrap px-5 py-3 text-right font-medium">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-muted/30">
                  <td className="whitespace-nowrap px-5 py-4 font-medium">
                    {payment.institutionName}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    {payment.scholarshipName}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 font-semibold">
                    {formatAmount(payment.totalAmount)}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    {payment.paymentMethod}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 font-mono text-xs">
                    {payment.transactionId}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    {formatDate(payment.submittedAt)}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[payment.status]}`}
                    >
                      {payment.status}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => onView(payment)}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
