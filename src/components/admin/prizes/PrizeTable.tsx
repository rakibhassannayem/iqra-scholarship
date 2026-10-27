"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  CheckCircle2,
  Clock,
  Trophy,
  Copy,
  Check,
  X,
  UserCheck,
  Award,
  CircleDollarSign,
  Info,
} from "lucide-react";

export type PrizeItem = {
  id: number;
  grantId: number;
  studentDbId: number;
  studentId: string;
  studentName: string;
  class: number;
  roll: number;
  institutionId: number;
  institutionName: string;
  institutionEiin: string;
  scholarshipId: number;
  scholarshipName: string;
  categoryId: number;
  categoryName: string;
  awardAmount: number;
  grantStatus: "granted" | "revoked";
  prizeStatus: "pending" | "received";
  prizeReceivedAt: string | null;
  confirmedBy: string | null;
  prizeNotes: string | null;
  grantedAt: string;
  createdAt: string;
};

type PrizeTableProps = {
  prizes: PrizeItem[];
  onOpenConfirmModal: (item: PrizeItem) => void;
  onQuickToggle: (item: PrizeItem) => void;
  updatingId: number | null;
};

export default function PrizeTable({
  prizes,
  onOpenConfirmModal,
  onQuickToggle,
  updatingId,
}: PrizeTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [institutionFilter, setInstitutionFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Distinct institutions & categories
  const distinctInstitutions = useMemo(() => {
    const map = new Map<string, string>();
    prizes.forEach((p) => {
      if (p.institutionName) map.set(p.institutionName, p.institutionName);
    });
    return Array.from(map.values());
  }, [prizes]);

  const distinctCategories = useMemo(() => {
    const map = new Map<string, string>();
    prizes.forEach((p) => {
      if (p.categoryName) map.set(p.categoryName, p.categoryName);
    });
    return Array.from(map.values());
  }, [prizes]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = prizes.length;
    const received = prizes.filter((p) => p.prizeStatus === "received").length;
    const pending = total - received;
    const percentage = total > 0 ? Math.round((received / total) * 100) : 0;
    const totalAwardAmount = prizes
      .filter((p) => p.prizeStatus === "received")
      .reduce((sum, p) => sum + p.awardAmount, 0);

    return { total, received, pending, percentage, totalAwardAmount };
  }, [prizes]);

  // Filtered prizes
  const filteredPrizes = useMemo(() => {
    return prizes.filter((item) => {
      const q = search.trim().toLowerCase();
      if (q) {
        const matchesName = item.studentName.toLowerCase().includes(q);
        const matchesId = item.studentId.toLowerCase().includes(q);
        const matchesInst = item.institutionName.toLowerCase().includes(q);
        const matchesCategory = item.categoryName.toLowerCase().includes(q);
        const matchesStaff = item.confirmedBy?.toLowerCase().includes(q);
        if (
          !matchesName &&
          !matchesId &&
          !matchesInst &&
          !matchesCategory &&
          !matchesStaff
        ) {
          return false;
        }
      }

      if (statusFilter !== "all" && item.prizeStatus !== statusFilter) {
        return false;
      }

      if (
        institutionFilter !== "all" &&
        item.institutionName !== institutionFilter
      ) {
        return false;
      }

      if (categoryFilter !== "all" && item.categoryName !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [prizes, search, statusFilter, institutionFilter, categoryFilter]);

  const hasActiveFilters =
    search.trim() !== "" ||
    statusFilter !== "all" ||
    institutionFilter !== "all" ||
    categoryFilter !== "all";

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setInstitutionFilter("all");
    setCategoryFilter("all");
  }

  async function handleCopy(id: string) {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Total Granted Students
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Award className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold">{stats.total}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Eligible scholarship recipients
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Prizes Received
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.received}
            </p>
            <span className="text-xs font-medium text-muted-foreground">
              ({stats.percentage}% confirmed)
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-green-600 transition-all duration-300"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Pending Distribution
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-amber-600 dark:text-amber-400">
            {stats.pending}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Awaiting confirmation
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Distributed Amount
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
              <CircleDollarSign className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold">
            ৳{stats.totalAwardAmount.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Total amount received by students
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by student name, ID, school, staff..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="all">All Statuses</option>
            <option value="received">Received (গৃহীত)</option>
            <option value="pending">Pending (অপেক্ষমাণ)</option>
          </select>

          {/* Institution Filter */}
          {distinctInstitutions.length > 0 && (
            <select
              value={institutionFilter}
              onChange={(e) => setInstitutionFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="all">All Institutions</option>
              {distinctInstitutions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          )}

          {/* Category Filter */}
          {distinctCategories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="all">All Categories</option>
              {distinctCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-9 gap-1 px-2.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Table Results Count */}
      <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
        <span>
          Showing{" "}
          <strong className="text-foreground">{filteredPrizes.length}</strong>{" "}
          of {prizes.length} recipients
        </span>
        {hasActiveFilters && (
          <span className="text-primary font-medium">Filtered results</span>
        )}
      </div>

      {/* Table */}
      {filteredPrizes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <Trophy className="size-12 text-muted-foreground/30" />
          <h3 className="mt-4 text-base font-semibold">No prize records found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {hasActiveFilters
              ? "No records match your selected filter criteria."
              : "No scholarship grants have been awarded yet."}
          </p>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="mt-4 gap-1.5"
            >
              <X className="size-3.5" /> Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3.5 font-semibold">Student & ID</th>
                  <th className="px-4 py-3.5 font-semibold">Institution</th>
                  <th className="px-4 py-3.5 font-semibold">Scholarship & Award</th>
                  <th className="px-4 py-3.5 font-semibold">Prize Status</th>
                  <th className="px-4 py-3.5 font-semibold">Confirmation Info</th>
                  <th className="px-4 py-3.5 text-right font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {filteredPrizes.map((item) => {
                  const isReceived = item.prizeStatus === "received";
                  const isUpdating = updatingId === item.grantId;
                  const isCopied = copiedId === item.studentId;

                  const formattedDate = item.prizeReceivedAt
                    ? new Date(item.prizeReceivedAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : null;

                  return (
                    <tr
                      key={item.grantId}
                      className="transition-colors hover:bg-muted/40"
                    >
                      {/* Student */}
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-foreground">
                          {item.studentName}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <Badge
                            variant="secondary"
                            className="font-mono text-[11px] font-medium"
                          >
                            {item.studentId}
                          </Badge>
                          <button
                            type="button"
                            onClick={() => handleCopy(item.studentId)}
                            title="Copy Student ID"
                            aria-label="Copy Student ID"
                            className="rounded p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                          >
                            {isCopied ? (
                              <Check className="size-3 text-green-600" />
                            ) : (
                              <Copy className="size-3" />
                            )}
                          </button>
                          <span className="text-xs text-muted-foreground">
                            • Class {item.class}, Roll {item.roll}
                          </span>
                        </div>
                      </td>

                      {/* Institution */}
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-foreground">
                          {item.institutionName}
                        </div>
                        {item.institutionEiin && (
                          <span className="font-mono text-xs text-muted-foreground">
                            EIIN: {item.institutionEiin}
                          </span>
                        )}
                      </td>

                      {/* Category & Amount */}
                      <td className="px-4 py-3.5">
                        <div>
                          <Badge variant="outline" className="text-xs font-medium">
                            {item.categoryName}
                          </Badge>
                        </div>
                        <div className="mt-1 text-xs font-bold text-foreground">
                          ৳{item.awardAmount.toLocaleString()}
                        </div>
                      </td>

                      {/* Prize Status */}
                      <td className="px-4 py-3.5">
                        {isReceived ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-semibold text-green-700 dark:text-green-400">
                            <CheckCircle2 className="size-3.5" />
                            Received
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
                            <Clock className="size-3.5" />
                            Pending
                          </span>
                        )}
                      </td>

                      {/* Confirmation Info */}
                      <td className="px-4 py-3.5 text-xs text-muted-foreground">
                        {isReceived ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1 text-foreground font-medium">
                              <UserCheck className="size-3.5 text-green-600" />
                              <span>{item.confirmedBy || "Staff"}</span>
                            </div>
                            {formattedDate && (
                              <p className="text-[11px] text-muted-foreground">
                                on {formattedDate}
                              </p>
                            )}
                            {item.prizeNotes && (
                              <p className="text-[11px] italic text-muted-foreground line-clamp-1" title={item.prizeNotes}>
                                "{item.prizeNotes}"
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">
                            Not yet confirmed
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isReceived ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onOpenConfirmModal(item)}
                              disabled={isUpdating}
                              className="h-8 gap-1 text-xs"
                            >
                              Edit Details
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => onOpenConfirmModal(item)}
                              disabled={isUpdating}
                              className="h-8 gap-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium"
                            >
                              <CheckCircle2 className="size-3.5" />
                              Confirm Receipt
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
