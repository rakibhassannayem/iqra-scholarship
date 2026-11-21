"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  RefreshCw,
  Search,
  Filter,
  Trophy,
  SlidersHorizontal,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import ResultStats from "@/components/admin/results/ResultStats";
import ResultTable from "@/components/admin/results/ResultTable";
import type { AdminResultItem } from "@/types/result";
import type { Category } from "@/types/scholarship-category";
import type { Scholarship } from "@/types/scholarship";
import type { Institution } from "@/types/institution";

export default function AdminResultManagementPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [students, setStudents] = useState<AdminResultItem[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    enteredCount: 0,
    pendingCount: 0,
    awardedCount: 0,
    notAwardedCount: 0,
  });

  const [selectedScholarshipId, setSelectedScholarshipId] = useState<string>("");
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 1. Initial metadata fetch (scholarships, institutions)
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [scholarshipsRes, institutionsRes] = await Promise.all([
          fetch("/api/scholarships"),
          fetch("/api/institutions"),
        ]);

        if (scholarshipsRes.ok) {
          const sData = await scholarshipsRes.json();
          setScholarships(sData);

          // Find active scholarship as default
          const active = sData.find((s: Scholarship) => s.isActive);
          if (active) {
            setSelectedScholarshipId(String(active.id));
          } else if (sData.length > 0) {
            setSelectedScholarshipId(String(sData[0].id));
          }
        }

        if (institutionsRes.ok) {
          const iData = await institutionsRes.json();
          setInstitutions(iData);
        }
      } catch (err) {
        console.error("Failed to load initial metadata:", err);
      }
    }

    void loadInitialData();
  }, []);

  // 2. Fetch results based on filters
  const fetchResults = useCallback(async () => {
    if (!selectedScholarshipId) return;

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      params.set("scholarshipId", selectedScholarshipId);

      if (selectedInstitutionId) {
        params.set("institutionId", selectedInstitutionId);
      }
      if (selectedClass) {
        params.set("class", selectedClass);
      }
      if (search.trim()) {
        params.set("search", search.trim());
      }

      const res = await fetch(`/api/admin/results?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load results.");
      }

      setStudents(data.students || []);
      setCategories(data.categories || []);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load student results.",
      );
    } finally {
      setLoading(false);
    }
  }, [selectedScholarshipId, selectedInstitutionId, selectedClass, search]);

  useEffect(() => {
    if (selectedScholarshipId) {
      void fetchResults();
    }
  }, [fetchResults, selectedScholarshipId]);

  // Handle single student save
  const handleSaveSingle = async (studentId: number, marks: number) => {
    try {
      const res = await fetch("/api/admin/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scholarshipId: Number(selectedScholarshipId),
          studentId,
          marks,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to save marks.");
      }

      const updated = data.results?.[0];
      toast.add({
        title: "Marks Saved",
        description: updated?.categoryName
          ? `Marks saved (${marks}). Awarded: ${updated.categoryName}.`
          : `Marks saved (${marks}). Status: Not Awarded.`,
        type: "success",
      });

      await fetchResults();
    } catch (err) {
      toast.add({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save marks.",
        type: "error",
      });
      throw err;
    }
  };

  // Handle bulk students save
  const handleSaveBulk = async (
    entries: { studentId: number; marks: number }[],
  ) => {
    try {
      const res = await fetch("/api/admin/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scholarshipId: Number(selectedScholarshipId),
          entries,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to save bulk results.");
      }

      toast.add({
        title: "Bulk Save Complete",
        description: `Successfully updated ${entries.length} student result(s).`,
        type: "success",
      });

      await fetchResults();
    } catch (err) {
      toast.add({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to save bulk results.",
        type: "error",
      });
      throw err;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Result Management</h1>
          <p className="text-sm text-muted-foreground">
            Enter exam marks to automatically calculate scholarship awards and grant categories.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchResults}
          disabled={loading}
          className="gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Summary */}
      <ResultStats stats={stats} />

      {/* Category Rules & Marks Limits Banner */}
      <div className="rounded-xl border bg-card p-4 shadow-xs">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="size-4 text-primary" />
            <span className="text-sm font-semibold">Active Category Limits:</span>
          </div>

          <Link
            href="/admin/scholarship-categories"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            Manage Category Limits
            <ExternalLink className="size-3" />
          </Link>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {categories.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No categories configured yet. Go to{" "}
              <Link
                href="/admin/scholarship-categories"
                className="underline text-primary"
              >
                Scholarship Categories
              </Link>{" "}
              to define marks limits.
            </p>
          ) : (
            categories.map((cat) => {
              const hasRange = cat.minMarks !== null && cat.maxMarks !== null;
              const hasMin = cat.minMarks !== null && cat.maxMarks === null;
              const hasMax = cat.minMarks === null && cat.maxMarks !== null;

              return (
                <div
                  key={cat.id}
                  className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-1.5 text-xs"
                >
                  <span className="font-semibold text-foreground">{cat.name}:</span>
                  {hasRange ? (
                    <Badge variant="outline" className="font-mono text-xs">
                      {cat.minMarks} - {cat.maxMarks} marks
                    </Badge>
                  ) : hasMin ? (
                    <Badge variant="outline" className="font-mono text-xs">
                      ≥ {cat.minMarks} marks
                    </Badge>
                  ) : hasMax ? (
                    <Badge variant="outline" className="font-mono text-xs">
                      ≤ {cat.maxMarks} marks
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">No limit set</span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border bg-card p-4 shadow-xs">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {/* Scholarship Selector */}
          <div>
            <label
              htmlFor="scholarshipSelect"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Scholarship Program
            </label>
            <select
              id="scholarshipSelect"
              value={selectedScholarshipId}
              onChange={(e) => setSelectedScholarshipId(e.target.value)}
              className="h-9 w-full rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {scholarships.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.isActive ? "(Active)" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Institution Filter */}
          <div>
            <label
              htmlFor="institutionSelect"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Filter by Institution
            </label>
            <select
              id="institutionSelect"
              value={selectedInstitutionId}
              onChange={(e) => setSelectedInstitutionId(e.target.value)}
              className="h-9 w-full rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Institutions</option>
              {institutions.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name}
                </option>
              ))}
            </select>
          </div>

          {/* Class Filter */}
          <div>
            <label
              htmlFor="classSelect"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Filter by Class
            </label>
            <select
              id="classSelect"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="h-9 w-full rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Classes</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((cls) => (
                <option key={cls} value={cls}>
                  Class {cls}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div>
            <label
              htmlFor="searchInput"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Search Student
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                id="searchInput"
                placeholder="ID, Name, or Roll..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pl-8 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Result Table */}
      <ResultTable
        students={students}
        categories={categories}
        loading={loading}
        onSaveSingle={handleSaveSingle}
        onSaveBulk={handleSaveBulk}
      />
    </div>
  );
}
