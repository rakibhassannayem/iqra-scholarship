"use client";

import React, { useRef } from "react";
import { Printer, Copy, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export type AdmitCardData = {
  studentName: string;
  studentId: string;
  studentRoll: number | string;
  studentClass: number | string;
  institutionName: string;
  institutionEiin: string;
  scholarshipName?: string;
  academicYear?: string;
  examCenter?: string;
  examDate?: string;
  examTime?: string;
};

type AdmitCardProps = {
  data: AdmitCardData;
  onReset?: () => void;
  resetLabel?: string;
};

export function toBengaliNumber(num: string | number | undefined | null): string {
  if (num === undefined || num === null) return "";
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num).replace(/[0-9]/g, (digit) => banglaDigits[Number(digit)]);
}

export function toBengaliClass(classNum: number | string): string {
  const classMap: Record<number, string> = {
    1: "প্রথম",
    2: "দ্বিতীয়",
    3: "তৃতীয়",
    4: "চতুর্থ",
    5: "পঞ্চম",
    6: "ষষ্ঠ",
    7: "সপ্তম",
    8: "অষ্টম",
    9: "নবম",
    10: "দশম",
  };
  return classMap[Number(classNum)] || `শ্রেণি ${toBengaliNumber(classNum)}`;
}

export default function AdmitCard({ data, onReset, resetLabel }: AdmitCardProps) {
  const [copied, setCopied] = React.useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const scholarshipTitle =
    data.scholarshipName ||
    (data.academicYear
      ? `নূরানী শিক্ষা বৃত্তি-${toBengaliNumber(data.academicYear)}ইং`
      : "নূরানী শিক্ষা বৃত্তি-২০২৬ইং");

  const examCenter =
    data.examCenter || "ঘাটাইল আলিম মাদ্রাসা, মেইন রোড, ঘাটাইল";
  const examDate =
    data.examDate || "০৬-১০-২০২৬ইং শুক্রবার";
  const examTime =
    data.examTime || "সকাল: ০৯টা হতে ১১টা";

  async function handleCopyId() {
    try {
      await navigator.clipboard.writeText(data.studentId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4 shadow-sm">
        <div>
          <h3 className="font-bold text-foreground">
            প্রবেশপত্র তৈরি সম্পন্ন হয়েছে!
          </h3>
          <p className="text-xs text-muted-foreground">
            নিচের প্রবেশপত্রটি প্রিন্ট করুন অথবা PDF হিসেবে সংরক্ষণ করুন।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyId}
            className="gap-1.5 text-xs"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-green-600" /> আইডি কপি হয়েছে
              </>
            ) : (
              <>
                <Copy className="size-3.5" /> Student ID কপি
              </>
            )}
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handlePrint}
            className="gap-1.5 bg-green-700 hover:bg-green-800 text-white font-semibold text-xs"
          >
            <Printer className="size-4" /> প্রবেশপত্র প্রিন্ট / PDF ডাউনলোড
          </Button>

          {onReset && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="size-3.5" /> {resetLabel || "নতুন নিবন্ধন"}
            </Button>
          )}
        </div>
      </div>

      {/* Admit Card Canvas */}
      <div className="flex justify-center overflow-x-auto p-1">
        <div
          ref={cardRef}
          id="admit-card-printable"
          className="relative w-full max-w-[820px] shrink-0 rounded-2xl border-4 border-[#e83e8c] bg-[#fbfdf7] p-2.5 font-sans shadow-md print:m-0 print:w-full print:max-w-none print:border-4 print:border-[#e83e8c] print:p-2 print:shadow-none"
          style={{
            color: "#1e293b",
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
          }}
        >
          {/* Main Inner Border Container */}
          <div className="rounded-xl border-2 border-[#2b6a4a] bg-[#f6faf2] p-3 sm:p-4">
            {/* Header Section */}
            <div className="text-center">
              <h1
                className="text-2xl font-black tracking-tight sm:text-3xl md:text-[34px] leading-tight"
                style={{
                  color: "#0f2d59",
                  fontFamily: "'Hind Siliguri', 'Kalpurush', 'SolaimanLipi', sans-serif",
                }}
              >
                ইকরা শিক্ষা পরিবার, ঘাটাইল, টাঙ্গাইল
              </h1>

              {/* Subtitle with dual lines and oval capsule */}
              <div className="relative my-2 flex items-center justify-center">
                <div className="absolute inset-x-0 h-[2px] bg-[#93c5fd]" />
                <div className="absolute inset-x-0 -mt-[6px] h-[1px] bg-[#93c5fd]" />
                <span className="relative z-10 inline-block rounded-full border-2 border-[#15803d] bg-white px-5 py-0.5 text-xs font-bold text-[#b91c1c] sm:text-sm shadow-xs">
                  {scholarshipTitle}
                </span>
              </div>

              {/* Admit Card Pill Banner */}
              <div className="my-2.5 flex justify-center">
                <span className="inline-block rounded-full bg-[#102a43] px-8 py-1 text-sm font-bold text-white tracking-widest sm:text-base shadow-xs">
                  প্রবেশপত্র
                </span>
              </div>
            </div>

            {/* Content Two-Column Grid */}
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Left Column Box */}
              <div className="flex flex-col justify-between rounded-xl border-2 border-[#2b6a4a] bg-white p-3 shadow-xs">
                {/* Rows with borders */}
                <div className="divide-y divide-[#3b82f6]/40 border-b border-[#3b82f6]/40 text-xs sm:text-sm">
                  {/* Name */}
                  <div className="flex items-center gap-2 py-2">
                    <span className="w-28 shrink-0 font-bold text-[#b91c1c]">
                      পরীক্ষার্থীর নাম:
                    </span>
                    <span className="font-bold text-[#111827] text-sm sm:text-base break-words">
                      {data.studentName}
                    </span>
                  </div>

                  {/* Class */}
                  <div className="flex items-center gap-2 py-2">
                    <span className="w-28 shrink-0 font-bold text-[#b91c1c]">
                      শ্রেণি:
                    </span>
                    <span className="font-bold text-[#111827]">
                      {toBengaliClass(data.studentClass)}
                    </span>
                  </div>

                  {/* EIIN / Elhak No */}
                  <div className="flex items-center gap-2 py-2">
                    <span className="w-28 shrink-0 font-bold text-[#b91c1c]">
                      এলহাক নং:
                    </span>
                    <span className="font-bold font-mono text-[#111827]">
                      {toBengaliNumber(data.institutionEiin)}
                    </span>
                  </div>

                  {/* Institution Name */}
                  <div className="flex items-start gap-2 py-2">
                    <span className="w-28 shrink-0 font-bold text-[#b91c1c] pt-0.5">
                      প্রতিষ্ঠানের নাম:
                    </span>
                    <span className="font-semibold text-[#111827] leading-snug">
                      {data.institutionName}
                    </span>
                  </div>
                </div>

                {/* Left Signature Box */}
                <div className="mt-6 pt-2">
                  <div className="inline-block rounded-md border border-[#94a3b8] px-4 py-1.5 text-center">
                    <div className="w-28 border-b border-[#334155] pb-0.5" />
                    <p className="mt-1 text-[11px] font-bold text-[#1e293b]">
                      মুহতামিম/ পরিচালক
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column Box */}
              <div className="flex flex-col justify-between rounded-xl border-2 border-[#2b6a4a] bg-white p-3 shadow-xs">
                {/* Rows with borders */}
                <div className="divide-y divide-[#3b82f6]/40 border-b border-[#3b82f6]/40 text-xs sm:text-sm">
                  {/* Exam Center */}
                  <div className="flex items-start gap-2 py-2">
                    <span className="w-28 shrink-0 font-bold text-[#b91c1c] pt-0.5">
                      পরীক্ষার কেন্দ্র:
                    </span>
                    <span className="font-semibold text-[#111827] leading-snug">
                      {examCenter}
                    </span>
                  </div>

                  {/* Exam Date */}
                  <div className="flex items-center gap-2 py-2">
                    <span className="w-28 shrink-0 font-bold text-[#b91c1c]">
                      পরীক্ষার তারিখ:
                    </span>
                    <span className="font-bold text-[#111827]">
                      {examDate}
                    </span>
                  </div>

                  {/* Roll No */}
                  <div className="flex items-center gap-2 py-2">
                    <span className="w-28 shrink-0 font-bold text-[#b91c1c]">
                      রোল নং:
                    </span>
                    <span className="font-bold font-mono text-base text-[#111827]">
                      {toBengaliNumber(data.studentRoll || data.studentId)}
                    </span>
                  </div>

                  {/* Exam Time */}
                  <div className="flex items-center gap-2 py-2">
                    <span className="w-28 shrink-0 font-bold text-[#b91c1c]">
                      পরীক্ষার সময়:
                    </span>
                    <span className="font-bold text-[#111827]">
                      {examTime}
                    </span>
                  </div>
                </div>

                {/* Right Signature Box */}
                <div className="mt-4 flex justify-end pt-2">
                  <div className="inline-block rounded-md border border-[#94a3b8] px-4 py-1.5 text-center">
                    {/* Real Signature Image */}
                    <div className="flex justify-center pb-0.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/signature-exam-controller.png"
                        alt="পরীক্ষা নিয়ন্ত্রকের স্বাক্ষর"
                        className="h-10 w-24 object-contain"
                        style={{ mixBlendMode: "multiply" }}
                      />
                    </div>
                    <div className="w-28 border-b border-[#334155]" />
                    <p className="mt-1 text-[11px] font-bold text-[#1e293b]">
                      পরীক্ষা নিয়ন্ত্রক
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print-specific style tag */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #admit-card-printable,
          #admit-card-printable * {
            visibility: visible;
          }
          #admit-card-printable {
            position: absolute;
            left: 50%;
            top: 20px;
            transform: translateX(-50%);
            width: 100% !important;
            max-width: 780px !important;
            margin: 0 auto !important;
            padding: 8px !important;
            background: #fbfdf7 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        }
      `}</style>
    </div>
  );
}
