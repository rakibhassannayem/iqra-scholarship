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
  const institutionDisplay = item.institutionName;
  const examCenterDisplay = item.examCenter || "ঘাটাইল, টাঙ্গাইল";
  const rollDisplay = toBengaliNumber(item.studentId);
  const yearDisplay = toBengaliNumber(item.academicYear || 2026);
  const categoryDisplay = item.categoryName || "ট্যালেন্টপুল";

  return (
    <div
      id={id}
      className="certificate-print-sheet relative mx-auto w-full max-w-[940px] aspect-[297/210] overflow-hidden rounded-xl border border-stone-300 bg-white p-4 sm:p-6 md:p-7 font-sans shadow-lg select-none print:m-0 print:w-[297mm] print:h-[210mm] print:max-w-[297mm] print:max-h-[210mm] print:rounded-none print:border-none print:p-0 print:shadow-none"
      style={{
        color: "#111827",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
        fontFamily:
          "'SolaimanLipi', 'Noto Serif Bengali', 'Hind Siliguri', serif",
      }}
    >
      {/* Multi-color Ornamental Floral Border Frame */}
      <CertificateBorder />

      {/* Certificate Content Interior */}
      <div className="certificate-content-interior relative z-10 flex h-full flex-col justify-between pt-7 pb-6 px-8 sm:pt-9 sm:pb-8 sm:px-12 md:pt-10 md:pb-9 md:px-14">
        {/* Top Header Section */}
        <div className="text-center">
          {/* Bismillahi Ta'ala */}
          <p className="text-xs sm:text-sm print:text-xs font-bold tracking-wider text-[#6b21a8]">
            বিস্‌মিহী তা&apos;য়ালা
          </p>

          {/* Inspirational Motto */}
          <p className="text-[11px] sm:text-xs print:text-[11px] font-bold italic tracking-wide text-[#15803d]">
            “এমন জীবন তুমি করো গঠন, মৃত্যুর পরেও তুমি স্মৃতিতে চির অম্লান”
          </p>

          {/* Prominent Main Institute Heading */}
          <h1
            className="my-0.5 text-2xl sm:text-3xl md:text-[34px] print:text-[29px] font-black tracking-wide text-[#b02a64] leading-tight"
            style={{
              textShadow: "0 1px 2px rgba(176, 42, 100, 0.15)",
            }}
          >
            ইক্‌রা শিক্ষা পরিবার, ঘাটাইল
          </h1>

          {/* Subhead / Scholarship Title */}
          <p className="text-sm sm:text-base print:text-[15px] font-black tracking-wide text-[#065f46]">
            {scholarshipHeading} - {yearDisplay} ইং
          </p>

          {/* Established Year */}
          <p className="text-[10px] sm:text-xs print:text-[10.5px] font-bold text-[#065f46]">
            স্থাপিত: ২০১৩ খ্রি.
          </p>

          {/* Decorative "বৃত্তি সনদ" Cartouche Emblem */}
          <div className="mt-1 mb-1.5 sm:mt-1.5 sm:mb-2 print:my-1 flex justify-center">
            <CertificateCartouche text="বৃত্তি সনদ" />
          </div>
        </div>

        {/* Certificate Body Lines with Classical Dotted Underline Filling */}
        <div className="space-y-1.5 sm:space-y-2 md:space-y-2.5 print:pb-15 print:space-y-1.5 text-xs sm:text-[13px] md:text-[14px] print:text-[20px] font-medium leading-normal print:leading-10 text-[#111827]">
          {/* Line 1: Student Name */}
          <div className="flex items-baseline gap-2">
            <span className="shrink-0">এই মর্মে প্রত্যয়ন করা যাচ্ছে যে, নাম :</span>
            <div className="relative flex-1 border-b-2 border-dotted border-stone-700/80 pb-0.1 text-center font-black text-black">
              <span className="px-2 text-sm sm:text-base print:text-[20px] font-black">
                {item.studentName}
              </span>
            </div>
          </div>

          {/* Line 2: Father & Mother Name */}
          <div className="flex items-baseline gap-3">
            <div className="flex flex-1 items-baseline gap-1.5">
              <span className="shrink-0">পিতা:</span>
              <div className="flex-1 border-b-2 border-dotted border-stone-700/80 pb-0.1 text-center font-bold text-black">
                <span className="px-1 text-xs sm:text-sm print:text-[18px]">
                  {item.fatherName || "—"}
                </span>
              </div>
            </div>

            <div className="flex flex-1 items-baseline gap-1.5">
              <span className="shrink-0">মাতা :</span>
              <div className="flex-1 border-b-2 border-dotted border-stone-700/80 pb-0.1 text-center font-bold text-black">
                <span className="px-1 text-xs sm:text-sm print:text-[18px]">
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
                <span className="px-1 text-xs sm:text-sm print:text-[18px]">
                  {item.className}
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-1.5 w-1/3">
              <span className="shrink-0">রোল নং:</span>
              <div className="flex-1 border-b-2 border-dotted border-stone-700/80 pb-0.5 text-center font-bold font-mono text-black">
                <span className="px-1 text-xs sm:text-sm print:text-[18px] font-bold">
                  {rollDisplay}
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-1.5 flex-1">
              <span className="shrink-0">কেন্দ্র:</span>
              <div className="flex-1 border-b-2 border-dotted border-stone-700/80 pb-0.5 text-center font-bold text-black">
                <span className="px-1 text-xs sm:text-sm print:text-[18px] truncate">
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
              <span className="px-1 text-xs sm:text-sm print:text-[18px] font-bold">
                {institutionDisplay}
              </span>
            </div>
          </div>

          {/* Line 5: Award Category */}
          <div className="flex items-baseline gap-1.5 flex-wrap sm:flex-nowrap">
            <span className="shrink-0">হতে অংশ গ্রহণ করে</span>
            <div className="inline-block min-w-[140px] max-w-[220px] border-b-2 border-dotted border-stone-700/80 pb-0.5 text-center font-black">
              <span className="px-2 text-sm sm:text-base print:text-[18px] font-black">
                {categoryDisplay}
              </span>
            </div>
            <span className="shrink-0">
              লাভ করায়, কৃতিত্বের নিদর্শন স্বরূপ সনদ প্রদান করা হলো।
            </span>
          </div>

          {/* Line 6: Closing Dua / Good Wishes */}
          <p className="pt-1 print:pt-5 font-medium text-stone-800 print:text-[20px]">
            আমি/ আমরা তার জীবনের সর্বাঙ্গীন মঙ্গল ও সফলতা কামনা করছি।
          </p>
        </div>

        {/* Footer / Dual Signature Section */}
        <div className="mt-2 sm:mt-3 print:mt-1 flex items-end justify-between px-4 sm:px-8 print:px-8 pt-2 print:pt-1 text-center">
          {/* Director Signature Box */}
          <div className="space-y-0.5 sm:space-y-1">
            <div className="w-40 sm:w-52 print:w-60 border-t-2 border-dotted border-stone-800 pt-2">
              <p className="text-xs sm:text-sm print:text-[18px] font-black text-[#111827]">
                পরিচালক
              </p>
              <p className="text-[10px] sm:text-xs print:text-[13px] font-bold text-stone-700">
                ইকরা শিক্ষা পরিবার, ঘাটাইল, টাঙ্গাইল
              </p>
            </div>
          </div>

          {/* Controller of Examinations Signature Box */}
          <div className="space-y-0.5 sm:space-y-1">
            <div className="w-40 sm:w-52 print:w-60 border-t-2 border-dotted border-stone-800 pt-2">
              <p className="text-xs sm:text-sm print:text-[18px] font-black text-[#111827]">
                পরীক্ষা নিয়ন্ত্রক
              </p>
              <p className="text-[10px] sm:text-xs print:text-[13px] font-bold text-stone-700">
                ইকরা শিক্ষা পরিবার, ঘাটাইল, টাঙ্গাইল
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function printIsolatedCertificates(
  title: string,
  containerId: string = "certificate-print-container"
) {
  const container = document.getElementById(containerId);
  if (!container) {
    window.print();
    return;
  }

  const cleanTitle = String(title).trim() || "certificate";

  // Set top-level host document title so Chromium / Edge uses it as the default filename in Save as PDF
  const originalHostTitle = window.document.title;
  window.document.title = cleanTitle;

  const restoreHostTitle = () => {
    window.document.title = originalHostTitle;
  };

  // Remove any previously injected print iframe
  const oldIframe = document.getElementById("certificate-print-iframe");
  if (oldIframe) {
    oldIframe.remove();
  }

  const iframe = document.createElement("iframe");
  iframe.id = "certificate-print-iframe";
  iframe.name = cleanTitle;
  iframe.style.position = "fixed";
  iframe.style.top = "0";
  iframe.style.left = "0";
  iframe.style.width = "1px";
  iframe.style.height = "1px";
  iframe.style.border = "none";
  iframe.style.opacity = "0.01";
  iframe.style.pointerEvents = "none";
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow?.document;
  if (!iframeDoc) {
    window.print();
    return;
  }

  // Clone external stylesheets and font styles from main document
  const headElements = Array.from(
    document.querySelectorAll("style, link[rel='stylesheet']")
  )
    .filter((el) => !el.textContent?.includes("visibility: hidden"))
    .map((el) => el.outerHTML)
    .join("\n");

  const contentHtml = container.innerHTML;

  iframeDoc.open();
  iframeDoc.write(`<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="utf-8" />
  <title>${cleanTitle}</title>
  ${headElements}
  <style>
    @page {
      size: A4 landscape;
      margin: 0mm !important;
    }
    *, *::before, *::after {
      box-sizing: border-box !important;
      visibility: visible !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      width: 297mm !important;
      height: 210mm !important;
      background: #ffffff !important;
      overflow: visible !important;
      visibility: visible !important;
      font-family: 'SolaimanLipi', 'Noto Serif Bengali', 'Hind Siliguri', serif, sans-serif;
    }
    body * {
      visibility: visible !important;
    }
    .certificate-sheet-page {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 297mm !important;
      height: 210mm !important;
      max-width: 297mm !important;
      max-height: 210mm !important;
      min-height: 210mm !important;
      margin: 0 !important;
      padding: 4mm 5mm !important;
      box-sizing: border-box !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      page-break-after: always !important;
      break-after: page !important;
      overflow: hidden !important;
      background: #ffffff !important;
      visibility: visible !important;
    }
    .certificate-sheet-page:last-child {
      page-break-after: auto !important;
      break-after: auto !important;
    }
    .certificate-print-sheet {
      position: relative !important;
      display: block !important;
      width: 100% !important;
      height: 100% !important;
      max-width: 288mm !important;
      max-height: 201mm !important;
      aspect-ratio: auto !important;
      border: none !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
      visibility: visible !important;
      background: #ffffff !important;
    }
    .certificate-content-interior {
      position: relative !important;
      z-index: 10 !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      height: 100% !important;
      width: 100% !important;
      padding: 15mm 16mm 14mm 16mm !important;
      box-sizing: border-box !important;
      visibility: visible !important;
    }
    .certificate-print-sheet * {
      visibility: visible !important;
    }
  </style>
</head>
<body>
  <div id="certificate-print-container">
    ${contentHtml}
  </div>
</body>
</html>`);
  iframeDoc.close();

  const executePrint = () => {
    try {
      window.addEventListener("afterprint", restoreHostTitle, { once: true });
      if (iframe.contentWindow) {
        iframe.contentWindow.addEventListener("afterprint", restoreHostTitle, { once: true });
      }

      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch {
      window.print();
    } finally {
      setTimeout(restoreHostTitle, 3500);
    }
  };

  if (iframe.contentWindow?.document?.fonts) {
    iframe.contentWindow.document.fonts.ready
      .then(() => setTimeout(executePrint, 200))
      .catch(() => setTimeout(executePrint, 350));
  } else {
    setTimeout(executePrint, 350);
  }
}

export default function CertificateView({ data, onBack }: CertificateViewProps) {
  const items = Array.isArray(data) ? data : [data];

  function handlePrint() {
    const filename =
      items.length === 1 && items[0]
        ? items[0].studentId || String(items[0].studentDbId)
        : `Certificates-Batch-${items.length}`;

    printIsolatedCertificates(filename);
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
      <div
        id="certificate-print-container"
        className="flex flex-col items-center gap-8 overflow-x-auto p-1"
      >
        {items.map((item, index) => (
          <div
            key={item.studentDbId || index}
            className="certificate-sheet-page w-full flex justify-center"
          >
            <SingleCertificateCanvas
              item={item}
              id={`certificate-sheet-${index}`}
            />
          </div>
        ))}
      </div>

      {/* Native Browser Print (Ctrl+P) Styles */}
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0 !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 297mm !important;
            height: 210mm !important;
            background: #ffffff !important;
          }
          .print\\:hidden,
          aside,
          header,
          nav {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
