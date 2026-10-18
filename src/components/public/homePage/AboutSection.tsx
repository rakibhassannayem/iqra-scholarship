"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function AboutSection() {
  const { t, language } = useLanguage();

  const points =
    language === "bn"
      ? [
          "শিক্ষার্থীদের মেধা ও যোগ্যতার বিকাশে সহায়তা",
          "বৃত্তি নিবন্ধন ও ফলাফল দেখার সহজ ব্যবস্থা",
          "গুরুত্বপূর্ণ তথ্য ও বিজ্ঞপ্তি এক জায়গায়",
        ]
      : [
          "Supporting students in developing their talent and potential",
          "Easy access to scholarship registration and results",
          "Important information and notices in one place",
        ];

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <div className="absolute -left-3 -top-3 size-24 rounded-full bg-accent/50 blur-2xl" />

          <div className="relative overflow-hidden rounded-3xl border border-border bg-secondary p-8 sm:p-12">
            <div className="flex min-h-64 flex-col items-center justify-center text-center sm:min-h-80">
              <div className="flex size-20 items-center justify-center rounded-full border border-accent bg-card text-4xl">
                ✦
              </div>

              <p className="mt-6 text-sm font-semibold tracking-[0.2em] text-primary">
                {language === "bn"
                  ? "শিক্ষা • মেধা • সম্ভাবনা"
                  : "EDUCATION • MERIT • POTENTIAL"}
              </p>

              <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
                {language === "bn"
                  ? "প্রতিটি শিক্ষার্থীর সামনে এগিয়ে যাওয়ার সুযোগ তৈরি করাই আমাদের লক্ষ্য।"
                  : "Our goal is to help create opportunities for every student to move forward."}
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold tracking-wide text-primary">
            {language === "bn" ? "আমাদের লক্ষ্য" : "OUR MISSION"}
          </p>

          <h2 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
            {t("aboutScholarship")}
          </h2>

          <p className="mt-5 text-base leading-8 text-muted-foreground">
            {language === "bn"
              ? "শিক্ষার্থীদের বৃত্তি-সংক্রান্ত তথ্য, নিবন্ধন ও ফলাফল যাচাইয়ের সুবিধা সহজভাবে পৌঁছে দেওয়ার জন্য এই প্ল্যাটফর্ম তৈরি করা হয়েছে।"
              : "This platform aims to make scholarship information, registration, and result checking easier and more accessible for students."}
          </p>

          <ul className="mt-7 space-y-4">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-primary">
                  ✓
                </span>

                <span className="text-sm leading-7 text-foreground">
                  {point}
                </span>
              </li>
            ))}
          </ul>

          <Link
            href="/about"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {t("learnMore")} →
          </Link>
        </div>
      </div>
    </section>
  );
}
