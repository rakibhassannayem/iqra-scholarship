"use client";

import { useLanguage } from "@/i18n/LanguageProvider";
import Link from "next/link";

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:py-20 lg:grid-cols-2 lg:py-28">
        {/* Hero Content */}
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground">
            <span className="size-2 rounded-full bg-primary" />
            {t("aboutScholarship")}
          </div>

          <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {t("heroTitle")}
          </h1>

          <p className="max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
            {t("heroDescription")}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/register"
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {t("registerNow")}
            </Link>

            <Link
              href="/result"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {t("checkResult")}
            </Link>
          </div>
        </div>

        {/* Decorative Madrasa-Inspired Panel */}
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -right-4 -top-4 size-28 rounded-full bg-accent/60 blur-2xl" />
          <div className="absolute -bottom-4 -left-4 size-32 rounded-full bg-secondary blur-2xl" />

          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-10">
            <div className="absolute inset-0 opacity-40">
              <div className="absolute inset-4 rounded-2xl border border-primary/20" />
              <div className="absolute inset-8 rounded-2xl border border-accent" />
            </div>

            <div className="relative flex min-h-72 flex-col items-center justify-center text-center sm:min-h-80">
              <div className="mb-6 flex size-24 items-center justify-center rounded-full border border-accent bg-secondary text-4xl text-primary">
                ✦
              </div>

              <p className="text-sm font-medium tracking-widest text-muted-foreground">
                SCHOLARSHIP PROGRAM
              </p>

              <h2 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">
                {t("aboutScholarship")}
              </h2>

              <div className="mt-5 h-1 w-16 rounded-full bg-accent" />

              <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
                {t("heroDescription")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
