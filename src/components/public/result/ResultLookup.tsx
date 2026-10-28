"use client";

import { useState, useEffect, type FormEvent } from "react";
import {
  Search,
  RotateCcw,
  GraduationCap,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Trophy,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

// ── Types ─────────────────────────────────────────────────────────────────────

type ResultStatus = "awarded" | "not-awarded" | "not-registered";

type StudentResult = {
  studentId: string;
  name: string;
  class: number;
  roll: number;
  institutionName?: string;
  scholarshipName?: string | null;
  result: {
    status: ResultStatus;
    category: string | null;
  };
};

type Institution = {
  id: number;
  name: string;
  eiin: string;
};

function convertBengaliDigitsToEnglish(input: string): string {
  const banglaDigits: Record<string, string> = {
    "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
    "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
  };
  return input.replace(/[০-৯]/g, (d) => banglaDigits[d] || d);
}

// ── Result Card ───────────────────────────────────────────────────────────────

function ResultCard({
  student,
  isBangla,
}: {
  student: StudentResult;
  isBangla: boolean;
}) {
  const { status, category } = student.result;

  const statusConfig = {
    awarded: {
      icon: <CheckCircle2 className="size-6 text-emerald-500" />,
      label: isBangla ? "বৃত্তি পেয়েছে ✓" : "Scholarship Awarded ✓",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      border: "border-emerald-200 dark:border-emerald-800",
      text: "text-emerald-700 dark:text-emerald-400",
    },
    "not-awarded": {
      icon: <XCircle className="size-6 text-rose-500" />,
      label: isBangla ? "বৃত্তি পায়নি" : "Not Awarded",
      bg: "bg-rose-50 dark:bg-rose-950/30",
      border: "border-rose-200 dark:border-rose-800",
      text: "text-rose-700 dark:text-rose-400",
    },
    "not-registered": {
      icon: <Clock className="size-6 text-amber-500" />,
      label: isBangla ? "ফলাফল অপেক্ষমাণ" : "Result Pending",
      bg: "bg-amber-50 dark:bg-amber-950/30",
      border: "border-amber-200 dark:border-amber-800",
      text: "text-amber-700 dark:text-amber-400",
    },
  }[status];

  return (
    <div className="mt-5 overflow-hidden rounded-2xl border bg-card shadow-sm">
      {/* Header */}
      <div className="border-b bg-muted/40 px-6 py-4">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {isBangla ? "বৃত্তি পরীক্ষার ফলাফল" : "Scholarship Result"}
        </p>
        <h3 className="mt-1 text-xl font-bold">
          {isBangla ? "ফলাফল বিবরণী" : "Result Summary"}
        </h3>
        <p className="mt-0.5 font-mono text-xs text-muted-foreground">
          ID: {student.studentId}
        </p>
      </div>

      {/* Info grid */}
      <div className="grid gap-4 p-6 sm:grid-cols-2">
        <div className="rounded-xl border bg-background p-4">
          <p className="text-xs text-muted-foreground">
            {isBangla ? "শিক্ষার্থীর নাম" : "Student Name"}
          </p>
          <p className="mt-1.5 font-semibold">{student.name}</p>
        </div>

        <div className="rounded-xl border bg-background p-4">
          <p className="text-xs text-muted-foreground">
            {isBangla ? "শ্রেণি / রোল" : "Class / Roll"}
          </p>
          <p className="mt-1.5 font-semibold">
            {isBangla
              ? `শ্রেণি ${student.class} / রোল ${student.roll}`
              : `Class ${student.class} / Roll ${student.roll}`}
          </p>
        </div>

        {student.institutionName && (
          <div className="rounded-xl border bg-background p-4 sm:col-span-2">
            <p className="text-xs text-muted-foreground">
              {isBangla ? "প্রতিষ্ঠান" : "Institution"}
            </p>
            <p className="mt-1.5 font-semibold">{student.institutionName}</p>
          </div>
        )}

        {student.scholarshipName && (
          <div className="rounded-xl border bg-background p-4 sm:col-span-2">
            <p className="text-xs text-muted-foreground">
              {isBangla ? "বৃত্তি পরীক্ষা" : "Scholarship"}
            </p>
            <p className="mt-1.5 font-semibold">{student.scholarshipName}</p>
          </div>
        )}

        {/* Status badge */}
        <div
          className={`flex items-center gap-3 rounded-xl border p-4 sm:col-span-2 ${statusConfig.bg} ${statusConfig.border}`}
        >
          {statusConfig.icon}
          <div>
            <p className="text-xs text-muted-foreground">
              {isBangla ? "ফলাফল" : "Result Status"}
            </p>
            <p className={`mt-0.5 text-lg font-bold ${statusConfig.text}`}>
              {statusConfig.label}
            </p>
          </div>
        </div>

        {/* Category */}
        {status === "awarded" && category && (
          <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:col-span-2">
            <Trophy className="size-6 shrink-0 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">
                {isBangla ? "বৃত্তির ক্যাটাগরি" : "Scholarship Category"}
              </p>
              <p className="mt-0.5 text-lg font-bold text-primary">
                {category}
              </p>
            </div>
          </div>
        )}

        {status === "not-awarded" && (
          <p className="text-sm leading-6 text-muted-foreground sm:col-span-2">
            {isBangla
              ? "এই পরীক্ষায় শিক্ষার্থী বৃত্তির জন্য নির্বাচিত হয়নি।"
              : "The student was not selected for a scholarship in this examination."}
          </p>
        )}

        {status === "not-registered" && (
          <p className="text-sm leading-6 text-muted-foreground sm:col-span-2">
            {isBangla
              ? "এই শিক্ষার্থীর ফলাফল এখনো প্রকাশিত হয়নি। পরে আবার দেখুন।"
              : "This student's result has not been published yet. Please check again later."}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ResultLookup() {
  const { language } = useLanguage();
  const isBangla = language === "bn";

  // --- ID tab ---
  const [studentIdInput, setStudentIdInput] = useState("");
  const [idLoading, setIdLoading] = useState(false);
  const [idError, setIdError] = useState("");
  const [idResult, setIdResult] = useState<StudentResult | null>(null);

  // --- Institution tab ---
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [institutionsLoading, setInstitutionsLoading] = useState(true);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState("");
  const [studentList, setStudentList] = useState<StudentResult[] | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentResult | null>(
    null,
  );

  // Fetch institutions on mount
  useEffect(() => {
    fetch("/api/institutions")
      .then((res) => res.json())
      .then((data: Institution[]) => setInstitutions(data))
      .catch(() => {})
      .finally(() => setInstitutionsLoading(false));
  }, []);

  // ── ID search ────────────────────────────────────────────────────────
  async function handleIdSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanId = convertBengaliDigitsToEnglish(studentIdInput.trim());
    if (!cleanId) return;

    setIdLoading(true);
    setIdError("");
    setIdResult(null);

    try {
      const res = await fetch(
        `/api/result?studentId=${encodeURIComponent(cleanId)}`,
      );
      const data = await res.json();

      if (!res.ok) {
        setIdError(
          data.message ||
            (isBangla
              ? "এই ID-এর কোনো ফলাফল পাওয়া যায়নি।"
              : "No result found for this Student ID."),
        );
      } else {
        setIdResult(data as StudentResult);
      }
    } catch {
      setIdError(
        isBangla
          ? "ফলাফল আনতে সমস্যা হয়েছে। আবার চেষ্টা করুন।"
          : "Failed to fetch result. Please try again.",
      );
    } finally {
      setIdLoading(false);
    }
  }

  function resetIdSearch() {
    setStudentIdInput("");
    setIdError("");
    setIdResult(null);
  }

  // ── Institution list search ──────────────────────────────────────────
  async function handleListSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedInstitutionId || !selectedClass) return;

    setListLoading(true);
    setListError("");
    setStudentList(null);
    setSelectedStudent(null);

    try {
      const res = await fetch(
        `/api/result?institutionId=${encodeURIComponent(selectedInstitutionId)}&class=${encodeURIComponent(selectedClass)}`,
      );
      const data = await res.json();

      if (!res.ok) {
        setListError(
          data.message ||
            (isBangla
              ? "তালিকা আনতে সমস্যা হয়েছে।"
              : "Failed to load student list."),
        );
      } else {
        setStudentList(data as StudentResult[]);
      }
    } catch {
      setListError(
        isBangla
          ? "তালিকা আনতে সমস্যা হয়েছে। আবার চেষ্টা করুন।"
          : "Failed to load student list. Please try again.",
      );
    } finally {
      setListLoading(false);
    }
  }

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <section className="bg-background px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl space-y-8">

        {/* ── Card 1: Search by Student ID ─────────────────────────── */}
        <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-8">
          <div className="mb-6 flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Search className="size-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">
                {isBangla ? "Student ID দিয়ে ফলাফল" : "Search by Student ID"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {isBangla
                  ? "আপনার নিবন্ধনের সময় পাওয়া Student ID লিখুন।"
                  : "Enter the Student ID generated during registration."}
              </p>
            </div>
          </div>

          <form
            onSubmit={handleIdSearch}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              required
              value={studentIdInput}
              onChange={(e) => {
                setStudentIdInput(e.target.value);
                setIdResult(null);
                setIdError("");
              }}
              placeholder={isBangla ? "যেমন: 26123456815" : "e.g. 26123456815"}
              aria-label="Student ID"
              className="h-11 min-w-0 flex-1 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              type="submit"
              disabled={idLoading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {idLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Search className="size-4" />
              )}
              {isBangla ? "ফলাফল খুঁজুন" : "Search"}
            </button>
            <button
              type="button"
              onClick={resetIdSearch}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium hover:bg-muted"
            >
              <RotateCcw className="size-4" />
              {isBangla ? "রিসেট" : "Reset"}
            </button>
          </form>

          {idError && (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
            >
              {idError}
            </p>
          )}

          {idResult && <ResultCard student={idResult} isBangla={isBangla} />}
        </div>

        {/* ── Card 2: Browse by Institution ────────────────────────── */}
        <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-8">
          <div className="mb-6 flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <GraduationCap className="size-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">
                {isBangla
                  ? "Student ID ভুলে গেছেন?"
                  : "Forgot your Student ID?"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {isBangla
                  ? "প্রতিষ্ঠান ও শ্রেণি নির্বাচন করে শিক্ষার্থীদের তালিকা থেকে ফলাফল দেখুন।"
                  : "Select your institution and class to browse the student list and view results."}
              </p>
            </div>
          </div>

          <form
            onSubmit={handleListSearch}
            className="grid gap-5 sm:grid-cols-2"
          >
            <div className="space-y-2">
              <label
                htmlFor="result-institution"
                className="text-sm font-medium"
              >
                {isBangla ? "প্রতিষ্ঠান" : "Institution"}
              </label>
              <select
                id="result-institution"
                required
                disabled={institutionsLoading}
                value={selectedInstitutionId}
                onChange={(e) => {
                  setSelectedInstitutionId(e.target.value);
                  setStudentList(null);
                  setSelectedStudent(null);
                }}
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
              >
                <option value="">
                  {institutionsLoading
                    ? isBangla
                      ? "লোড হচ্ছে..."
                      : "Loading..."
                    : isBangla
                      ? "প্রতিষ্ঠান নির্বাচন করুন"
                      : "Select institution"}
                </option>
                {institutions.map((inst) => (
                  <option key={inst.id} value={String(inst.id)}>
                    {inst.name} ({inst.eiin})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="result-class-list"
                className="text-sm font-medium"
              >
                {isBangla ? "শ্রেণি" : "Class"}
              </label>
              <select
                id="result-class-list"
                required
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setStudentList(null);
                  setSelectedStudent(null);
                }}
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">
                  {isBangla ? "শ্রেণি নির্বাচন করুন" : "Select class"}
                </option>
                {Array.from({ length: 10 }, (_, i) => String(i + 1)).map(
                  (v) => (
                    <option key={v} value={v}>
                      {isBangla ? `শ্রেণি ${v}` : `Class ${v}`}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={listLoading}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60 sm:w-auto"
              >
                {listLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Search className="size-4" />
                )}
                {isBangla ? "শিক্ষার্থীদের তালিকা দেখুন" : "Show Students"}
              </button>
            </div>
          </form>

          {listError && (
            <p
              role="alert"
              className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
            >
              {listError}
            </p>
          )}

          {studentList !== null && (
            <div className="mt-7">
              <h3 className="mb-3 text-lg font-bold">
                {isBangla ? "শিক্ষার্থীদের তালিকা" : "Student List"}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({studentList.length}{" "}
                  {isBangla ? "জন" : "students"})
                </span>
              </h3>

              {studentList.length === 0 ? (
                <div className="rounded-xl border border-dashed py-12 text-center text-sm text-muted-foreground">
                  {isBangla
                    ? "এই শ্রেণিতে কোনো শিক্ষার্থী নেই।"
                    : "No students found for this class."}
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border">
                  <table className="w-full min-w-[560px] text-left text-sm">
                    <thead className="bg-muted/60">
                      <tr>
                        <th className="px-4 py-3 font-semibold">
                          Student ID
                        </th>
                        <th className="px-4 py-3 font-semibold">
                          {isBangla ? "নাম" : "Name"}
                        </th>
                        <th className="px-4 py-3 font-semibold">
                          {isBangla ? "রোল" : "Roll"}
                        </th>
                        <th className="px-4 py-3 font-semibold">
                          {isBangla ? "ফলাফল" : "Result"}
                        </th>
                        <th className="px-4 py-3 text-right font-semibold">
                          {isBangla ? "বিস্তারিত" : "Details"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {studentList.map((student) => {
                        const badgeStyle = {
                          awarded:
                            "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
                          "not-awarded":
                            "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
                          "not-registered":
                            "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
                        }[student.result.status];

                        const badgeLabel = {
                          awarded: isBangla ? "বৃত্তি পেয়েছে" : "Awarded",
                          "not-awarded": isBangla ? "পায়নি" : "Not Awarded",
                          "not-registered": isBangla
                            ? "অপেক্ষমাণ"
                            : "Pending",
                        }[student.result.status];

                        return (
                          <tr
                            key={student.studentId}
                            className="transition-colors hover:bg-muted/40"
                          >
                            <td className="px-4 py-3 font-mono text-xs font-medium">
                              {student.studentId}
                            </td>
                            <td className="px-4 py-3">{student.name}</td>
                            <td className="px-4 py-3">{student.roll}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeStyle}`}
                              >
                                {badgeLabel}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedStudent(
                                    selectedStudent?.studentId ===
                                      student.studentId
                                      ? null
                                      : student,
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                              >
                                <Eye className="size-3.5" />
                                {selectedStudent?.studentId === student.studentId
                                  ? isBangla
                                    ? "বন্ধ করুন"
                                    : "Close"
                                  : isBangla
                                    ? "দেখুন"
                                    : "View"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {selectedStudent && (
                <ResultCard student={selectedStudent} isBangla={isBangla} />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
