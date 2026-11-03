import { CreditCard, Clock, CheckCircle2, XCircle } from "lucide-react";

type PaymentSummaryProps = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
};

export default function PaymentSummary({
  total,
  pending,
  approved,
  rejected,
}: PaymentSummaryProps) {
  const cards = [
    {
      title: "Total Payments",
      value: total,
      description: "All payment submissions",
      icon: CreditCard,
    },
    {
      title: "Pending",
      value: pending,
      description: "Waiting for review",
      icon: Clock,
    },
    {
      title: "Approved",
      value: approved,
      description: "Successfully verified",
      icon: CheckCircle2,
    },
    {
      title: "Rejected",
      value: rejected,
      description: "Rejected submissions",
      icon: XCircle,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div key={card.title} className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                {card.title}
              </p>
              <Icon className="size-5 text-muted-foreground" />
            </div>

            <p className="mt-3 text-2xl font-bold">{card.value}</p>

            <p className="mt-1 text-xs text-muted-foreground">
              {card.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
