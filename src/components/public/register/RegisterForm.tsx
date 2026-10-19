"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, Copy, GraduationCap } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

type Institution = {
  id: number;
  name: string;
  eiin: string;
};

export default function RegisterForm() {
  const { language } = useLanguage();
  const isBangla = language === "bn";

  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [institutionName, setInstitutionName] = useState("");
  const [selectedInstitution, setSelectedInstitution] =
    useState<Institution | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [studentName, setStudentName] = useState("");
  const [classId, setClassId] = useState("");
  const [roll, setRoll] = useState("");

  const [generatedId, setGeneratedId] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
            ? "প্রতিষ্ঠানের তালিকা লোড করা যায়নি। পেজ রিফ্রেশ করুন।"
            : "Could not load institutions. Please refresh the page.",
        );
      }
    }

    fetchInstitutions();
  }, [isBangla]);

  const filteredInstitutions = institutions.filter((institution) =>
    institution.name
      .toLowerCase()
      .includes(institutionName.trim().toLowerCase()),
  );

  function handleInstitutionInput(value: string) {
    setInstitutionName(value);
    setSelectedInstitution(null);
    setGeneratedId("");
    setCopied(false);
    setErrorMessage("");
    setSuccessMessage("");
    setShowSuggestions(true);
  }

  function handleSelectInstitution(institution: Institution) {
    setSelectedInstitution(institution);
    setInstitutionName(institution.name);
    setShowSuggestions(false);
    setGeneratedId("");
    setCopied(false);
    setErrorMessage("");
    setSuccessMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    setGeneratedId("");
    setCopied(false);

    if (!selectedInstitution) {
      setErrorMessage(
        isBangla
          ? "তালিকা থেকে একটি প্রতিষ্ঠান নির্বাচন করুন।"
          : "Please select an institution from the suggestions.",
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
          roll: Number(roll),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (isBangla ? "নিবন্ধন সম্পন্ন করা যায়নি।" : "Registration failed."),
        );
      }

      setGeneratedId(data.studentId);
      setSuccessMessage(
        isBangla
          ? "শিক্ষার্থীর নিবন্ধন সফলভাবে সম্পন্ন হয়েছে।"
          : "Student registered successfully.",
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : isBangla
            ? "একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।"
            : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCopyId() {
    try {
      await navigator.clipboard.writeText(generatedId);
      setCopied(true);
    } catch {
      setErrorMessage(
        isBangla ? "Student ID কপি করা যায়নি।" : "Could not copy Student ID.",
      );
    }
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
                  ? "সঠিক তথ্য দিয়ে ফর্মটি পূরণ করুন।"
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
                          ? "কোনো প্রতিষ্ঠান পাওয়া যায়নি।"
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
                placeholder={isBangla ? "স্বয়ংক্রিয়ভাবে দেখাবে" : "Auto-filled"}
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
                  setGeneratedId("");
                  setErrorMessage("");
                  setSuccessMessage("");
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
                    setGeneratedId("");
                    setErrorMessage("");
                    setSuccessMessage("");
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
                  pattern="[0-9]+"
                  maxLength={10}
                  value={roll}
                  onChange={(event) => {
                    setRoll(event.target.value.replace(/\D/g, "").slice(0, 10));
                    setGeneratedId("");
                    setErrorMessage("");
                    setSuccessMessage("");
                  }}
                  placeholder={
                    isBangla ? "রোল নম্বর লিখুন" : "Enter roll number"
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

          {generatedId && (
            <div
              role="status"
              className="mt-7 rounded-xl border border-accent/50 bg-accent/10 p-5 sm:p-6"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-primary" />

                <h3 className="font-bold">
                  {successMessage ||
                    (isBangla ? "নিবন্ধন সম্পন্ন" : "Registration completed")}
                </h3>
              </div>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {isBangla ? "আপনার Student ID:" : "Your Student ID:"}
              </p>

              <p className="mt-2 break-all rounded-lg border bg-background px-4 py-3 text-center font-mono text-xl font-bold tracking-wide sm:text-2xl">
                {generatedId}
              </p>

              <button
                type="button"
                onClick={handleCopyId}
                className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border bg-background px-4 text-sm font-medium hover:bg-muted"
              >
                <Copy className="size-4" />
                {copied
                  ? isBangla
                    ? "কপি হয়েছে"
                    : "Copied"
                  : isBangla
                    ? "Student ID কপি করুন"
                    : "Copy Student ID"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
