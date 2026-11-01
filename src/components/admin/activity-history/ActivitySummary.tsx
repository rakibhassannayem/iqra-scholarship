import { Activity, PlusCircle, Pencil, Trash2 } from "lucide-react";

import type { ActivitySummaryData } from "@/types/activity-log";

type ActivitySummaryProps = {
  summary: ActivitySummaryData;
  loading?: boolean;
};

export default function ActivitySummary({
  summary,
  loading = false,
}: ActivitySummaryProps) {
  const cards = [
    {
      title: "Total Activities",
      value: summary.total,
      icon: Activity,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Created",
      value: summary.create,
      icon: PlusCircle,
      color: "text-green-600",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Updated",
      value: summary.update,
      icon: Pencil,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Deleted",
      value: summary.delete,
      icon: Trash2,
      color: "text-red-600",
      bgColor: "bg-red-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-xl border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                {card.title}
              </p>

              <div
                className={`flex size-10 items-center justify-center rounded-lg ${card.bgColor}`}
              >
                <Icon className={`size-5 ${card.color}`} />
              </div>
            </div>

            <p className="mt-4 text-2xl font-bold">
              {loading ? "—" : card.value.toLocaleString()}
            </p>
          </div>
        );
      })}
    </div>
  );
}
