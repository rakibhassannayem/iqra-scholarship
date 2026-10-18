"use client";

import Link from "next/link";
import { ChevronRight, GraduationCap, Home } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function ResultHero() {
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
            {isBangla ? "ফলাফল" : "Results"}
          </span>
        </nav>

        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">
            <GraduationCap className="size-4 text-accent" />
            {isBangla
              ? "বৃত্তি পরীক্ষার ফলাফল"
              : "Scholarship Examination Results"}
          </div>

          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {isBangla
              ? "আপনার পরীক্ষার ফলাফল যাচাই করুন"
              : "Check Your Examination Result"}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-primary-foreground/80 sm:text-lg">
            {isBangla
              ? "প্রয়োজনীয় তথ্য দিয়ে আপনার বৃত্তি পরীক্ষার ফলাফল খুঁজে দেখুন।"
              : "Enter the required information to look up your scholarship examination result."}
          </p>
        </div>
      </div>
    </section>
  );
}
