"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { label: t("home"), href: "/" },
    { label: t("about"), href: "/about" },
    { label: t("notice"), href: "/notices" },
    { label: t("contact"), href: "/contact" },
    { label: t("register"), href: "/register" },
    { label: t("downloadAdmit"), href: "/download-admit" },
    { label: t("result"), href: "/result" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          {siteConfig.brandName}
        </Link>

        <div className="flex flex-wrap items-center gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}

          <button
            type="button"
            onClick={() => setLanguage(language === "bn" ? "en" : "bn")}
            className="rounded-md border border-border px-3 py-2 text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label={
              language === "bn"
                ? "Switch to English"
                : "বাংলা ভাষায় পরিবর্তন করুন"
            }
          >
            {language === "bn" ? "বাং / EN" : "EN / বাং"}
          </button>
        </div>
      </nav>
    </header>
  );
}
