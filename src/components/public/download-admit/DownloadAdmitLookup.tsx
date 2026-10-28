"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  Search,
  RotateCcw,
  AlertCircle,
  FileText,
  UserCheck,
  Building,
  GraduationCap,
  HelpCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/i18n/LanguageProvider";
import AdmitCard, {
  type AdmitCardData,
  toBengaliNumber,
  toBengaliClass,
} from "@/components/public/register/AdmitCard";

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

export default function DownloadAdmitLookup() {
  const { language } = useLanguage();
  const isBangla = language === "bn";

  const [studentIdInput, setStudentIdInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [admitCard, setAdmitCard] = useState<AdmitCardData | null>(null);

  async function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const cleanId = convertBengaliDigitsToEnglish(studentIdInput.trim());

    if (!cleanId) {
      setErrorMessage(
        isBangla
          ? "অনুগ্রহ করে আপনার Student ID নম্বরটি লিখুন।"
          : "Please enter your Student ID number.",
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `/api/admit-card?studentId=${encodeURIComponent(cleanId)}`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (isBangla
              ? "প্রবেশপত্র পাওয়া যায়নি। অনুগ্রহ করে সঠিক Student ID দিয়ে চেষ্টা করুন।"
              : "Admit card not found. Please try again with a valid Student ID."),
        );
      }

      setAdmitCard(data.admitCard);
    } catch (err) {
      setAdmitCard(null);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : isBangla
            ? "একটি সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।"
            : "An error occurred. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setStudentIdInput("");
    setAdmitCard(null);
    setErrorMessage("");
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      {/* Search Box - Hidden during print */}
      <div className="print:hidden mb-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FileText className="size-6" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {isBangla ? "প্রবেশপত্র অনুসন্ধান করুন" : "Search Admit Card"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {isBangla
                ? "নিবন্ধন সম্পন্ন করার পর প্রাপ্ত Student ID নম্বরটি প্রদান করুন"
                : "Enter the Student ID received after successful registration"}
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label
                htmlFor="student-id-input"
                className="block text-sm font-semibold text-foreground mb-2"
              >
                {isBangla ? "শিক্ষার্থীর আইডি (Student ID)" : "Student ID"}
                <span className="text-destructive ml-1">*</span>
              </label>

              <div className="relative">
                <Input
                  id="student-id-input"
                  type="text"
                  placeholder={
                    isBangla
                      ? "যেমন: 26123456815 বা 2600123"
                      : "e.g. 26123456815 or 2600123"
                  }
                  value={studentIdInput}
                  onChange={(e) => {
                    setStudentIdInput(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  disabled={isLoading}
                  className="h-12 pl-4 pr-10 text-base font-mono font-medium tracking-wide"
                  autoFocus
                />
                {studentIdInput && !isLoading && (
                  <button
                    type="button"
                    onClick={() => {
                      setStudentIdInput("");
                      setErrorMessage("");
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs rounded-full p-1 transition-colors"
                    title={isBangla ? "মুছে ফেলুন" : "Clear"}
                  >
                    ✕
                  </button>
                )}
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {isBangla
                  ? "বাংলা (যেমন: ২৬১২৩৪৫৬৮১৫) অথবা ইংরেজি উভয় সংখ্যাই গ্রহণযোগ্য।"
                  : "Both English and Bengali numerals are accepted."}
              </p>
            </div>

            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-3.5 text-sm text-destructive">
                <AlertCircle className="size-5 shrink-0 mt-0.5" />
                <div className="leading-snug">{errorMessage}</div>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2 sm:flex-row">
              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 flex-1 gap-2 font-semibold text-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {isBangla ? "অনুসন্ধান করা হচ্ছে..." : "Searching..."}
                  </>
                ) : (
                  <>
                    <Search className="size-4" />
                    {isBangla ? "প্রবেশপত্র খুঁজুন" : "Find Admit Card"}
                  </>
                )}
              </Button>

              {(studentIdInput || admitCard || errorMessage) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={isLoading}
                  className="h-11 gap-1.5 sm:w-auto text-sm"
                >
                  <RotateCcw className="size-4" />
                  {isBangla ? "রিসেট" : "Reset"}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* When Admit Card is Found */}
      {admitCard && (
        <div className="space-y-8 animate-in fade-in-50 duration-300">
          {/* Quick Details Banner */}
          <div className="print:hidden rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    <UserCheck className="size-3.5" />
                    {isBangla ? "নিবন্ধিত শিক্ষার্থী" : "Registered Student"}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    ID: {admitCard.studentId}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {admitCard.studentName}
                </h3>
                <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="inline-flex items-center gap-1">
                    <Building className="size-3" />
                    {admitCard.institutionName}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <GraduationCap className="size-3" />
                    {toBengaliClass(admitCard.studentClass)} (রোল:{" "}
                    {toBengaliNumber(admitCard.studentRoll)})
                  </span>
                </p>
              </div>

              <div className="text-xs text-muted-foreground max-w-xs text-right hidden md:block">
                {isBangla
                  ? "নিচের প্রবেশপত্রটি প্রিন্ট করুন অথবা ডাউনলোড করে সংরক্ষণ করুন।"
                  : "Print or download the admit card below."}
              </div>
            </div>
          </div>

          {/* Render the printable Admit Card */}
          <AdmitCard
            data={admitCard}
            onReset={handleReset}
            resetLabel={isBangla ? "অন্য আইডি খুঁজুন" : "Search Another ID"}
          />

          {/* Instructions Card */}
          <div className="print:hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h4 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
              <HelpCircle className="size-4 text-primary" />
              {isBangla
                ? "পরীক্ষার্থীদের জন্য বিশেষ নির্দেশনাবলী"
                : "Important Examination Instructions"}
            </h4>

            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>
                {isBangla
                  ? "পরীক্ষার দিন অবশ্যই এই প্রবেশপত্রের একটি স্পষ্ট প্রিন্ট কপি সঙ্গে আনতে হবে।"
                  : "A clear printed copy of this admit card must be brought to the exam hall."}
              </li>
              <li>
                {isBangla
                  ? "পরীক্ষা শুরুর অন্তত ৩০ মিনিট পূর্বে নিজ নিজ আসনে উপস্থিত হতে হবে।"
                  : "Candidates must be seated at least 30 minutes before the examination starts."}
              </li>
              <li>
                {isBangla
                  ? "পরীক্ষা কেন্দ্রে মোবাইল ফোন, ক্যালকুলেটর বা কোনো ইলেকট্রনিক ডিভাইস নেওয়া সম্পূর্ণ নিষেধ।"
                  : "Mobile phones, calculators, or electronic devices are strictly prohibited."}
              </li>
              <li>
                {isBangla
                  ? "প্রবেশপত্রে কোনো তথ্য ভুল থাকলে তাৎক্ষণিকভাবে মাদ্রাসার প্রধান বা কর্তৃপক্ষের সাথে যোগাযোগ করুন।"
                  : "If there is any error in the admit card, please contact the authority immediately."}
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Helpful Info Cards when no card is displayed */}
      {!admitCard && (
        <div className="print:hidden mx-auto max-w-4xl grid grid-cols-1 gap-6 sm:grid-cols-2 mt-10">
          <div className="rounded-xl border border-border bg-muted/30 p-5">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <HelpCircle className="size-4 text-primary" />
              {isBangla
                ? "Student ID কীভাবে পাবেন?"
                : "How to find Student ID?"}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {isBangla
                ? "অনলাইনে বৃত্তি নিবন্ধনের শেষ ধাপে স্ক্রিনে আপনার Student ID প্রদর্শিত হয়েছিল। অথবা আপনার প্রতিষ্ঠানের শিক্ষক বা নোটিশ বোর্ডে তালিকাভুক্ত আইডি চেক করুন।"
                : "Your Student ID was shown upon successful online registration, or you can find it from your institution's registration list."}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-muted/30 p-5">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <GraduationCap className="size-4 text-primary" />
              {isBangla
                ? "এখনো নিবন্ধন করেননি?"
                : "Haven't registered yet?"}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {isBangla
                ? "বৃত্তি পরীক্ষায় অংশগ্রহণের জন্য প্রথমে আপনার মাদ্রাসার মাধ্যমে বা অনলাইন ফর্মে নিবন্ধন সম্পন্ন করুন।"
                : "Register through your madrasa or complete the online registration form to participate."}
            </p>
            <div className="mt-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
              >
                {isBangla ? "নতুন নিবন্ধন করুন" : "Register Now"}
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
