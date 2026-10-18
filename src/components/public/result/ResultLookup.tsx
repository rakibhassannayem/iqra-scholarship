"use client";

import { useState, type FormEvent } from "react";
import { Search, RotateCcw, Eye, GraduationCap } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

type ScholarshipResult = {
  status: "awarded" | "not-awarded" | "pending";
  amount: number | null;
  category: string | null;
};

type Student = {
  id: string;
  name: string;
  eiin: string;
  classId: string;
  roll: string;
  result: ScholarshipResult;
};

const institutions = [
  { eiin: "123456", name: "Demo Madrasa 1" },
  { eiin: "654321", name: "Demo Madrasa 2" },
];

// Temporary sample records for UI testing only.
// Replace these with records fetched from your database.

const demoStudents: Student[] = [
  {
    id: "iq26123456815",
    name: "Demo Student One",
    eiin: "123456",
    classId: "8",
    roll: "15",
    result: {
      status: "awarded",
      amount: 12000,
      category: "Talent Pool",
    },
  },
  {
    id: "iq26123456816",
    name: "Demo Student Two",
    eiin: "123456",
    classId: "8",
    roll: "16",
    result: {
      status: "not-awarded",
      amount: null,
      category: null,
    },
  },
  {
    id: "iq26654321607",
    name: "Demo Student Three",
    eiin: "654321",
    classId: "6",
    roll: "7",
    result: {
      status: "pending",
      amount: null,
      category: null,
    },
  },
];

export default function ResultLookup() {
  const { language } = useLanguage();
  const isBangla = language === "bn";

  const [studentId, setStudentId] = useState("");
  const [searchedStudent, setSearchedStudent] = useState<Student | null>(null);
  const [searchMessage, setSearchMessage] = useState("");

  const [selectedEiin, setSelectedEiin] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [showStudentList, setShowStudentList] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  function handleIdSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedId = studentId.trim().toLowerCase();
    const student = demoStudents.find(
      (item) => item.id.toLowerCase() === normalizedId,
    );

    setSearchedStudent(student ?? null);
    setSelectedStudent(null);
    setSearchMessage(
      student
        ? ""
        : isBangla
          ? "এই ID-এর কোনো demo record পাওয়া যায়নি। বাস্তব ফলাফল খুঁজতে database সংযোগ প্রয়োজন।"
          : "No demo record found for this ID. Database connection is required for real results.",
    );
  }

  function handleStudentListSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShowStudentList(true);
    setSelectedStudent(null);
  }

  function resetIdSearch() {
    setStudentId("");
    setSearchedStudent(null);
    setSearchMessage("");
  }

  const filteredStudents = demoStudents.filter(
    (student) =>
      student.eiin === selectedEiin && student.classId === selectedClass,
  );

  function renderStudentResult(student: Student) {
    const result = student.result;

    const statusLabel = {
      awarded: isBangla ? "বৃত্তি পেয়েছে" : "Scholarship Awarded",
      "not-awarded": isBangla ? "বৃত্তি পায়নি" : "Not Awarded",
      pending: isBangla ? "ফলাফল অপেক্ষমাণ" : "Result Pending",
    }[result.status];

    return (
      <div className="mt-5 rounded-2xl border bg-card p-5 sm:p-7">
        <div className="border-b pb-5">
          <p className="text-sm text-muted-foreground">
            {isBangla
              ? "বৃত্তি পরীক্ষার ফলাফল"
              : "Scholarship Examination Result"}
          </p>

          <h3 className="mt-2 text-xl font-bold sm:text-2xl">
            {isBangla ? "ফলাফল বিবরণী" : "Result Summary"}
          </h3>

          <p className="mt-2 break-all font-mono text-sm text-muted-foreground">
            Student ID: {student.id}
          </p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border p-4">
            <p className="text-sm text-muted-foreground">
              {isBangla ? "শিক্ষার্থীর নাম" : "Student Name"}
            </p>
            <p className="mt-2 font-semibold">{student.name}</p>
          </div>

          <div className="rounded-xl border p-4">
            <p className="text-sm text-muted-foreground">
              {isBangla ? "শ্রেণি ও রোল" : "Class & Roll"}
            </p>
            <p className="mt-2 font-semibold">
              {student.classId} / {student.roll}
            </p>
          </div>

          <div className="rounded-xl border p-4 sm:col-span-2">
            <p className="text-sm text-muted-foreground">
              {isBangla ? "বৃত্তির ফলাফল" : "Scholarship Status"}
            </p>

            <p className="mt-2 text-lg font-bold">{statusLabel}</p>
          </div>

          {result.status === "awarded" && (
            <>
              <div className="rounded-xl border p-4">
                <p className="text-sm text-muted-foreground">
                  {isBangla ? "বৃত্তির পরিমাণ" : "Scholarship Amount"}
                </p>
                <p className="mt-2 text-2xl font-bold text-primary">
                  ৳{result.amount?.toLocaleString("en-BD")}
                </p>
              </div>

              <div className="rounded-xl border p-4">
                <p className="text-sm text-muted-foreground">
                  {isBangla ? "বৃত্তির ক্যাটাগরি" : "Scholarship Category"}
                </p>
                <p className="mt-2 font-semibold">{result.category}</p>
              </div>
            </>
          )}

          {result.status === "not-awarded" && (
            <p className="text-sm leading-6 text-muted-foreground sm:col-span-2">
              {isBangla
                ? "এই পরীক্ষায় শিক্ষার্থী বৃত্তির জন্য নির্বাচিত হয়নি।"
                : "The student was not selected for a scholarship in this examination."}
            </p>
          )}

          {result.status === "pending" && (
            <p className="text-sm leading-6 text-muted-foreground sm:col-span-2">
              {isBangla
                ? "এই শিক্ষার্থীর ফলাফল এখনো প্রকাশিত হয়নি। পরে আবার পরীক্ষা করুন।"
                : "This student's result has not been published yet. Please check again later."}
            </p>
          )}
        </div>

        <p className="mt-5 text-xs leading-5 text-muted-foreground">
          {isBangla
            ? "এটি UI demo result। প্রকৃত ফলাফল database থেকে আসবে।"
            : "This is a UI demo result. Actual results will come from the database."}
        </p>
      </div>
    );
  }

  return (
    <section className="bg-background px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-8">
          <div className="mb-6 flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Search className="size-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">
                {isBangla ? "Student ID দিয়ে ফলাফল" : "Search by Student ID"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {isBangla
                  ? "আপনার নিবন্ধনের সময় পাওয়া Student ID লিখুন।"
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
              value={studentId}
              onChange={(event) => {
                setStudentId(event.target.value);
                setSearchedStudent(null);
                setSearchMessage("");
              }}
              placeholder={
                isBangla ? "যেমন: iq26123456815" : "e.g. iq26123456815"
              }
              aria-label={isBangla ? "Student ID" : "Student ID"}
              className="h-11 min-w-0 flex-1 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              <Search className="size-4" />
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

          {searchMessage && (
            <p
              role="status"
              className="mt-4 rounded-lg border p-4 text-sm leading-6"
            >
              {searchMessage}
            </p>
          )}

          {searchedStudent && renderStudentResult(searchedStudent)}
        </div>

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
                  ? "প্রতিষ্ঠান ও শ্রেণি নির্বাচন করে শিক্ষার্থীদের তালিকা দেখুন।"
                  : "Select your institution and class to browse the student list."}
              </p>
            </div>
          </div>

          <form
            onSubmit={handleStudentListSearch}
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
                value={selectedEiin}
                onChange={(event) => {
                  setSelectedEiin(event.target.value);
                  setShowStudentList(false);
                  setSelectedStudent(null);
                }}
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">
                  {isBangla ? "প্রতিষ্ঠান নির্বাচন করুন" : "Select institution"}
                </option>
                {institutions.map((institution) => (
                  <option key={institution.eiin} value={institution.eiin}>
                    {institution.name} ({institution.eiin})
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
                onChange={(event) => {
                  setSelectedClass(event.target.value);
                  setShowStudentList(false);
                  setSelectedStudent(null);
                }}
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">
                  {isBangla ? "শ্রেণি নির্বাচন করুন" : "Select class"}
                </option>
                {Array.from({ length: 10 }, (_, index) =>
                  String(index + 1),
                ).map((value) => (
                  <option key={value} value={value}>
                    {isBangla ? `শ্রেণি ${value}` : `Class ${value}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90 sm:w-auto"
              >
                <Search className="size-4" />
                {isBangla ? "শিক্ষার্থীদের তালিকা দেখুন" : "Show Students"}
              </button>
            </div>
          </form>

          {showStudentList && (
            <div className="mt-7">
              <h3 className="mb-3 text-lg font-bold">
                {isBangla ? "শিক্ষার্থীদের তালিকা" : "Student List"}
              </h3>

              <div className="overflow-x-auto rounded-xl border">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead className="bg-muted/60">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Student ID</th>
                      <th className="px-4 py-3 font-semibold">
                        {isBangla ? "নাম" : "Name"}
                      </th>
                      <th className="px-4 py-3 font-semibold">
                        {isBangla ? "রোল" : "Roll"}
                      </th>
                      <th className="px-4 py-3 text-right font-semibold">
                        {isBangla ? "অ্যাকশন" : "Action"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredStudents.map((student) => (
                      <tr key={student.id}>
                        <td className="px-4 py-3 font-medium">{student.id}</td>
                        <td className="px-4 py-3">{student.name}</td>
                        <td className="px-4 py-3">{student.roll}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedStudent(student)}
                            className="inline-flex items-center gap-1 rounded-md border px-3 py-2 font-medium hover:bg-muted"
                          >
                            <Eye className="size-4" />
                            {isBangla ? "View" : "View"}
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredStudents.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-8 text-center text-muted-foreground"
                        >
                          {isBangla
                            ? "এই demo তালিকায় কোনো শিক্ষার্থী নেই। বাস্তব তালিকার জন্য database সংযোগ প্রয়োজন।"
                            : "No students in this demo list. Connect the database to load real students."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {selectedStudent && renderStudentResult(selectedStudent)}
              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                {isBangla
                  ? "এখানে দেখানো নাম ও তথ্যগুলো শুধু demo-এর জন্য।"
                  : "Names and records shown here are demo data only."}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
