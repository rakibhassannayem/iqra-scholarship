"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
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
      className={`fixed inset-0 z-[100] flex min-h-screen flex-col items-center justify-center overflow-y-auto px-4 py-8 sm:py-12 transition-all duration-500 bg-[#E8DEC8] ${
        isClosing
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

      {/* Main Islamic Card with Rich Parchment Warmth and Golden Borders */}
      <div className="relative z-10 w-full max-w-2xl rounded-3xl border-2 border-amber-700/35 bg-[#FAF5EC]/95 p-6 sm:p-10 md:p-12 shadow-[0_25px_60px_-15px_rgba(40,25,10,0.38)] backdrop-blur-md animate-splash-zoom-in ring-2 ring-amber-600/20">
        {/* Decorative corner ornaments */}
        <div className="absolute top-3 left-3">
          <IslamicCornerOrnament position="top-left" />
        </div>
        <div className="absolute top-3 right-3">
          <IslamicCornerOrnament position="top-right" />
        </div>
        <div className="absolute bottom-3 left-3">
          <IslamicCornerOrnament position="bottom-left" />
        </div>
        <div className="absolute bottom-3 right-3">
          <IslamicCornerOrnament position="bottom-right" />
        </div>

        {/* Content Wrapper */}
        <div className="flex flex-col items-center text-center">
          {/* Top emblem with glowing golden halo */}
          <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-amber-600/15 p-3 text-amber-800 shadow-inner ring-1 ring-amber-700/30 animate-splash-gleam">
            <IslamicStar className="size-7 text-amber-700 animate-splash-pulse" />
          </div>

          {/* Subtitle / Iqra Banner */}
          <div className="mb-3 animate-splash-fade-up [animation-delay:100ms]">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-700/25 bg-amber-600/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-amber-950">
              <Sparkles className="size-3 text-amber-700" />
              <span>ইক্বরা নূরানী তা&apos;লীমুল কুরআন ফাউন্ডেশন</span>
            </span>
          </div>

          {/* 1. Main Arabic Bismillah Calligraphy with Moving Shimmer Effect */}
          <div
            className="my-4 sm:my-6 w-full animate-splash-fade-up [animation-delay:200ms]"
            dir="rtl"
            lang="ar"
          >
            <h1
              className="text-3xl sm:text-5xl md:text-6xl font-bold leading-normal font-arabic tracking-wide select-none drop-shadow-[0_2px_12px_rgba(180,120,30,0.3)] bg-gradient-to-r from-emerald-950 via-amber-700 to-emerald-950 bg-clip-text text-transparent animate-splash-shimmer"
              style={{
                fontFamily:
                  "var(--font-amiri), 'Amiri', 'Scheherazade New', 'Traditional Arabic', serif",
              }}
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </h1>
          </div>

          {/* 2. Bengali Pronunciation */}
          <p className="text-base sm:text-xl font-semibold tracking-wide text-amber-950 animate-splash-fade-up [animation-delay:350ms]">
            বিসমিল্লাহির রাহমানির রাহিম
          </p>

          {/* 3. Bengali Meaning */}
          <p className="mt-2 text-sm sm:text-base text-stone-700 font-serif italic max-w-md animate-splash-fade-up [animation-delay:450ms]">
            পরম করুণাময়, অসীম দয়ালু আল্লাহর নামে।
          </p>

          {/* Elegant Divider */}
          <IslamicDivider className="w-52 sm:w-72 my-5 animate-splash-fade-up [animation-delay:550ms]" />

          {/* 4. Iqra Scholarship Branding */}
          <div className="mb-6 space-y-1 animate-splash-fade-up [animation-delay:650ms]">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              ইক্বরা মেধা বৃত্তি পরীক্ষা
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-medium">
              Iqra Scholarship Management System
            </p>
          </div>

          {/* 5. Primary Action: Continue to Website */}
          <div className="w-full max-w-xs animate-splash-fade-up [animation-delay:750ms]">
            <button
              type="button"
              onClick={handleDismiss}
              className="group relative inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-amber-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-950/20 transition-all duration-200 hover:from-emerald-800 hover:to-amber-600 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
              autoFocus
            >
              <span>{isBangla ? "ওয়েবসাইটে প্রবেশ করুন" : "Continue to Website"}</span>
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>

          {/* 6. Settings / Skip Duration Options */}
          <div className="mt-6 w-full animate-splash-fade-up [animation-delay:850ms]">
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
