"use client";

import { Users, CheckCircle, Clock, Trophy, XCircle } from "lucide-react";

type ResultStatsProps = {
  stats: {
    totalStudents: number;
    enteredCount: number;
    pendingCount: number;
    awardedCount: number;
    notAwardedCount: number;
  };
};

export default function ResultStats({ stats }: ResultStatsProps) {
  const percentage =
    stats.totalStudents > 0
      ? Math.round((stats.enteredCount / stats.totalStudents) * 100)
      : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border bg-card p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            Total Students
          </p>
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Users className="size-4" />
          </div>
        </div>
        <p className="mt-2 text-2xl font-bold">{stats.totalStudents}</p>
        <p className="mt-1 text-xs text-muted-foreground">Registered in exam</p>
      </div>

      <div className="rounded-xl border bg-card p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            Marks Entered
          </p>
          <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
            <CheckCircle className="size-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-2xl font-bold">{stats.enteredCount}</p>
          <span className="text-xs font-semibold text-muted-foreground">
            ({percentage}%)
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="rounded-xl border bg-card p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            Scholarship Awarded
          </p>
          <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
            <Trophy className="size-4" />
          </div>
        </div>
        <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
          {stats.awardedCount}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Qualified for scholarship
        </p>
      </div>

      <div className="rounded-xl border bg-card p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            Not Awarded / Pending
          </p>
          <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
            <Clock className="size-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {stats.pendingCount}
          </p>
          <span className="text-xs text-muted-foreground">
            pending / {stats.notAwardedCount} unawarded
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Below cutoff or not entered
        </p>
      </div>
    </div>
  );
}
