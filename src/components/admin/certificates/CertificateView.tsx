"use client";

import { Printer, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CertificateData } from "@/types/certificate";
import { CertificateBorder, CertificateCartouche } from "./CertificateBorder";
import { toBengaliNumber } from "@/lib/certificate-utils";

type CertificateViewProps = {
  data: CertificateData | CertificateData[];
  onBack?: () => void;
};

function SingleCertificateCanvas({ item, id }: { item: CertificateData; id?: string }) {
  const scholarshipHeading = item.scholarshipName || "নূরা শিক্ষাবৃত্তি";
  const institutionDisplay = item.institutionName
  const examCenterDisplay = item.examCenter || "ঘাটাইল, টাঙ্গাইল";
  const rollDisplay = toBengaliNumber(item.studentId);
  const yearDisplay = toBengaliNumber(item.academicYear || 2026);
  const categoryDisplay = item.categoryName || "ট্যালেন্টপুল";

  return (
    <div
      id={id}
      className="certificate-print-sheet relative mx-auto w-full max-w-[940px] aspect-[297/210] overflow-hidden rounded-xl border border-stone-300 bg-white p-5 sm:p-7 md:p-8 font-sans shadow-lg select-none print:m-0 print:w-[287mm] print:h-[198mm] print:max-w-none print:rounded-none print:border-none print:p-6 print:shadow-none"
      style={{
        color: "#111827",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
        fontFamily:
          "'SolaimanLipi', 'Noto Serif Bengali','Hind Siliguri',  serif",
      }}
    >
      {/* Multi-color Ornamental Floral Border Frame */}
      <CertificateBorder />

      {/* Certificate Content Interior */}
      <div className="relative z-10 flex h-full flex-col justify-between px-6 py-2 sm:px-10 sm:py-3 md:px-5 md:py-4">
        {/* Top Header Section */}
        <div className="text-center">
          {/* Bismillahi Ta'ala */}
          <p className="text-xs sm:text-sm font-bold tracking-wider text-[#6b21a8]">
            বিস্‌মিহী তা&apos;য়ালা
          </p>

          {/* Inspirational Motto */}
          <p className="text-[11px] sm:text-[13px] font-bold italic tracking-wide text-[#15803d]">
            “এমন জীবন তুমি করো গঠন, মৃত্যুর পরেও তুমি স্মৃতিতে চির অম্লান”
          </p>

          {/* Prominent Main Institute Heading */}
          <h1
            className="my-0.5 text-2xl sm:text-3xl md:text-[38px] font-black tracking-wide text-[#b02a64] leading-tight"
            style={{
              textShadow: "0 1px 2px rgba(176, 42, 100, 0.15)",
            }}
          >
            ইক্‌রা শিক্ষা পরিবার, ঘাটাইল
          </h1>

          {/* Subhead / Scholarship Title */}
          <p className="text-sm sm:text-base md:text-lg font-black tracking-wide text-[#065f46]">
            {scholarshipHeading} - {yearDisplay} ইং
          </p>

          {/* Established Year */}
          <p className="text-[11px] sm:text-xs font-bold text-[#065f46]">
            স্থাপিত: ২০১৩ খ্রি.
          </p>

          {/* Decorative "বৃত্তি সনদ" Cartouche Emblem */}
          <div className="mt-1 mb-2 sm:mt-1.5 sm:mb-2.5 flex justify-center">
            <CertificateCartouche text="বৃত্তি সনদ" />
          </div>
        </div>

        {/* Certificate Body Lines with Classical Dotted Underline Filling */}
        <div className="space-y-2 sm:space-y-2.5 text-xs sm:text-[13.5px] md:text-[15px] font-medium leading-relaxed text-[#111827]">
          {/* Line 1: Student Name */}
          <div className="flex items-baseline gap-2">
            <span className="shrink-0">এই মর্মে প্রত্যয়ন করা যাচ্ছে যে, নাম :</span>
            <div className="relative flex-1 border-b-2 border-dotted border-stone-700/80 pb-0.5 text-center font-black text-black">
              <span className="px-2 text-sm sm:text-base md:text-lg font-black">
                {item.studentName}
              </span>
            </div>
          </div>

          {/* Line 2: Father & Mother Name */}
          <div className="flex items-baseline gap-3">
            <div className="flex flex-1 items-baseline gap-1.5">
              <span className="shrink-0">পিতা:</span>
              <div className="flex-1 border-b-2 border-dotted border-stone-700/80 pb-0.5 text-center font-bold text-black">
                <span className="px-1 text-xs sm:text-sm md:text-[15px]">
                  {item.fatherName || "—"}
                </span>
              </div>
            </div>

            <div className="flex flex-1 items-baseline gap-1.5">
              <span className="shrink-0">মাতা :</span>
              <div className="flex-1 border-b-2 border-dotted border-stone-700/80 pb-0.5 text-center font-bold text-black">
                <span className="px-1 text-xs sm:text-sm md:text-[15px]">
                  {item.motherName || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Line 3: Class, Roll No, Exam Center */}
          <div className="flex items-baseline gap-3">
            <div className="flex items-baseline gap-1.5 w-1/4">
              <span className="shrink-0">শ্রেণি:</span>
              <div className="flex-1 border-b-2 border-dotted border-stone-700/80 pb-0.5 text-center font-bold text-black">
                <span className="px-1 text-xs sm:text-sm">
                  {item.className}
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-1.5 w-1/3">
              <span className="shrink-0">রোল নং:</span>
              <div className="flex-1 border-b-2 border-dotted border-stone-700/80 pb-0.5 text-center font-bold font-mono text-black">
                <span className="px-1 text-xs sm:text-sm md:text-[15px] font-bold text-[#1e293b]">
                  {rollDisplay}
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-1.5 flex-1">
              <span className="shrink-0">কেন্দ্র:</span>
              <div className="flex-1 border-b-2 border-dotted border-stone-700/80 pb-0.5 text-center font-bold text-black">
                <span className="px-1 text-xs sm:text-sm text-[#1e293b] truncate">
                  {examCenterDisplay}
                </span>
              </div>
            </div>
          </div>

          {/* Line 4: Scholarship Name & Institution with Address */}
          <div className="flex items-baseline gap-2">
            <span className="shrink-0">
              সে {yearDisplay}ইং সনের {scholarshipHeading} পরীক্ষায়
            </span>
            <div className="flex-1 border-b-2 border-dotted border-stone-700/80 pb-0.5 text-center font-bold text-black truncate">
              <span className="px-1 text-xs sm:text-sm font-bold">
                {institutionDisplay}
              </span>
            </div>
          </div>

          {/* Line 5: Award Category */}
          <div className="flex items-baseline gap-1.5 flex-wrap sm:flex-nowrap">
            <span className="shrink-0">হতে অংশ গ্রহণ করে</span>
            <div className="inline-block min-w-[140px] max-w-[220px] border-b-2 border-dotted border-stone-700/80 pb-0.5 text-center font-black">
              <span className="px-2 text-sm sm:text-base font-black">
                {categoryDisplay}
              </span>
            </div>
            <span className="shrink-0">
              লাভ করায়, কৃতিত্বের নিদর্শন স্বরূপ সনদ প্রদান করা হলো।
            </span>
          </div>

          {/* Line 6: Closing Dua / Good Wishes */}
          <p className="pt-1.5 sm:pt-2 font-medium text-stone-800">
            আমি/ আমরা তার জীবনের সর্বাঙ্গীন মঙ্গল ও সফলতা কামনা করছি।
          </p>
        </div>

        {/* Footer / Dual Signature Section */}
        <div className="mt-4 flex items-end justify-between px-4 sm:px-8 pt-3 text-center">
          {/* Director Signature Box */}
          <div className="space-y-1">
            <div className="w-40 sm:w-55 border-t-2 border-dotted border-stone-800 pt-1">
              <p className="text-xs sm:text-sm font-black text-[#111827]">
                পরিচালক
              </p>
              <p className="text-[10px] sm:text-xs font-bold text-stone-700">
                ইকরা শিক্ষা পরিবার, ঘাটাইল, টাঙ্গাইল
              </p>
            </div>
          </div>

          {/* Controller of Examinations Signature Box */}
          <div className="space-y-1">
            <div className="w-40 sm:w-55 border-t-2 border-dotted border-stone-800 pt-1">
              <p className="text-xs sm:text-sm font-black text-[#111827]">
                পরীক্ষা নিয়ন্ত্রক
              </p>
              <p className="text-[10px] sm:text-xs font-bold text-stone-700">
                ইকরা শিক্ষা পরিবার, ঘাটাইল, টাঙ্গাইল
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CertificateView({ data, onBack }: CertificateViewProps) {
  const items = Array.isArray(data) ? data : [data];

  function handlePrint() {
    window.print();
  }

  return (
    <div className="space-y-6">
      {/* Top Action Toolbar (Hidden in print mode) */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onBack}
              className="gap-1.5 text-xs"
            >
              <ArrowLeft className="size-4" /> ফিরে যান
            </Button>
          )}
          <div>
            <h3 className="font-bold text-foreground">
              {items.length > 1
                ? `${items.length}টি সনদপত্র তৈরি সম্পন্ন হয়েছে`
                : `${items[0]?.studentName || "শিক্ষার্থীর"} বৃত্তি সনদ`}
            </h3>
            <p className="text-xs text-muted-foreground">
              সনদপত্রটি A4 ল্যান্ডস্কেপ ফরম্যাটে প্রিন্ট অথবা PDF হিসেবে সেভ করুন।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={handlePrint}
            className="gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-sm"
          >
            <Printer className="size-4" />
            {items.length > 1
              ? `সকল সনদ (${items.length}টি) প্রিন্ট করুন`
              : "সনদ প্রিন্ট / PDF ডাউনলোড"}
          </Button>
        </div>
      </div>

      {/* Certificate Sheets Canvas Container */}
      <div className="flex flex-col items-center gap-8 overflow-x-auto p-1">
        {items.map((item, index) => (
          <div key={item.studentDbId || index} className="w-full flex justify-center">
            <SingleCertificateCanvas
              item={item}
              id={`certificate-sheet-${index}`}
            />
          </div>
        ))}
      </div>

      {/* Print Specific CSS Styles for Crisp A4 Landscape */}
      <style>{`
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
          }
          body * {
            visibility: hidden;
          }
          .certificate-print-sheet,
          .certificate-print-sheet * {
            visibility: visible;
          }
          .certificate-print-sheet {
            position: relative !important;
            left: 0 !important;
            top: 0 !important;
            width: 287mm !important;
            height: 200mm !important;
            max-width: none !important;
            margin: 0 auto !important;
            page-break-after: always !important;
            break-after: page !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: A4 landscape;
            margin: 5mm;
          }
        }
      `}</style>
    </div>
  );
}
