"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageProvider";

const notices = [
  {
    id: 1,
    title: {
      bn: "বৃত্তি পরীক্ষার সময়সূচি শিগগিরই প্রকাশিত হবে",
      en: "Scholarship examination schedule will be published soon",
    },
    href: "/notices",
  },
  {
    id: 2,
    title: {
      bn: "শিক্ষার্থীদের নিবন্ধন সংক্রান্ত গুরুত্বপূর্ণ ঘোষণা",
      en: "Important announcement regarding student registration",
    },
    href: "/notices",
  },
  {
    id: 3,
    title: {
      bn: "সর্বশেষ বিজ্ঞপ্তি ও আপডেট দেখুন",
      en: "View the latest notices and updates",
    },
    href: "/notices",
  },
];

export default function NoticeBanner() {
  const { language, t } = useLanguage();

  return (
    <section
      aria-label={t("notices")}
      className="border-b border-border bg-secondary"
    >
      <div className="mx-auto flex max-w-7xl items-stretch px-4">
        <div className="z-10 flex shrink-0 items-center gap-2 bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground sm:px-5">
          <span aria-hidden="true">📢</span>
          <span>{t("notices")}</span>
        </div>

        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="flex w-max animate-notice-marquee items-center gap-10 py-3 pl-5 hover:paused focus-within:paused motion-reduce:animate-none">
            {[...notices, ...notices].map((notice, index) => (
              <Link
                key={`${notice.id}-${index}`}
                href={notice.href}
                className="shrink-0 text-sm font-medium text-secondary-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                <span className="mr-2 text-primary" aria-hidden="true">
                  •
                </span>
                {notice.title[language]}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
