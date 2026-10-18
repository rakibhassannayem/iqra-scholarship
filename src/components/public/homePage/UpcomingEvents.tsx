"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function UpcomingEvents() {
  const { t, language } = useLanguage();

  const events = [
    {
      id: 1,
      title: t("examSchedule"),
      description:
        language === "bn"
          ? "বৃত্তি পরীক্ষার সময়সূচি ও নির্দেশনা দেখুন।"
          : "View the scholarship examination schedule and instructions.",
      href: "/notices",
      icon: "📅",
    },
    {
      id: 2,
      title: t("resultPublication"),
      description:
        language === "bn"
          ? "প্রকাশিত বৃত্তির ফলাফল যাচাই করুন।"
          : "Check published scholarship examination results.",
      href: "/result",
      icon: "📋",
    },
  ];

  return (
    <section className="bg-secondary/40 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-sm font-semibold tracking-wide text-primary">
              {language === "bn" ? "গুরুত্বপূর্ণ আপডেট" : "IMPORTANT UPDATES"}
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t("upcomingEvents")}
            </h2>
          </div>

          <Link
            href="/notices"
            className="text-sm font-semibold text-primary transition-colors hover:underline"
          >
            {t("viewAll")} →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {events.map((event) => (
            <Link
              key={event.id}
              href={event.href}
              className="group flex gap-5 rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md sm:p-8"
            >
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-accent bg-secondary text-2xl">
                <span aria-hidden="true">{event.icon}</span>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-bold text-card-foreground transition-colors group-hover:text-primary">
                  {event.title}
                </h3>

                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {event.description}
                </p>

                <span className="mt-4 inline-block text-sm font-semibold text-primary">
                  {t("learnMore")} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
