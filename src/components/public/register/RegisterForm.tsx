"use client";

import { useEffect, useState, type FormEvent } from "react";
import { GraduationCap } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import AdmitCard, { type AdmitCardData } from "./AdmitCard";

type Institution = {
  id: number;
  name: string;
  eiin: string;
};

type Scholarship = {
  id: number;
  isActive: boolean;
};

function convertBengaliDigitsToEnglish(input: string): string {
  const banglaDigits: Record<string, string> = {
    "০": "0",
    "১": "1",
    "২": "2",
    "৩": "3",
    "৪": "4",
    "৫": "5",
    "৬": "6",
    "৭": "7",
    "৮": "8",
    "৯": "9",
  };
  return input.replace(/[০-৯]/g, (digit) => banglaDigits[digit] || digit);
}

export default function RegisterForm() {
  const { language } = useLanguage();
  const isBangla = language === "bn";

  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [hasActiveScholarship, setHasActiveScholarship] = useState(false);
  const [checkingScholarship, setCheckingScholarship] = useState(true);
  const [scholarshipCheckFailed, setScholarshipCheckFailed] = useState(false);

  const [institutionName, setInstitutionName] = useState("");
  const [selectedInstitution, setSelectedInstitution] =
    useState<Institution | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [studentName, setStudentName] = useState("");
  const [classId, setClassId] = useState("");
  const [roll, setRoll] = useState("");

  // After successful registration, store admit card data to show AdmitCard
  const [admitCardData, setAdmitCardData] = useState<AdmitCardData | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchInstitutions() {
      try {
        const response = await fetch("/api/institutions");

        if (!response.ok) {
          throw new Error("Failed to fetch institutions.");
        }

        const data: Institution[] = await response.json();
        setInstitutions(data);
      } catch (error) {
        console.error("Failed to load institutions:", error);
        setErrorMessage(
          isBangla
            ? "প্রতিষ্ঠানের তালিকা লোড করা যায়নি। পেজ রিফ্রেশ করুন।"
            : "Could not load institutions. Please refresh the page.",
        );
      }
    }

    async function checkActiveScholarship() {
      try {
        setCheckingScholarship(true);
        setScholarshipCheckFailed(false);

        const response = await fetch("/api/scholarships");

        if (!response.ok) {
          throw new Error("Failed to fetch scholarships.");
        }

        const data: Scholarship[] = await response.json();

        setHasActiveScholarship(
          data.some((scholarship) => scholarship.isActive),
        );
      } catch (error) {
        console.error("Failed to check active scholarship:", error);
        setScholarshipCheckFailed(true);
        setHasActiveScholarship(false);
      } finally {
        setCheckingScholarship(false);
      }
    }

    fetchInstitutions();
    checkActiveScholarship();
  }, [isBangla]);

  const filteredInstitutions = institutions.filter((institution) =>
    institution.name
      .toLowerCase()
      .includes(institutionName.trim().toLowerCase()),
  );

  function handleInstitutionInput(value: string) {
    setInstitutionName(value);
    setSelectedInstitution(null);
    setAdmitCardData(null);
    setErrorMessage("");
    setShowSuggestions(true);
  }

  function handleSelectInstitution(institution: Institution) {
    setSelectedInstitution(institution);
    setInstitutionName(institution.name);
    setShowSuggestions(false);
    setAdmitCardData(null);
    setErrorMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setAdmitCardData(null);

    if (!selectedInstitution) {
      setErrorMessage(
        isBangla
          ? "তালিকা থেকে একটি প্রতিষ্ঠান নির্বাচন করুন।"
          : "Please select an institution from the suggestions.",
      );
      return;
    }

    const numericRoll = Number(convertBengaliDigitsToEnglish(roll.trim()));

    if (!numericRoll || Number.isNaN(numericRoll) || numericRoll < 1) {
      setErrorMessage(
        isBangla
          ? "অনুগ্রহ করে একটি সঠিক রোল নম্বর লিখুন।"
          : "Please enter a valid roll number.",
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: studentName.trim(),
          institutionId: selectedInstitution.id,
          class: Number(classId),
          roll: numericRoll,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (isBangla ? "নিবন্ধন সম্পন্ন করা যায়নি।" : "Registration failed."),
        );
      }

      // Build admit card data from the API response
      setAdmitCardData({
        studentName: data.student?.name || studentName.trim(),
        studentId: data.studentId,
        studentRoll: data.student?.roll || numericRoll,
        studentClass: data.student?.class || Number(classId),
        institutionName: data.institutionName || selectedInstitution.name,
        institutionEiin: data.institutionEiin || selectedInstitution.eiin,
        scholarshipName: data.scholarshipName,
        academicYear: data.academicYear,
        examCenter: data.examCenter ?? undefined,
        examDate: data.examDate ?? undefined,
        examTime: data.examTime ?? undefined,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : isBangla
            ? "একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।"
            : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setAdmitCardData(null);
    setInstitutionName("");
    setSelectedInstitution(null);
    setStudentName("");
    setClassId("");
    setRoll("");
    setErrorMessage("");
  }

  if (checkingScholarship) {
    return (
      <section className="bg-background px-4 py-16 text-center">
        <p className="text-muted-foreground">
          {isBangla
            ? "বৃত্তির তথ্য যাচাই করা হচ্ছে..."
            : "Checking scholarship availability..."}
        </p>
      </section>
    );
  }

  if (!hasActiveScholarship || scholarshipCheckFailed) {
    return (
      <section className="bg-background px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border bg-card p-8 text-center shadow-sm">
          <GraduationCap className="mx-auto mb-4 size-10 text-muted-foreground" />

          <h2 className="text-xl font-bold sm:text-2xl">
            {scholarshipCheckFailed
              ? isBangla
                ? "বৃত্তির তথ্য লোড করা যায়নি"
                : "Unable to Check Scholarship"
              : isBangla
                ? "কোনো সক্রিয় বৃত্তি নেই"
                : "No Active Scholarship Available"}
          </h2>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {scholarshipCheckFailed
              ? isBangla
                ? "অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।"
                : "Please try again later."
              : isBangla
                ? "বর্তমানে কোনো বৃত্তির আবেদন কার্যক্রম চালু নেই। অনুগ্রহ করে পরবর্তীতে আবার চেষ্টা করুন।"
                : "There is currently no open scholarship application. Please check again later."}
          </p>
        </div>
      </section>
    );
  }

  // ✅ After successful registration — show the Admit Card
  if (admitCardData) {
    return (
      <section className="bg-background px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <AdmitCard data={admitCardData} onReset={handleReset} />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-8">
          <div className="mb-7 flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <GraduationCap className="size-6" />
            </div>

            <div>
              <h2 className="text-xl font-bold sm:text-2xl">
                {isBangla
                  ? "শিক্ষার্থী নিবন্ধন ফর্ম"
                  : "Student Registration Form"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {isBangla
                  ? "সঠিক তথ্য দিয়ে ফর্মটি পূরণ করুন।"
                  : "Fill in the form with accurate information."}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="reg-institution" className="text-sm font-medium">
                {isBangla ? "প্রতিষ্ঠানের নাম" : "Institution Name"}
              </label>

              <div className="relative">
                <input
                  id="reg-institution"
                  required
                  autoComplete="off"
                  value={institutionName}
                  onChange={(event) =>
                    handleInstitutionInput(event.target.value)
                  }
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => {
                    setTimeout(() => setShowSuggestions(false), 150);
                  }}
                  placeholder={
                    isBangla
                      ? "প্রতিষ্ঠানের নাম লিখে খুঁজুন"
                      : "Type to search institutions"
                  }
                  className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />

                {showSuggestions && institutionName.trim() && (
                  <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border bg-card py-1 shadow-lg">
                    {filteredInstitutions.length > 0 ? (
                      filteredInstitutions.map((institution) => (
                        <li key={institution.id}>
                          <button
                            type="button"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => handleSelectInstitution(institution)}
                            className="w-full px-3 py-3 text-left text-sm transition-colors hover:bg-muted"
                          >
                            <span className="block font-medium">
                              {institution.name}
                            </span>
                            <span className="mt-1 block text-xs text-muted-foreground">
                              EIIN: {institution.eiin}
                            </span>
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="px-3 py-3 text-sm text-muted-foreground">
                        {isBangla
                          ? "কোনো প্রতিষ্ঠান পাওয়া যায়নি।"
                          : "No institutions found."}
                      </li>
                    )}
                  </ul>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                {isBangla
                  ? "তালিকা থেকে প্রতিষ্ঠানের নাম নির্বাচন করুন।"
                  : "Select an institution from the suggestions."}
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="reg-eiin" className="text-sm font-medium">
                {isBangla ? "প্রতিষ্ঠানের EIIN" : "Institution EIIN"}
              </label>

              <input
                id="reg-eiin"
                readOnly
                value={selectedInstitution?.eiin ?? ""}
                placeholder={isBangla ? "স্বয়ংক্রিয়ভাবে দেখাবে" : "Auto-filled"}
                className="h-11 w-full rounded-lg border border-input bg-muted px-3 text-sm outline-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="reg-student-name" className="text-sm font-medium">
                {isBangla ? "শিক্ষার্থীর পূর্ণ নাম" : "Student Full Name"}
              </label>

              <input
                id="reg-student-name"
                required
                maxLength={150}
                autoComplete="name"
                value={studentName}
                onChange={(event) => {
                  setStudentName(event.target.value);
                  setAdmitCardData(null);
                  setErrorMessage("");
                }}
                placeholder={
                  isBangla ? "শিক্ষার্থীর নাম লিখুন" : "Enter student name"
                }
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="reg-class" className="text-sm font-medium">
                  {isBangla ? "শ্রেণি" : "Class"}
                </label>

                <select
                  id="reg-class"
                  required
                  value={classId}
                  onChange={(event) => {
                    setClassId(event.target.value);
                    setAdmitCardData(null);
                    setErrorMessage("");
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

              <div className="space-y-2">
                <label htmlFor="reg-roll" className="text-sm font-medium">
                  {isBangla ? "রোল নম্বর" : "Roll Number"}
                </label>

                <input
                  id="reg-roll"
                  required
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  value={roll}
                  onChange={(event) => {
                    setRoll(
                      event.target.value.replace(/[^0-9০-৯]/g, "").slice(0, 10),
                    );
                    setAdmitCardData(null);
                    setErrorMessage("");
                  }}
                  placeholder={
                    isBangla ? "যেমন: ১২ বা 12" : "e.g. 12"
                  }
                  className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>

            {errorMessage && (
              <p
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
              >
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? isBangla
                  ? "নিবন্ধন হচ্ছে..."
                  : "Registering..."
                : isBangla
                  ? "নিবন্ধন করুন"
                  : "Register"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
