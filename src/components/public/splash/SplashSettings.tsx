"use client";

import { useState } from "react";
import { Clock, Check, ChevronDown, Sparkles } from "lucide-react";

export type SkipOption = {
  id: string;
  label: string;
  labelBn: string;
  durationMs: number | null; // null for permanent "Don't show again"
};

export const SKIP_OPTIONS: SkipOption[] = [
  { id: "3h", label: "3 Hours", labelBn: "৩ ঘণ্টা", durationMs: 3 * 60 * 60 * 1000 },
  { id: "6h", label: "6 Hours", labelBn: "৬ ঘণ্টা", durationMs: 6 * 60 * 60 * 1000 },
  { id: "12h", label: "12 Hours", labelBn: "১২ ঘণ্টা", durationMs: 12 * 60 * 60 * 1000 },
  { id: "1d", label: "1 Day", labelBn: "১ দিন", durationMs: 24 * 60 * 60 * 1000 },
  { id: "3d", label: "3 Days", labelBn: "৩ দিন", durationMs: 3 * 24 * 60 * 60 * 1000 },
  { id: "7d", label: "7 Days", labelBn: "৭ দিন", durationMs: 7 * 24 * 60 * 60 * 1000 },
  { id: "never", label: "Don't show again", labelBn: "আর দেখাবেন না", durationMs: null },
];

type SplashSettingsProps = {
  onSelectOption: (option: SkipOption) => void;
  isBangla?: boolean;
};

export default function SplashSettings({
  onSelectOption,
  isBangla = true,
}: SplashSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function handleSelect(option: SkipOption) {
    setSelectedId(option.id);
    onSelectOption(option);
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Toggle button */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex items-center gap-1.5 text-xs text-amber-900/70 hover:text-amber-900 transition-colors py-1.5 px-3 rounded-full hover:bg-amber-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
          aria-expanded={isOpen}
          aria-label={
            isBangla
              ? "স্প্ল্যাশ স্ক্রিন বন্ধ রাখার অপশন"
              : "Splash Screen skip duration options"
          }
        >
          <Clock className="size-3.5 text-amber-600" />
          <span>
            {isBangla
              ? "নির্দিষ্ট সময়ের জন্য বন্ধ রাখুন"
              : "Don't show Splash Screen for..."}
          </span>
          <ChevronDown
            className={`size-3 text-amber-600 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Expanded Skip Options Panel */}
      {isOpen && (
        <div className="mt-3 rounded-2xl border border-amber-700/25 bg-amber-100/60 p-4 shadow-sm backdrop-blur-sm animate-splash-fade-in">
          <div className="mb-2.5 text-center">
            <h4 className="text-xs font-semibold text-amber-950 uppercase tracking-wider">
              Don&apos;t show Splash Screen for
            </h4>
            <p className="text-[11px] text-amber-900/70 mt-0.5">
              {isBangla
                ? "যেকোনো একটি সময়সীমা নির্বাচন করুন"
                : "Choose a duration to temporarily or permanently skip"}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {SKIP_OPTIONS.map((option) => {
              const isSelected = selectedId === option.id;
              const isNever = option.id === "never";

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`relative flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all duration-150 ${
                    isNever ? "col-span-2 sm:col-span-2 border-dashed" : ""
                  } ${
                    isSelected
                      ? "bg-amber-700 text-white shadow-sm ring-2 ring-amber-700/40 font-semibold"
                      : "border border-amber-700/30 bg-[#FFFDF8] text-amber-950 hover:bg-amber-200/50 hover:border-amber-700/50"
                  }`}
                  aria-pressed={isSelected}
                >
                  {isSelected ? (
                    <Check className="size-3 text-white" />
                  ) : isNever ? (
                    <Sparkles className="size-3 text-amber-600" />
                  ) : null}
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
