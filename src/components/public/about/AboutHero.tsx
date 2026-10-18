"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function AboutHero() {
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
            {language === "bn" ? "আমাদের সম্পর্কে" : "About Us"}
          </span>
        </nav>

        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold tracking-wide text-primary">
            {language === "bn" ? "আমাদের পরিচিতি" : "WHO WE ARE"}
          </p>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {language === "bn"
              ? "মেধার বিকাশে বৃত্তি, সম্ভাবনার পথে অগ্রগতি"
              : "Supporting Talent, Inspiring Possibilities"}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            {language === "bn"
              ? "আমাদের বৃত্তি কার্যক্রম, এর উদ্দেশ্য এবং শিক্ষার্থীদের জন্য তৈরি করা সুযোগ সম্পর্কে জানুন।"
              : "Learn about our scholarship program, its purpose, and the opportunities created for students."}
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
