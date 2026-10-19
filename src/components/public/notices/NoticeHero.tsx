"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function NoticeHero() {
  const { language } = useLanguage();

  return (
    <section className="relative overflow-hidden border-b border-border bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20 lg:py-24">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Link href="/" className="transition-colors hover:text-primary">
            {language === "bn" ? "হোম" : "Home"}
          </Link>

          <span aria-hidden="true">/</span>

          <span className="font-medium text-foreground">
            {language === "bn" ? "নোটিশ বোর্ড" : "Notice Board"}
          </span>
        </nav>

        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold tracking-wide text-primary">
            {language === "bn" ? "সর্বশেষ ঘোষণা" : "LATEST ANNOUNCEMENTS"}
          </p>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {language === "bn" ? "নোটিশ বোর্ড" : "Notice Board"}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            {language === "bn"
              ? "বৃত্তি কার্যক্রম, নিবন্ধন, পরীক্ষা ও ফলাফল সংক্রান্ত গুরুত্বপূর্ণ বিজ্ঞপ্তি এখানে দেখুন।"
              : "Find important announcements about scholarships, registration, examinations, and results."}
          </p>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-accent/30 blur-3xl"
      />
    </section>
  );
}
