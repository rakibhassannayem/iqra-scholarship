"use client";

import { useEffect, useState } from "react";
import {
  GraduationCap,
  School,
  Users,
  BookOpen,
  ClipboardList,
} from "lucide-react";

type DashboardStats = {
  totalStudents: number;
  totalInstitutions: number;
  totalScholarships: number;
  activeScholarships: number;
  totalRegistrations: number;
};

const statCards = [
  {
    key: "totalStudents",
    title: "মোট শিক্ষার্থী",
    icon: Users,
  },
  {
    key: "totalInstitutions",
    title: "মোট প্রতিষ্ঠান",
    icon: School,
  },
  {
    key: "totalScholarships",
    title: "মোট বৃত্তি",
    icon: GraduationCap,
  },
  {
    key: "activeScholarships",
    title: "সক্রিয় বৃত্তি",
    icon: BookOpen,
  },
  {
    key: "totalRegistrations",
    title: "মোট নিবন্ধন",
    icon: ClipboardList,
  },
] as const;

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/admin/dashboard");

        if (!response.ok) {
          throw new Error("Dashboard data load করা যায়নি।");
        }

        const data: DashboardStats = await response.json();
        setStats(data);
      } catch {
        setError("Dashboard data লোড করতে সমস্যা হয়েছে।");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Iqra Scholarship সিস্টেমের সার্বিক অবস্থা।
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {statCards.map((card) => {
              const Icon = card.icon;

              return (
                <div key={card.key} className="rounded-xl border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">
                      {card.title}
                    </p>
                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                      <Icon className="size-5" />
                    </div>
                  </div>

                  <p className="mt-4 text-3xl font-bold">
                    {loading ? "—" : (stats?.[card.key] ?? 0)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold">স্বাগতম, Administrator!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              এখান থেকে প্রতিষ্ঠান, শিক্ষার্থী ও বৃত্তির তথ্য পরিচালনা করতে
              পারবে। নতুন তথ্য যোগ হলে Dashboard-এর পরিসংখ্যানও আপডেট হবে।
            </p>
          </div>
        </>
      )}
    </div>
  );
}
