"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Award,
  Printer,
  RefreshCw,
  Search,
  Filter,
  CheckSquare,
  Square,
  FileCheck2,
  School,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CertificateData } from "@/types/certificate";
import CertificateModal from "@/components/admin/certificates/CertificateModal";
import CertificateView from "@/components/admin/certificates/CertificateView";

type MetaItem = {
  id: number;
  name: string;
};

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [scholarships, setScholarships] = useState<(MetaItem & { academicYear: string; isActive: boolean })[]>([]);
  const [institutions, setInstitutions] = useState<(MetaItem & { eiin: string })[]>([]);
  const [categories, setCategories] = useState<MetaItem[]>([]);

  const [selectedScholarshipId, setSelectedScholarshipId] = useState<string>("");
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Single Certificate preview modal state
  const [viewingCertificate, setViewingCertificate] = useState<CertificateData | null>(null);

  // Selected students for bulk printing
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Bulk print view mode (shows all selected certificates in one printable flow)
  const [bulkPrintMode, setBulkPrintMode] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (selectedScholarshipId) params.set("scholarshipId", selectedScholarshipId);
      if (selectedInstitutionId) params.set("institutionId", selectedInstitutionId);
      if (selectedClass) params.set("class", selectedClass);
      if (selectedCategoryId) params.set("categoryId", selectedCategoryId);
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/admin/certificates?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load certificate records.");
      }

      setCertificates(data.certificates || []);
      if (data.scholarships) setScholarships(data.scholarships);
      if (data.institutions) setInstitutions(data.institutions);
      if (data.categories) setCategories(data.categories);

      if (!selectedScholarshipId && data.selectedScholarshipId) {
        setSelectedScholarshipId(String(data.selectedScholarshipId));
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load certificate records.",
      );
    } finally {
      setLoading(false);
    }
  }, [selectedScholarshipId, selectedInstitutionId, selectedClass, selectedCategoryId, search]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  // Handle Select All / Toggle Single
  const allSelected =
    certificates.length > 0 && selectedIds.size === certificates.length;

  const handleToggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(certificates.map((c) => c.studentDbId)));
    }
  };

  const handleToggleSingle = (id: number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  // Certificates chosen for bulk printing
  const bulkPrintCertificates = certificates.filter((c) =>
    selectedIds.has(c.studentDbId),
  );

  // If in bulk print mode, show the full CertificateView with an onBack button
  if (bulkPrintMode) {
    return (
      <div className="space-y-4">
        <CertificateView
          data={bulkPrintCertificates.length > 0 ? bulkPrintCertificates : certificates}
          onBack={() => setBulkPrintMode(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Award className="size-6 text-emerald-700" />
            বৃত্তি সনদপত্র (Certificate Management)
          </h1>
          <p className="text-sm text-muted-foreground">
            মেধা বৃত্তি পরীক্ষায় উত্তীর্ণ শিক্ষার্থীদের অফিশিয়াল সনদ তৈরি ও প্রিন্ট করুন।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={loading}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            রিফ্রেশ
          </Button>

          {selectedIds.size > 0 && (
            <Button
              size="sm"
              onClick={() => setBulkPrintMode(true)}
              className="gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-sm"
            >
              <Printer className="size-4" />
              নির্বাচিত ({selectedIds.size})টি সনদ প্রিন্ট
            </Button>
          )}

          {certificates.length > 0 && selectedIds.size === 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedIds(new Set(certificates.map((c) => c.studentDbId)));
                setBulkPrintMode(true);
              }}
              className="gap-1.5 text-xs text-emerald-800 border-emerald-700/40 hover:bg-emerald-50"
            >
              <Printer className="size-4 text-emerald-700" />
              সকল সনদ ({certificates.length}টি) একসাথে প্রিন্ট
            </Button>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-xl border bg-card p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* Scholarship filter */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">
              বৃত্তি কর্মসূচি (Scholarship)
            </label>
            <select
              value={selectedScholarshipId}
              onChange={(e) => {
                setSelectedScholarshipId(e.target.value);
                setSelectedIds(new Set());
              }}
              className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">সব কর্মসূচি</option>
              {scholarships.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.academicYear}) {s.isActive ? "— চলমান" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Institution filter */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">
              প্রতিষ্ঠান (Institution)
            </label>
            <select
              value={selectedInstitutionId}
              onChange={(e) => {
                setSelectedInstitutionId(e.target.value);
                setSelectedIds(new Set());
              }}
              className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">সকল প্রতিষ্ঠান</option>
              {institutions.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
          </div>

          {/* Class filter */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">
              শ্রেণি (Class)
            </label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedIds(new Set());
              }}
              className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">সকল শ্রেণি</option>
              {Array.from({ length: 10 }, (_, i) => String(i + 1)).map((cls) => (
                <option key={cls} value={cls}>
                  Class {cls}
                </option>
              ))}
            </select>
          </div>

          {/* Category filter */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">
              ক্যাটাগরি (Category)
            </label>
            <select
              value={selectedCategoryId}
              onChange={(e) => {
                setSelectedCategoryId(e.target.value);
                setSelectedIds(new Set());
              }}
              className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">সকল ক্যাটাগরি</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search box */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">
              অনুসন্ধান (Search)
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
              <Input
                placeholder="নাম / রোল / আইডি..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIds(new Set());
                }}
                className="h-9 pl-8 text-xs bg-background"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Certificate Table */}
      <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-12 text-center">
                <button
                  type="button"
                  onClick={handleToggleSelectAll}
                  className="flex items-center justify-center text-muted-foreground hover:text-foreground"
                  aria-label="Select all"
                >
                  {allSelected ? (
                    <CheckSquare className="size-4 text-emerald-700" />
                  ) : (
                    <Square className="size-4" />
                  )}
                </button>
              </TableHead>
              <TableHead>শিক্ষার্থী ও পিতা-মাতা</TableHead>
              <TableHead>প্রতিষ্ঠান ও কেন্দ্র</TableHead>
              <TableHead className="text-center">শ্রেণি ও রোল</TableHead>
              <TableHead className="text-center">সনদ ক্যাটাগরি</TableHead>
              <TableHead className="text-center">প্রাপ্ত নম্বর</TableHead>
              <TableHead className="text-right">একশন</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-40 text-center">
                  <div className="inline-flex size-7 animate-spin items-center justify-center rounded-full border-2 border-emerald-700 border-t-transparent mb-2" />
                  <p className="text-xs text-muted-foreground">সনদ তালিকা লোড হচ্ছে...</p>
                </TableCell>
              </TableRow>
            ) : certificates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground text-xs">
                  প্রদত্ত ফিল্টারের সাথে কোনো শিক্ষার্থীর রেকর্ড পাওয়া যায়নি।
                </TableCell>
              </TableRow>
            ) : (
              certificates.map((cert) => {
                const isSelected = selectedIds.has(cert.studentDbId);

                return (
                  <TableRow
                    key={cert.studentDbId}
                    className={`transition-colors hover:bg-muted/30 ${
                      isSelected ? "bg-emerald-500/5" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <TableCell className="text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleSingle(cert.studentDbId)}
                        className="flex items-center justify-center text-muted-foreground hover:text-foreground"
                      >
                        {isSelected ? (
                          <CheckSquare className="size-4 text-emerald-700" />
                        ) : (
                          <Square className="size-4" />
                        )}
                      </button>
                    </TableCell>

                    {/* Student Name & Parents */}
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-bold text-foreground text-sm">
                          {cert.studentName}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          আইডি: <span className="font-mono font-medium">{cert.studentId}</span>
                        </p>
                        {(cert.fatherName || cert.motherName) && (
                          <p className="text-[11px] text-stone-600">
                            পিতা: {cert.fatherName || "—"} | মাতা: {cert.motherName || "—"}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    {/* Institution */}
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-semibold text-foreground text-xs line-clamp-1">
                          {cert.institutionName}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          কেন্দ্র: {cert.examCenter || "—"}
                        </p>
                      </div>
                    </TableCell>

                    {/* Class & Roll */}
                    <TableCell className="text-center">
                      <p className="font-medium text-xs text-foreground">
                        {cert.className}
                      </p>
                      <p className="text-[11px] font-mono text-muted-foreground">
                        রোল: {cert.roll}
                      </p>
                    </TableCell>

                    {/* Category Badge */}
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className="font-bold border-amber-600/40 bg-amber-500/10 text-amber-900 text-xs"
                      >
                        {cert.categoryName}
                      </Badge>
                    </TableCell>

                    {/* Marks */}
                    <TableCell className="text-center font-bold text-sm">
                      {cert.marks !== null && cert.marks !== undefined ? (
                        <span className="text-emerald-800">{cert.marks}</span>
                      ) : (
                        <span className="text-muted-foreground font-normal text-xs">—</span>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setViewingCertificate(cert)}
                        className="gap-1.5 text-xs text-emerald-800 border-emerald-600/30 hover:bg-emerald-50 hover:border-emerald-600 font-semibold"
                      >
                        <Printer className="size-3.5 text-emerald-700" />
                        সনদ দেখুন / প্রিন্ট
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Single Certificate Preview & Quick-Edit Modal */}
      <CertificateModal
        certificate={viewingCertificate}
        open={Boolean(viewingCertificate)}
        onOpenChange={(open) => {
          if (!open) setViewingCertificate(null);
        }}
      />
    </div>
  );
}
