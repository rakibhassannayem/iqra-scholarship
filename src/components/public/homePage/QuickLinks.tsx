"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function QuickLinks() {
  const { t, language } = useLanguage();

  const links = [
    {
      id: 1,
      title: t("scholarshipInfo"),
      description:
        language === "bn"
          ? "বৃত্তির যোগ্যতা, নিয়ম ও আবেদন প্রক্রিয়া জানুন।"
          : "Learn about scholarship eligibility, rules, and application process.",
      href: "/about",
      icon: "📚",
    },
    {
      id: 2,
      title: t("register"),
      description:
        language === "bn"
          ? "বৃত্তির জন্য শিক্ষার্থীর নিবন্ধন সম্পন্ন করুন।"
          : "Complete student registration for the scholarship.",
      href: "/register",
      icon: "📝",
    },
    {
      id: 3,
      title: t("result"),
      description:
        language === "bn"
          ? "নিবন্ধন-সংক্রান্ত তথ্য দিয়ে ফলাফল যাচাই করুন।"
          : "Check scholarship results using your registration details.",
      href: "/result",
      icon: "🎓",
    },
    {
      id: 4,
      title: t("certificate"),
      description:
        language === "bn"
          ? "বৃত্তির সনদ যাচাইয়ের সুবিধা শিগগিরই আসছে।"
          : "Scholarship certificate verification will be available soon.",
      href: "/result",
      icon: "📜",
    },
  ];

  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold tracking-wide text-primary">
            {language === "bn" ? "আপনার প্রয়োজনীয় সেবা" : "SERVICES FOR YOU"}
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("quickLinks")}
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
            >
              <div className="mb-5 flex size-14 items-center justify-center rounded-xl border border-accent bg-secondary text-2xl">
                <span aria-hidden="true">{link.icon}</span>
              </div>

              <h3 className="text-lg font-bold text-card-foreground transition-colors group-hover:text-primary">
                {link.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {link.description}
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                {t("learnMore")}
                <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
