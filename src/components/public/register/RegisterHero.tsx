"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function RegisterHero() {
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
            {language === "bn" ? "নিবন্ধন" : "Registration"}
          </span>
        </nav>

        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold tracking-wide text-primary">
            {language === "bn" ? "আপনার যাত্রা শুরু করুন" : "GET STARTED"}
          </p>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {language === "bn"
              ? "বৃত্তির জন্য শিক্ষার্থী নিবন্ধন"
              : "Student Scholarship Registration"}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            {language === "bn"
              ? "নিবন্ধন ফর্মে শিক্ষার্থী ও শিক্ষাপ্রতিষ্ঠানের সঠিক তথ্য প্রদান করুন। জমা দেওয়ার আগে সব তথ্য যাচাই করে নিন।"
              : "Provide accurate student and institution details in the registration form. Review all information before submitting."}
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
