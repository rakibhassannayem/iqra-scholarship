"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Search,
  Users,
  GraduationCap,
  Copy,
  Check,
  ArrowRight,
  Loader2,
  X,
  RotateCcw,
  AlertCircle,
  Hash,
  School,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/i18n/LanguageProvider";
import {
  toBengaliClass,
  toBengaliNumber,
} from "@/components/public/register/AdmitCard";

export type Institution = {
  id: number;
  name: string;
  eiin: string;
  upazila?: string | null;
  district?: string | null;
  address?: string | null;
};

export type StudentSummary = {
  id: number;
  studentId: string;
  name: string;
  class: number;
  roll: number;
  institutionId: number;
  institutionName: string;
};

interface InstitutionStudentFinderProps {
  onSelectStudent: (studentId: string) => void;
  onClose?: () => void;
}

export default function InstitutionStudentFinder({
  onSelectStudent,
  onClose,
}: InstitutionStudentFinderProps) {
  const { language } = useLanguage();
  const isBangla = language === "bn";

  // Institutions state
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loadingInstitutions, setLoadingInstitutions] = useState(true);
  const [institutionError, setInstitutionError] = useState("");

  // Institution Search & Selection
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedInstitution, setSelectedInstitution] =
    useState<Institution | null>(null);

  // Students state
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [studentsError, setStudentsError] = useState("");

  // Filter & Search inside students list
  const [selectedClass, setSelectedClass] = useState<number | "all">("all");
  const [studentSearchQuery, setStudentSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load institutions on mount
  useEffect(() => {
    async function loadInstitutions() {
      try {
        setLoadingInstitutions(true);
        setInstitutionError("");
        const res = await fetch("/api/institutions");
        if (!res.ok) throw new Error("Failed to fetch institutions");
        const data: Institution[] = await res.json();
        setInstitutions(data);
      } catch (err) {
        console.error("Error loading institutions:", err);
        setInstitutionError(
          isBangla
            ? "প্রতিষ্ঠানের তালিকা লোড করা যায়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।"
            : "Failed to load institutions list. Please try again.",
        );
      } finally {
        setLoadingInstitutions(false);
      }
    }
    loadInstitutions();
  }, [isBangla]);

  // Load students when institution is selected
  useEffect(() => {
    if (!selectedInstitution) {
      setStudents([]);
      return;
    }

    async function loadStudents() {
      try {
        setLoadingStudents(true);
        setStudentsError("");
        const res = await fetch(
          `/api/students?institutionId=${selectedInstitution?.id}`,
        );
        if (!res.ok) throw new Error("Failed to fetch students");
        const data: StudentSummary[] = await res.json();
        setStudents(data);
        setSelectedClass("all");
        setStudentSearchQuery("");
      } catch (err) {
        console.error("Error loading students:", err);
        setStudentsError(
          isBangla
            ? "শিক্ষার্থীদের তালিকা আনতে সমস্যা হয়েছে।"
            : "Failed to load students for this institution.",
        );
      } finally {
        setLoadingStudents(false);
      }
    }

    loadStudents();
  }, [selectedInstitution, isBangla]);

  // Filtered institutions for autocomplete dropdown
  const filteredInstitutions = useMemo(() => {
    if (!searchTerm.trim()) return institutions.slice(0, 10);
    const term = searchTerm.toLowerCase().trim();
    return institutions
      .filter((inst) => {
        const nameMatch = inst.name.toLowerCase().includes(term);
        const eiinMatch = inst.eiin.toLowerCase().includes(term);
        const upazilaMatch = inst.upazila?.toLowerCase().includes(term);
        const districtMatch = inst.district?.toLowerCase().includes(term);
        return nameMatch || eiinMatch || upazilaMatch || districtMatch;
      })
      .slice(0, 15);
  }, [institutions, searchTerm]);

  // Available classes in the selected institution
  const availableClasses = useMemo(() => {
    const classSet = new Set<number>();
    students.forEach((s) => classSet.add(s.class));
    return Array.from(classSet).sort((a, b) => a - b);
  }, [students]);

  // Filtered students according to class & search query
  const filteredStudents = useMemo(() => {
    let result = students;

    if (selectedClass !== "all") {
      result = result.filter((s) => s.class === selectedClass);
    }

    if (studentSearchQuery.trim()) {
      const q = studentSearchQuery.toLowerCase().trim();
      result = result.filter((s) => {
        const nameMatch = s.name.toLowerCase().includes(q);
        const idMatch = s.studentId.toLowerCase().includes(q);
        const rollMatch = String(s.roll).includes(q);
        const banglaRollMatch = toBengaliNumber(s.roll).includes(q);
        return nameMatch || idMatch || rollMatch || banglaRollMatch;
      });
    }

    return result;
  }, [students, selectedClass, studentSearchQuery]);

  // Copy Student ID handler
  const handleCopyId = (studentId: string) => {
    navigator.clipboard.writeText(studentId);
    setCopiedId(studentId);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Finder Header */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Building2 className="size-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-foreground">
                {isBangla
                  ? "প্রতিষ্ঠান অনুযায়ী স্টুডেন্ট আইডি অনুসন্ধান"
                  : "Find Student ID by Institution"}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {isBangla
                  ? "আপনার মাদরাসা/স্কুল নির্বাচন করুন এবং তালিকা থেকে নাম দেখে আপনার Student ID খুঁজুন"
                  : "Select your school/madrasa and find your Student ID from the student list"}
              </p>
            </div>
          </div>

          {onClose && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="self-end sm:self-center text-muted-foreground hover:text-foreground h-8 px-2"
            >
              <X className="size-4 mr-1" />
              {isBangla ? "বন্ধ করুন" : "Close"}
            </Button>
          )}
        </div>
      </div>

      {/* Step 1: Select Institution */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-foreground">
          {isBangla ? "১. প্রতিষ্ঠান নির্বাচন করুন" : "1. Select Institution"}
          <span className="text-destructive ml-1">*</span>
        </label>

        {institutionError && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>{institutionError}</span>
          </div>
        )}

        {!selectedInstitution ? (
          <div className="relative">
            <div className="relative">
              <School className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder={
                  loadingInstitutions
                    ? isBangla
                      ? "প্রতিষ্ঠানের তালিকা লোড হচ্ছে..."
                      : "Loading institutions..."
                    : isBangla
                      ? "প্রতিষ্ঠানের নাম বা EIIN লিখে অনুসন্ধান করুন..."
                      : "Search by institution name or EIIN..."
                }
                disabled={loadingInstitutions}
                className="h-11 pl-10 pr-10 text-sm"
              />
              {loadingInstitutions ? (
                <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground" />
              ) : searchTerm ? (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 text-xs"
                >
                  <X className="size-3.5" />
                </button>
              ) : null}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && !loadingInstitutions && (
              <div className="absolute z-30 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-border bg-card p-1 shadow-lg animate-in fade-in-50 duration-150">
                {filteredInstitutions.length > 0 ? (
                  filteredInstitutions.map((inst) => (
                    <button
                      key={inst.id}
                      type="button"
                      onClick={() => {
                        setSelectedInstitution(inst);
                        setShowSuggestions(false);
                        setSearchTerm("");
                      }}
                      className="w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent flex flex-col gap-0.5"
                    >
                      <span className="font-semibold text-foreground">
                        {inst.name}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="font-mono">EIIN: {inst.eiin}</span>
                        {(inst.upazila || inst.district) && (
                          <span>
                            • {[inst.upazila, inst.district].filter(Boolean).join(", ")}
                          </span>
                        )}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-4 text-center text-xs text-muted-foreground">
                    {isBangla
                      ? "কোনো প্রতিষ্ঠান পাওয়া যায়নি।"
                      : "No institution found matching your search."}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Selected Institution Badge / Card */
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 transition-all">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  <Building2 className="size-3" />
                  {isBangla ? "নির্বাচিত প্রতিষ্ঠান" : "Selected Institution"}
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  EIIN: {selectedInstitution.eiin}
                </span>
              </div>
              <h4 className="font-bold text-foreground text-base">
                {selectedInstitution.name}
              </h4>
              {(selectedInstitution.upazila || selectedInstitution.district) && (
                <p className="text-xs text-muted-foreground">
                  📍 {[selectedInstitution.upazila, selectedInstitution.district].filter(Boolean).join(", ")}
                </p>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedInstitution(null);
                setStudents([]);
              }}
              className="h-8 gap-1.5 text-xs border-primary/30 hover:bg-primary/10"
            >
              <RotateCcw className="size-3.5" />
              {isBangla ? "প্রতিষ্ঠান পরিবর্তন" : "Change Institution"}
            </Button>
          </div>
        )}
      </div>

      {/* Step 2: Students List Section */}
      {selectedInstitution && (
        <div className="space-y-4 pt-2 border-t border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label className="block text-sm font-semibold text-foreground">
                {isBangla
                  ? "২. নিবন্ধিত শিক্ষার্থীর তালিকা"
                  : "2. Registered Students List"}
              </label>
              <p className="text-xs text-muted-foreground">
                {isBangla
                  ? "নিচের তালিকা থেকে আপনার নাম ও রোল দেখে আইডিটি সিলেক্ট করুন"
                  : "Find your name and roll number, then click to view your admit card"}
              </p>
            </div>

            {!loadingStudents && students.length > 0 && (
              <span className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                <Users className="size-3.5" />
                {isBangla
                  ? `মোট শিক্ষার্থী: ${toBengaliNumber(students.length)} জন`
                  : `Total: ${students.length} students`}
              </span>
            )}
          </div>

          {/* Loading state for students */}
          {loadingStudents && (
            <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed border-border bg-muted/20">
              <Loader2 className="size-8 animate-spin text-primary mb-2" />
              <p className="text-sm font-medium text-foreground">
                {isBangla
                  ? "শিক্ষার্থীদের তালিকা লোড হচ্ছে..."
                  : "Loading registered students..."}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {isBangla ? "অনুগ্রহ করে অপেক্ষা করুন" : "Please wait a moment"}
              </p>
            </div>
          )}

          {/* Error loading students */}
          {studentsError && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3.5 text-sm text-destructive">
              <AlertCircle className="size-5 shrink-0" />
              <span>{studentsError}</span>
            </div>
          )}

          {/* Empty state: No students registered yet in this institution */}
          {!loadingStudents && !studentsError && students.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center rounded-xl border border-dashed border-border bg-muted/20">
              <GraduationCap className="size-10 text-muted-foreground/50 mb-2" />
              <h4 className="font-semibold text-foreground text-sm">
                {isBangla
                  ? "এই প্রতিষ্ঠানে কোনো শিক্ষার্থী নিবন্ধিত হয়নি"
                  : "No students registered for this institution yet"}
              </h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                {isBangla
                  ? "উক্ত মাদরাসা বা স্কুলের পক্ষ থেকে এখনও কোনো শিক্ষার্থী অনলাইনে নিবন্ধন করেনি।"
                  : "No online registrations were found for this school or madrasa."}
              </p>
            </div>
          )}

          {/* Filter Toolbar & Students List */}
          {!loadingStudents && !studentsError && students.length > 0 && (
            <div className="space-y-4">
              {/* Filter Controls Bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search inside students */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={
                      isBangla
                        ? "নাম, রোল বা আইডি দিয়ে খুঁজুন..."
                        : "Filter by name, roll, or ID..."
                    }
                    value={studentSearchQuery}
                    onChange={(e) => setStudentSearchQuery(e.target.value)}
                    className="h-10 pl-9 pr-8 text-xs sm:text-sm"
                  />
                  {studentSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setStudentSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>

                {/* Class selector chips / dropdown */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => setSelectedClass("all")}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedClass === "all"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    {isBangla ? "সকল শ্রেণি" : "All Classes"}
                  </button>

                  {availableClasses.map((cls) => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setSelectedClass(cls)}
                      className={`rounded-lg px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                        selectedClass === cls
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      {toBengaliClass(cls)}
                    </button>
                  ))}
                </div>
              </div>

              {/* No match state */}
              {filteredStudents.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground rounded-lg border border-border bg-muted/20">
                  {isBangla
                    ? "প্রদত্ত ফিল্টারের সাথে কোনো শিক্ষার্থী পাওয়া যায়নি।"
                    : "No students match your filter criteria."}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedClass("all");
                      setStudentSearchQuery("");
                    }}
                    className="block mx-auto mt-2 text-xs text-primary font-semibold hover:underline"
                  >
                    {isBangla ? "ফিল্টার রিসেট করুন" : "Reset Filters"}
                  </button>
                </div>
              ) : (
                <>
                  {/* Results summary */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                    <span>
                      {isBangla
                        ? `প্রদর্শিত হচ্ছে: ${toBengaliNumber(filteredStudents.length)} জন শিক্ষার্থী`
                        : `Showing ${filteredStudents.length} students`}
                    </span>
                    <span className="hidden sm:inline">
                      {isBangla
                        ? "💡 'প্রবেশপত্র দেখুন' বাটনে ক্লিক করলে প্রবেশপত্র খুলে যাবে"
                        : "💡 Click 'View Admit' to load admit card"}
                    </span>
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden sm:block overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                    <table className="w-full text-left text-sm">
                      <thead className="border-b border-border bg-muted/50 text-xs font-semibold text-muted-foreground">
                        <tr>
                          <th className="py-3 px-4">
                            {isBangla ? "রোল" : "Roll"}
                          </th>
                          <th className="py-3 px-4">
                            {isBangla ? "শিক্ষার্থীর নাম" : "Student Name"}
                          </th>
                          <th className="py-3 px-4">
                            {isBangla ? "শ্রেণি" : "Class"}
                          </th>
                          <th className="py-3 px-4">
                            {isBangla ? "স্টুডেন্ট আইডি" : "Student ID"}
                          </th>
                          <th className="py-3 px-4 text-right">
                            {isBangla ? "অ্যাকশন" : "Action"}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredStudents.map((st) => (
                          <tr
                            key={st.id}
                            className="hover:bg-muted/40 transition-colors group"
                          >
                            <td className="py-3 px-4 font-mono font-medium text-foreground">
                              {toBengaliNumber(st.roll)}
                            </td>
                            <td className="py-3 px-4 font-semibold text-foreground">
                              {st.name}
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">
                              <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                                {toBengaliClass(st.class)}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                                <Hash className="size-3 opacity-60" />
                                <span>{st.studentId}</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyId(st.studentId);
                                  }}
                                  title={isBangla ? "আইডি কপি করুন" : "Copy ID"}
                                  className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  {copiedId === st.studentId ? (
                                    <Check className="size-3 text-emerald-600" />
                                  ) : (
                                    <Copy className="size-3" />
                                  )}
                                </button>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => onSelectStudent(st.studentId)}
                                className="h-8 gap-1.5 text-xs font-semibold"
                              >
                                {isBangla ? "প্রবেশপত্র দেখুন" : "View Admit"}
                                <ArrowRight className="size-3.5" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card List View */}
                  <div className="sm:hidden space-y-2.5">
                    {filteredStudents.map((st) => (
                      <div
                        key={st.id}
                        className="rounded-xl border border-border bg-card p-3.5 shadow-sm space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h5 className="font-bold text-foreground text-sm">
                              {st.name}
                            </h5>
                            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="font-medium text-foreground">
                                {isBangla ? "রোল:" : "Roll:"}{" "}
                                {toBengaliNumber(st.roll)}
                              </span>
                              <span>•</span>
                              <span>{toBengaliClass(st.class)}</span>
                            </div>
                          </div>

                          <div className="inline-flex items-center gap-1 font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                            <span>{st.studentId}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyId(st.studentId)}
                              className="p-0.5 text-muted-foreground hover:text-foreground"
                            >
                              {copiedId === st.studentId ? (
                                <Check className="size-3 text-emerald-600" />
                              ) : (
                                <Copy className="size-3" />
                              )}
                            </button>
                          </div>
                        </div>

                        <Button
                          type="button"
                          size="sm"
                          onClick={() => onSelectStudent(st.studentId)}
                          className="w-full h-8 gap-1.5 text-xs font-semibold"
                        >
                          {isBangla
                            ? "এই শিক্ষার্থীর প্রবেশপত্র দেখুন"
                            : "View Admit Card"}
                          <ArrowRight className="size-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
