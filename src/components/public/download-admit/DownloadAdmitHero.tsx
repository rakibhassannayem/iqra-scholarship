"use client";

import Link from "next/link";
import { ChevronRight, FileText, Home } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function DownloadAdmitHero() {
  const { language } = useLanguage();
  const isBangla = language === "bn";

  return (
    <section className="relative isolate overflow-hidden bg-primary px-4 py-16 text-primary-foreground sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10 sm:h-96 sm:w-96"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full border border-white/10 sm:h-96 sm:w-96"
      />

      <div className="relative mx-auto max-w-6xl">
        <nav
          aria-label={isBangla ? "ব্রেডক্রাম্ব" : "Breadcrumb"}
          className="mb-6 flex items-center gap-2 text-sm text-primary-foreground/75"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1 transition-colors hover:text-primary-foreground"
          >
            <Home className="size-4" />
            {isBangla ? "হোম" : "Home"}
          </Link>

          <ChevronRight className="size-4" />

          <span className="text-primary-foreground">
            {isBangla ? "প্রবেশপত্র ডাউনলোড" : "Download Admit"}
          </span>
        </nav>

        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium">
            <FileText className="size-4 text-emerald-300" />
            {isBangla
              ? "প্রবেশপত্র সংগ্রহ ও পুনঃমুদ্রণ"
              : "Admit Card Collection & Reprint"}
          </div>

          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {isBangla
              ? "পরীক্ষার প্রবেশপত্র (Admit Card) ডাউনলোড"
              : "Download Your Examination Admit Card"}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-primary-foreground/80 sm:text-lg">
            {isBangla
              ? "নিবন্ধিত শিক্ষার্থীরা তাদের Student ID নম্বর দিয়ে যেকোনো সময় প্রবেশপত্র অনুসন্ধান, পুনঃউৎপাদন এবং সরাসরি প্রিন্ট বা PDF ডাউনলোড করতে পারবেন।"
              : "Registered students can search using their Student ID at any time to regenerate, print, or download their admit card as PDF."}
          </p>
        </div>
      </div>
    </section>
  );
}
