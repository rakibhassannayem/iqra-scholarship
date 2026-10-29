"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useEffect, useState } from "react";

type Notice = {
  id: number;
  title: string;
};

export default function NoticeBanner() {
  const { t } = useLanguage();
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    async function fetchNotices() {
      try {
        const response = await fetch("/api/notices?published=true");

        if (!response.ok) return;

        const data: Notice[] = await response.json();
        setNotices(data);
      } catch (error) {
        console.error("Failed to load notices:", error);
      }
    }

    void fetchNotices();
  }, []);

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
                href="/notices"
                className="shrink-0 text-sm font-medium text-secondary-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                <span className="mr-2 text-primary" aria-hidden="true">
                  •
                </span>
                {notice.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
