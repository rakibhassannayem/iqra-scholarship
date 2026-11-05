"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: t("home"), href: "/" },
    { label: t("register"), href: "/register" },
    { label: t("downloadAdmit"), href: "/download-admit" },
    { label: t("result"), href: "/result" },
    { label: t("payment"), href: "/payment" },
    { label: t("notice"), href: "/notices" },
    { label: t("contact"), href: "/contact" },
    { label: t("about"), href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <nav className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-lg font-bold tracking-tight">
            {siteConfig.brandName}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-4 lg:flex">
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

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 lg:hidden">
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

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-md p-2 hover:bg-accent"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              {menuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div
            id="mobile-navigation"
            className="mt-4 flex flex-col border-t pt-4 lg:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
