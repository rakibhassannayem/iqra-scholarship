"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/i18n/LanguageProvider";
import { toast } from "@/components/ui/toast";

export default function Footer() {
  const { language, t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  function handleResetSplash() {
    try {
      localStorage.removeItem("iqra-splash-disabled");
      localStorage.removeItem("iqra-splash-skip-until");
    } catch {
      // ignore
    }

    if (pathname !== "/") {
      router.push("/");
      // Slight timeout to let homepage mount before dispatching event
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("iqra:show-splash"));
      }, 300);
    } else {
      window.dispatchEvent(new CustomEvent("iqra:show-splash"));
    }

    toast.add({
      title: language === "bn" ? "রিসেট সফল হয়েছে" : "Reset Successful",
      description:
        language === "bn"
          ? "স্প্ল্যাশ স্ক্রিন সক্রিয় করা হয়েছে।"
          : "Splash Screen has been reset and enabled.",
      type: "success",
    });
  }

  const footerDescription =
    language === "bn"
      ? "বৃত্তি নিবন্ধন, ফলাফল ও শিক্ষাবৃত্তি ব্যবস্থাপনা।"
      : "Scholarship registration, results, and scholarship management.";

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">{siteConfig.brandName}</p>

          <p className="mt-1 text-sm text-muted-foreground">
            {footerDescription}
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <Link href="/about" className="hover:text-foreground">
            {t("about")}
          </Link>

          <Link href="/contact" className="hover:text-foreground">
            {t("contact")}
          </Link>

          <Link href="/download-admit" className="hover:text-foreground">
            {t("downloadAdmit")}
          </Link>

          <Link href="/result" className="hover:text-foreground">
            {t("result")}
          </Link>

          {/* Reset Splash Screen Option */}
          <button
            type="button"
            onClick={handleResetSplash}
            className="inline-flex items-center gap-1.5 text-xs text-amber-700/80 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 font-medium transition-colors cursor-pointer"
            title={
              language === "bn"
                ? "স্প্ল্যাশ স্ক্রিন পুনরায় চালু করুন"
                : "Show Splash Screen Again"
            }
          >
            <Sparkles className="size-3.5 text-amber-600" />
            <span>
              {language === "bn"
                ? "স্প্ল্যাশ স্ক্রিন চালু করুন"
                : "Show Splash Screen Again"}
            </span>
          </button>
        </nav>

        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.brandName}
        </p>
      </div>
    </footer>
  );
}
