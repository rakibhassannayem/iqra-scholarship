"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { toast } from "@/components/ui/toast";
import {
  IslamicBackgroundPattern,
  IslamicCornerOrnament,
  IslamicDivider,
  IslamicStar,
} from "./IslamicPattern";
import SplashSettings, { type SkipOption } from "./SplashSettings";

const STORAGE_KEYS = {
  SKIP_UNTIL: "iqra-splash-skip-until",
  DISABLED: "iqra-splash-disabled",
};

export default function SplashScreen() {
  const { language } = useLanguage();
  const isBangla = language === "bn";

  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const checkShouldShow = useCallback((): boolean => {
    try {
      // 1. Check permanent disable
      const isDisabled = localStorage.getItem(STORAGE_KEYS.DISABLED);
      if (isDisabled === "true") {
        return false;
      }

      // 2. Check temporary skip expiry
      const skipUntilRaw = localStorage.getItem(STORAGE_KEYS.SKIP_UNTIL);
      if (skipUntilRaw) {
        const skipUntil = Number(skipUntilRaw);
        if (!Number.isNaN(skipUntil) && Date.now() < skipUntil) {
          // Skip still valid
          return false;
        }
        // Skip expired, clean up
        localStorage.removeItem(STORAGE_KEYS.SKIP_UNTIL);
      }

      return true;
    } catch {
      // In case localStorage is blocked or restricted
      return true;
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);

    if (checkShouldShow()) {
      setIsVisible(true);
    }

    // Listen for custom "Show Splash Screen Again" event from Footer
    function handleForceShow() {
      try {
        localStorage.removeItem(STORAGE_KEYS.DISABLED);
        localStorage.removeItem(STORAGE_KEYS.SKIP_UNTIL);
      } catch {
        // ignore
      }
      setIsClosing(false);
      setIsVisible(true);
    }

    window.addEventListener("iqra:show-splash", handleForceShow);
    return () => {
      window.removeEventListener("iqra:show-splash", handleForceShow);
    };
  }, [checkShouldShow]);

  // Handle keyboard Escape to dismiss
  useEffect(() => {
    if (!isVisible) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleDismiss();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible]);

  function handleDismiss() {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 450);
  }

  function handleSkipOption(option: SkipOption) {
    try {
      if (option.durationMs === null) {
        // Permanent disable
        localStorage.setItem(STORAGE_KEYS.DISABLED, "true");
        localStorage.removeItem(STORAGE_KEYS.SKIP_UNTIL);

        toast.add({
          title: isBangla ? "পছন্দ সংরক্ষিত হয়েছে" : "Preference Saved",
          description: isBangla
            ? "স্প্ল্যাশ স্ক্রিনটি স্থায়ীভাবে বন্ধ করা হয়েছে। ফুটার থেকে আবার চালু করতে পারবেন।"
            : "Splash Screen disabled. You can re-enable it anytime from the footer.",
          type: "success",
        });
      } else {
        // Temporary skip duration
        const expiry = Date.now() + option.durationMs;
        localStorage.setItem(STORAGE_KEYS.SKIP_UNTIL, String(expiry));
        localStorage.removeItem(STORAGE_KEYS.DISABLED);

        toast.add({
          title: isBangla ? "পছন্দ সংরক্ষিত হয়েছে" : "Preference Saved",
          description: isBangla
            ? `পরবর্তী ${option.labelBn} পর্যন্ত স্প্ল্যাশ স্ক্রিনটি আর দেখানো হবে না।`
            : `Splash Screen will be skipped for the next ${option.label}.`,
          type: "success",
        });
      }
    } catch {
      // ignore
    }

    handleDismiss();
  }

  // Prevent SSR flash / hydration mismatch
  if (!isMounted || !isVisible) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Islamic Welcome Screen"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-y-auto p-2 sm:p-4 transition-all duration-500 bg-[#E8DEC8] ${isClosing
        ? "opacity-0 scale-98 pointer-events-none"
        : "opacity-100 scale-100"
        }`}
      style={{
        background:
          "radial-gradient(ellipse at 50% 35%, #EDE2CE 0%, #E3D3BD 38%, #D4BEA2 70%, #BEA482 100%)",
      }}
    >
      {/* Subtle Dark Vignette Shadow at Edges for Depth */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(40,26,10,0.25)_100%)] select-none"
        aria-hidden="true"
      />

      {/* Atmospheric Islamic Geometric Watermark Pattern & Moving Floating Particles */}
      <IslamicBackgroundPattern />

      {/* Main Islamic Card with Rich Parchment Warmth and Golden Borders (Compact & Responsive for Zoomed Screens) */}
      <div className="relative z-10 w-full max-w-[540px] max-h-[96dvh] overflow-y-auto rounded-2xl sm:rounded-3xl border-2 border-amber-700/35 bg-[#FAF5EC]/95 px-4 py-3 sm:px-6 sm:py-4.5 my-auto shadow-[0_20px_50px_-15px_rgba(40,25,10,0.38)] backdrop-blur-md animate-splash-zoom-in ring-2 ring-amber-600/20">
        {/* Decorative corner ornaments */}
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5">
          <IslamicCornerOrnament position="top-left" />
        </div>
        <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5">
          <IslamicCornerOrnament position="top-right" />
        </div>
        <div className="absolute bottom-2 left-2 sm:bottom-2.5 sm:left-2.5">
          <IslamicCornerOrnament position="bottom-left" />
        </div>
        <div className="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-2.5">
          <IslamicCornerOrnament position="bottom-right" />
        </div>

        {/* Content Wrapper */}
        <div className="flex flex-col items-center text-center">
          {/* Top emblem with glowing golden halo */}
          <div className="mb-1.5 inline-flex items-center justify-center rounded-xl bg-amber-600/15 p-1.5 sm:p-2 text-amber-800 shadow-inner ring-1 ring-amber-700/30 animate-splash-gleam">
            <IslamicStar className="size-4 sm:size-5 text-amber-700 animate-splash-pulse" />
          </div>

          {/* Subtitle / Iqra Banner */}
          <div className="mb-1.5 animate-splash-fade-up [animation-delay:100ms]">
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-700/25 bg-amber-600/10 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold tracking-wide text-amber-950">
              <Sparkles className="size-2.5 sm:size-3 text-amber-700" />
              <span>টাঙ্গাইল জেলা নূরানী বৃত্তি কল্যান পরিষদ</span>
            </span>
          </div>

          {/* 1. Main Arabic Bismillah Calligraphy with Moving Shimmer Effect */}
          <div
            className="my-1 sm:my-1.5 w-full animate-splash-fade-up [animation-delay:200ms]"
            dir="rtl"
            lang="ar"
          >
            <h1
              className="text-xl sm:text-2xl md:text-3xl font-bold leading-snug font-arabic tracking-wide select-none drop-shadow-[0_2px_8px_rgba(180,120,30,0.3)] bg-gradient-to-r from-emerald-950 via-amber-700 to-emerald-950 bg-clip-text text-transparent animate-splash-shimmer"
              style={{
                fontFamily:
                  "var(--font-amiri), 'Amiri', 'Scheherazade New', 'Traditional Arabic', serif",
              }}
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </h1>
          </div>

          {/* Bengali Pronunciation & Meaning for Bismillah */}
          <p className="text-xs sm:text-sm font-semibold tracking-wide text-amber-950 animate-splash-fade-up [animation-delay:280ms]">
            বিসমিল্লাহির রাহমানির রাহিম
          </p>

          <p className="mt-0.5 text-[10px] sm:text-xs text-stone-700 font-serif italic max-w-sm animate-splash-fade-up [animation-delay:340ms]">
            পরম করুণাময়, অসীম দয়ালু আল্লাহর নামে।
          </p>

          {/* Decorative Divider */}
          <IslamicDivider className="w-28 sm:w-36 my-1.5 sm:my-2 opacity-75 animate-splash-fade-up [animation-delay:400ms]" />

          {/* 2. Surah Al-Alaq 1st Ayat (সূরা আল-আলাক্ব: ১ম আয়াত) */}
          <div className="w-full max-w-sm sm:max-w-md rounded-xl sm:rounded-2xl border border-amber-700/30 bg-gradient-to-b from-amber-500/[0.08] to-amber-600/[0.03] px-3 py-1.5 sm:px-4 sm:py-2 shadow-xs backdrop-blur-xs animate-splash-fade-up [animation-delay:460ms]">
            <div dir="rtl" lang="ar" className="my-0.5 sm:my-1">
              <p
                className="text-base sm:text-lg md:text-xl font-bold leading-normal font-arabic text-emerald-950 select-none drop-shadow-[0_1px_4px_rgba(212,175,55,0.25)]"
                style={{
                  fontFamily:
                    "var(--font-amiri), 'Amiri', 'Scheherazade New', 'Traditional Arabic', serif",
                }}
              >
                اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ
              </p>
            </div>

            <p className="text-[11px] sm:text-xs font-semibold tracking-wide text-amber-950 mt-0.5">
              {isBangla
                ? "ইক্বরা বিসমি রাব্বিকাল্লাযী খালাক্ব"
                : "Iqra bismi rabbikallazi khalaq"}
            </p>

            <p className="text-[10px] sm:text-[11px] text-stone-700 font-serif italic mt-0.5">
              {isBangla
                ? "— পাঠ করুন আপনার প্রতিপালকের নামে, যিনি সৃষ্টি করেছেন।"
                : "— Read in the name of your Lord who created."}
            </p>
          </div>

          {/* Divider */}
          <IslamicDivider className="w-32 sm:w-44 my-1.5 sm:my-2 animate-splash-fade-up [animation-delay:520ms]" />

          {/* 3. Iqra Scholarship Branding */}
          <div className="mb-2 sm:mb-2.5 space-y-0 animate-splash-fade-up [animation-delay:580ms]">
            <h2 className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-stone-900">
              ইক্বরা মেধা বৃত্তি পরীক্ষা
            </h2>
            <p className="text-[10px] sm:text-xs text-stone-600 font-medium">
              Iqra Scholarship Management System
            </p>
          </div>

          {/* 4. Primary Action: Continue to Website */}
          <div className="w-full max-w-[200px] sm:max-w-[240px] animate-splash-fade-up [animation-delay:640ms]">
            <button
              type="button"
              onClick={handleDismiss}
              className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-amber-700 px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-emerald-950/20 transition-all duration-200 hover:from-emerald-800 hover:to-amber-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
              autoFocus
            >
              <span>{isBangla ? "ওয়েবসাইটে প্রবেশ করুন" : "Continue to Website"}</span>
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>

          {/* 5. Settings / Skip Duration Options */}
          <div className="mt-1.5 sm:mt-2 w-full animate-splash-fade-up [animation-delay:720ms]">
            <SplashSettings
              onSelectOption={handleSkipOption}
              isBangla={isBangla}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
