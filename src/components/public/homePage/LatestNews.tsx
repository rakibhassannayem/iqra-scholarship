"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function LatestNews() {
  const { t, language } = useLanguage();

  const news = [
    {
      id: 1,
      category: {
        bn: "বৃত্তি কার্যক্রম",
        en: "Scholarship Program",
      },
      title: {
        bn: "বৃত্তি কার্যক্রম ও আবেদন প্রক্রিয়া সম্পর্কে জানুন",
        en: "Learn about the scholarship program and application process",
      },
      description: {
        bn: "শিক্ষার্থীদের জন্য বৃত্তির নিয়ম, যোগ্যতা ও প্রয়োজনীয় তথ্য এক জায়গায় দেখুন।",
        en: "Explore scholarship rules, eligibility, and essential information for students.",
      },
      href: "/about",
      date: {
        bn: "সাধারণ তথ্য",
        en: "General Information",
      },
    },
    {
      id: 2,
      category: {
        bn: "নিবন্ধন",
        en: "Registration",
      },
      title: {
        bn: "নিবন্ধনের আগে প্রয়োজনীয় তথ্য প্রস্তুত রাখুন",
        en: "Prepare the required information before registration",
      },
      description: {
        bn: "আবেদন প্রক্রিয়া সহজ করতে শিক্ষার্থীর সঠিক তথ্য ও প্রয়োজনীয় বিবরণ প্রস্তুত রাখুন।",
        en: "Keep accurate student details and required information ready for a smoother application.",
      },
      href: "/register",
      date: {
        bn: "শিক্ষার্থী নির্দেশনা",
        en: "Student Guidance",
      },
    },
    {
      id: 3,
      category: {
        bn: "ফলাফল",
        en: "Results",
      },
      title: {
        bn: "বৃত্তির ফলাফল যাচাই করার নিয়ম",
        en: "How to check scholarship results",
      },
      description: {
        bn: "ফলাফল প্রকাশিত হলে নির্ধারিত পদ্ধতিতে নিজের ফলাফল যাচাই করুন।",
        en: "Once results are published, follow the designated process to check your result.",
      },
      href: "/result",
      date: {
        bn: "ফলাফল নির্দেশনা",
        en: "Result Guidance",
      },
    },
  ];

  return (
    <section className="bg-secondary/40 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-sm font-semibold tracking-wide text-primary">
              {language === "bn" ? "খবর ও তথ্য" : "NEWS & INFORMATION"}
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t("latestNews")}
            </h2>
          </div>

          <Link
            href="/notices"
            className="text-sm font-semibold text-primary transition-colors hover:underline"
          >
            {t("viewAll")} →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <article
              key={item.id}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex min-h-36 items-center justify-center border-b border-border bg-secondary">
                <span className="text-5xl" aria-hidden="true">
                  {item.id === 1 ? "📚" : item.id === 2 ? "📝" : "🎓"}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {item.category[language]}
                </p>

                <h3 className="mt-3 text-lg font-bold leading-7 text-card-foreground">
                  {item.title[language]}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">
                  {item.description[language]}
                </p>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
                  <span className="text-xs text-muted-foreground">
                    {item.date[language]}
                  </span>

                  <Link
                    href={item.href}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    {t("learnMore")} →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
