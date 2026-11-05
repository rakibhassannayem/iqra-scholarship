"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

type SubPage = {
  id: number;
  title: string;
  slug: string;
  order: number;
};

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [aboutPages, setAboutPages] = useState<SubPage[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function loadAboutPages() {
      try {
        const res = await fetch("/api/public/about-pages");
        if (res.ok) {
          const data = await res.json();
          setAboutPages(data);
        }
      } catch (err) {
        console.error("Failed to load about sub-pages:", err);
      }
    }

    void loadAboutPages();
  }, []);

  function handleMouseEnter() {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (aboutPages.length > 0) {
      setAboutDropdownOpen(true);
    }
  }

  function handleMouseLeave() {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    // Small delay (200ms) to ensure smooth cursor transition across boundaries
    hoverTimeoutRef.current = setTimeout(() => {
      setAboutDropdownOpen(false);
    }, 200);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setAboutDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const navLinks = [
    { label: t("home"), href: "/" },
    { label: t("register"), href: "/register" },
    { label: t("downloadAdmit"), href: "/download-admit" },
    { label: t("result"), href: "/result" },
    { label: t("payment"), href: "/payment" },
    { label: t("notice"), href: "/notices" },
    { label: t("contact"), href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
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

            {/* About Dropdown */}
            <div
              className="relative inline-block"
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {aboutPages.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setAboutDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-1 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  aria-expanded={aboutDropdownOpen}
                >
                  <span>{t("about")}</span>
                  <ChevronDown
                    className={`size-3.5 transition-transform duration-200 ${
                      aboutDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              ) : (
                <Link
                  href="/about"
                  className="py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("about")}
                </Link>
              )}

              {/* Dropdown Menu Container (pt-2 acts as invisible bridge to avoid hover gaps) */}
              {aboutPages.length > 0 && aboutDropdownOpen && (
                <div
                  className="absolute left-0 top-full z-50 w-56 pt-2"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="rounded-lg border border-border bg-card p-2 shadow-lg ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1">
                    <Link
                      href="/about"
                      onClick={() => setAboutDropdownOpen(false)}
                      className="block rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      {language === "bn" ? "পরিচিতি ওভারভিউ" : "Overview"}
                    </Link>
                    <div className="my-1 border-t border-border" />
                    {aboutPages.map((page) => (
                      <Link
                        key={page.id}
                        href={`/about/${page.slug}`}
                        onClick={() => setAboutDropdownOpen(false)}
                        className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        {page.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/admin"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("admin")}
            </Link>

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
            className="mt-4 flex flex-col space-y-1 border-t pt-4 lg:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile About Accordion */}
            {aboutPages.length > 0 ? (
              <div className="rounded-md">
                <button
                  type="button"
                  onClick={() => setMobileAboutOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <span>{t("about")}</span>
                  <ChevronDown
                    className={`size-4 transition-transform duration-200 ${
                      mobileAboutOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {mobileAboutOpen && (
                  <div className="ml-4 space-y-1 border-l-2 border-primary/20 pl-2">
                    <Link
                      href="/about"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
                    >
                      {language === "bn" ? "পরিচিতি ওভারভিউ" : "Overview"}
                    </Link>
                    {aboutPages.map((page) => (
                      <Link
                        key={page.id}
                        href={`/about/${page.slug}`}
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                      >
                        {page.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/about"
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {t("about")}
              </Link>
            )}

            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {t("admin")}
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
