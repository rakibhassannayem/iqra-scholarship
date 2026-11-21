"use client";

import React from "react";

/**
 * Pure SVG Islamic Artwork, Ornaments & Moving Motifs:
 * - Crescent Moon & Star (হিলাল ও তারকা)
 * - Holy Quran / Book of Knowledge (পবিত্র কুরআন ও কিতাব)
 * - Islamic Lantern / Fanous (ইসলামিক ফানুস)
 * - 8-pointed & 4-pointed Twinkling Stars
 */

export function IslamicStar({ className = "size-8 text-amber-500/80" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer 8-pointed star */}
      <polygon
        points="50,0 63,37 100,50 63,63 50,100 37,63 0,50 37,37"
        fill="currentColor"
        fillOpacity="0.25"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Rotated overlapping square forming octagram */}
      <rect
        x="20"
        y="20"
        width="60"
        height="60"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.85"
        transform="rotate(45 50 50)"
      />
      <rect
        x="20"
        y="20"
        width="60"
        height="60"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.85"
      />
      {/* Central rosette */}
      <circle
        cx="50"
        cy="50"
        r="14"
        fill="currentColor"
        fillOpacity="0.3"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="50" cy="50" r="4" fill="currentColor" />
    </svg>
  );
}

/**
 * 4-Pointed Sparkle Star
 */
export function FourPointStar({ className = "size-5 text-amber-500" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 0 C20 10, 20 10, 30 20 C20 20, 20 20, 20 40 C20 20, 20 20, 10 20 C20 10, 20 10, 20 0 Z" />
    </svg>
  );
}

/**
 * Crescent Moon with a Radiant Star (হিলাল ও তারকা)
 */
export function CrescentMoonWithStar({ className = "size-20 text-amber-600" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#B45309" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Ambient soft glow halo */}
      <circle cx="48" cy="50" r="44" fill="url(#moonGlow)" />

      {/* Elegant Crescent Moon */}
      <path
        d="M65 15 C40 18, 20 38, 20 62 C20 84, 38 98, 62 98 C72 98, 81 94, 88 88 C64 88, 44 70, 44 48 C44 32, 53 20, 65 15 Z"
        fill="currentColor"
        fillOpacity="0.85"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      {/* Radiant Star in the crescent's arms */}
      <g transform="translate(62, 34) scale(0.35)">
        <polygon
          points="50,0 63,37 100,50 63,63 50,100 37,63 0,50 37,37"
          fill="#FDE68A"
          stroke="currentColor"
          strokeWidth="3"
        />
        <circle cx="50" cy="50" r="10" fill="#F59E0B" />
      </g>
    </svg>
  );
}

/**
 * Holy Quran / Open Book of Divine Knowledge on Wooden Rehal (পবিত্র কিতাব)
 */
export function HolyQuranBook({ className = "size-20 text-amber-600" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Wooden Rehal / Book Stand Base */}
      <path
        d="M25 65 L50 85 L75 65 M50 85 L50 72"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
      <path
        d="M32 75 L68 75"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Left Open Page */}
      <path
        d="M50 35 C40 30, 20 32, 10 38 L10 65 C20 59, 40 57, 50 62 Z"
        fill="#FDFBF7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Right Open Page */}
      <path
        d="M50 35 C60 30, 80 32, 90 38 L90 65 C80 59, 60 57, 50 62 Z"
        fill="#FAF5EC"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Scripture lines (Left page) */}
      <line x1="16" y1="44" x2="42" y2="40" stroke="currentColor" strokeWidth="1.2" opacity="0.45" />
      <line x1="16" y1="49" x2="42" y2="45" stroke="currentColor" strokeWidth="1.2" opacity="0.45" />
      <line x1="16" y1="54" x2="42" y2="50" stroke="currentColor" strokeWidth="1.2" opacity="0.45" />
      <line x1="20" y1="59" x2="38" y2="56" stroke="currentColor" strokeWidth="1.2" opacity="0.45" />

      {/* Scripture lines (Right page) */}
      <line x1="58" y1="40" x2="84" y2="44" stroke="currentColor" strokeWidth="1.2" opacity="0.45" />
      <line x1="58" y1="45" x2="84" y2="49" stroke="currentColor" strokeWidth="1.2" opacity="0.45" />
      <line x1="58" y1="50" x2="84" y2="54" stroke="currentColor" strokeWidth="1.2" opacity="0.45" />
      <line x1="62" y1="56" x2="80" y2="59" stroke="currentColor" strokeWidth="1.2" opacity="0.45" />

      {/* Golden Bookmark Ribbon */}
      <path
        d="M50 32 L50 68 L53 64 L56 68 L56 32"
        fill="#D97706"
        stroke="#B45309"
        strokeWidth="1"
      />

      {/* Subtle divine radiant rays emerging from the Book */}
      <line x1="50" y1="18" x2="50" y2="26" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
      <line x1="32" y1="22" x2="38" y2="28" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" opacity="0.65" />
      <line x1="68" y1="22" x2="62" y2="28" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" opacity="0.65" />
      <line x1="18" y1="30" x2="26" y2="33" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="82" y1="30" x2="74" y2="33" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

/**
 * Traditional Islamic Lantern / Fanous (ইসলামিক ফানুস)
 */
export function IslamicLantern({ className = "size-16 text-amber-600" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Top Hanging Ring and Chain */}
      <circle cx="30" cy="8" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
      <line x1="30" y1="13" x2="30" y2="20" stroke="currentColor" strokeWidth="2" />

      {/* Lantern Dome Roof */}
      <path
        d="M20 28 C20 22, 26 20, 30 18 C34 20, 40 22, 40 28 Z"
        fill="currentColor"
        fillOpacity="0.7"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      {/* Crescent finial on dome */}
      <path
        d="M28 17 C28 14, 30 13, 31 12 C30 14, 31 16, 29 17 Z"
        fill="#F59E0B"
      />

      {/* Hexagonal Glass Chamber */}
      <polygon
        points="14,35 46,35 40,75 20,75"
        fill="#FEF3C7"
        fillOpacity="0.65"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* Chamber ribs */}
      <line x1="26" y1="35" x2="28" y2="75" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
      <line x1="34" y1="35" x2="32" y2="75" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />

      {/* Glowing inner flame */}
      <ellipse cx="30" cy="55" rx="4" ry="7" fill="#F59E0B" />
      <circle cx="30" cy="55" r="2" fill="#FEF08A" />

      {/* Lantern Base */}
      <path
        d="M18 75 L42 75 L38 85 L22 85 Z"
        fill="currentColor"
        fillOpacity="0.8"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      {/* Bottom finial pendant */}
      <circle cx="30" cy="89" r="2.5" fill="currentColor" />
    </svg>
  );
}

export function IslamicDivider({ className = "w-full max-w-md my-4" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-600/50 to-amber-700/80" />
      <div className="flex items-center gap-1.5 text-amber-700">
        <span className="size-1.5 rounded-full bg-amber-600 animate-splash-pulse" />
        <IslamicStar className="size-5 text-amber-700 animate-splash-gleam" />
        <span className="size-1.5 rounded-full bg-amber-600 animate-splash-pulse" />
      </div>
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-amber-600/50 to-amber-700/80" />
    </div>
  );
}

/**
 * Rich Animated Background with Visible Islamic Motifs:
 * - Floating Crescent Moon & Star (Top-Left)
 * - Floating Holy Quran / Book (Bottom-Right)
 * - Floating Traditional Islamic Lantern (Top-Right)
 * - Floating Radiant Star (Bottom-Left)
 * - Multiple Twinkling Golden Stars & Ascending Dust Motes
 * - Rotating Central Mandala
 */
export function IslamicBackgroundPattern() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Seamless geometric background pattern */}
      <svg className="absolute inset-0 size-full opacity-35" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="islamic-grid"
            width="120"
            height="120"
            patternUnits="userSpaceOnUse"
          >
            <g stroke="#B8860B" strokeWidth="0.9" fill="none" opacity="0.6">
              <rect x="35" y="35" width="50" height="50" />
              <rect x="35" y="35" width="50" height="50" transform="rotate(45 60 60)" />
              <circle cx="60" cy="60" r="12" />
              <circle cx="60" cy="60" r="2.5" fill="#B8860B" />
              <line x1="0" y1="0" x2="35" y2="35" />
              <line x1="120" y1="0" x2="85" y2="35" />
              <line x1="0" y1="120" x2="35" y2="85" />
              <line x1="120" y1="120" x2="85" y2="85" />
              <rect x="-15" y="-15" width="30" height="30" />
              <rect x="105" y="-15" width="30" height="30" />
              <rect x="-15" y="105" width="30" height="30" />
              <rect x="105" y="105" width="30" height="30" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-grid)" />
      </svg>

      {/* Dual Moving Islamic Mandalas: Slow Majestic Rotation */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30">
        <svg
          viewBox="0 0 400 400"
          className="size-[650px] sm:size-[850px] text-amber-700/40 animate-splash-spin-slow"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="200" cy="200" r="195" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 7" />
          <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="1.8" />
          <polygon
            points="200,15 238,137 360,140 263,212 298,335 200,260 102,335 137,212 40,140 162,137"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <rect x="70" y="70" width="260" height="260" stroke="currentColor" strokeWidth="1.2" />
          <rect x="70" y="70" width="260" height="260" stroke="currentColor" strokeWidth="1.2" transform="rotate(45 200 200)" />
          <circle cx="200" cy="200" r="95" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="200" cy="200" r="48" stroke="currentColor" strokeWidth="1.8" strokeDasharray="4 5" />
        </svg>
      </div>

      {/* 1. VISIBLE FLOATING CRESCENT MOON & STAR (Top-Left) */}
      <div className="absolute top-6 left-6 sm:top-14 sm:left-14 opacity-90 animate-splash-float drop-shadow-[0_4px_16px_rgba(245,158,11,0.5)]">
        <CrescentMoonWithStar className="size-20 sm:size-28 text-amber-600" />
      </div>

      {/* 2. VISIBLE FLOATING TRADITIONAL ISLAMIC LANTERN (Top-Right) */}
      <div className="absolute top-4 right-8 sm:top-10 sm:right-16 opacity-90 animate-splash-float [animation-delay:1.2s] drop-shadow-[0_6px_18px_rgba(245,158,11,0.55)]">
        <IslamicLantern className="size-16 sm:size-24 text-amber-700" />
      </div>

      {/* 3. VISIBLE FLOATING OPEN HOLY BOOK / QURAN (Bottom-Right) */}
      <div className="absolute bottom-8 right-6 sm:bottom-14 sm:right-16 opacity-90 animate-splash-float-reverse drop-shadow-[0_6px_20px_rgba(217,119,6,0.45)]">
        <HolyQuranBook className="size-24 sm:size-32 text-amber-700" />
      </div>

      {/* 4. VISIBLE FLOATING 8-POINT RADIANT STAR (Bottom-Left) */}
      <div className="absolute bottom-10 left-8 sm:bottom-16 sm:left-16 opacity-90 animate-splash-float [animation-delay:1.8s] drop-shadow-[0_4px_14px_rgba(245,158,11,0.45)]">
        <IslamicStar className="size-16 sm:size-20 text-amber-600 animate-splash-gleam" />
      </div>

      {/* 5. VISIBLE SCATTERED TWINKLING STARS (Clearly Noticeable Moving Animation) */}
      <div className="absolute top-[22%] left-[28%] text-amber-500 animate-splash-twinkle [animation-delay:0.2s]">
        <FourPointStar className="size-6 sm:size-7" />
      </div>
      <div className="absolute top-[20%] right-[32%] text-amber-500 animate-splash-twinkle [animation-delay:0.7s]">
        <FourPointStar className="size-5 sm:size-6" />
      </div>
      <div className="absolute top-[48%] left-[6%] sm:left-[8%] text-amber-600 animate-splash-twinkle [animation-delay:1.1s]">
        <FourPointStar className="size-6 sm:size-8" />
      </div>
      <div className="absolute top-[45%] right-[6%] sm:right-[8%] text-amber-600 animate-splash-twinkle [animation-delay:0.5s]">
        <FourPointStar className="size-6 sm:size-8" />
      </div>
      <div className="absolute bottom-[24%] left-[30%] text-amber-500 animate-splash-twinkle [animation-delay:0.9s]">
        <FourPointStar className="size-5 sm:size-6" />
      </div>
      <div className="absolute bottom-[26%] right-[30%] text-amber-500 animate-splash-twinkle [animation-delay:1.4s]">
        <FourPointStar className="size-6 sm:size-7" />
      </div>

      {/* 6. ASCENDING FLOATING GOLDEN PARTICLES */}
      <div className="absolute top-[35%] left-[16%] size-3 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)] animate-splash-particle [animation-delay:0s]" />
      <div className="absolute top-[40%] right-[20%] size-3.5 rounded-full bg-amber-300 shadow-[0_0_14px_rgba(252,211,77,0.9)] animate-splash-particle [animation-delay:1.2s]" />
      <div className="absolute bottom-[40%] left-[12%] size-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.85)] animate-splash-particle [animation-delay:2.4s]" />
      <div className="absolute bottom-[30%] right-[12%] size-3 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)] animate-splash-particle [animation-delay:0.7s]" />
      <div className="absolute top-[15%] left-[45%] size-2.5 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.85)] animate-splash-particle [animation-delay:1.8s]" />
    </div>
  );
}

export function IslamicCornerOrnament({ position }: { position: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const getTransforms = () => {
    switch (position) {
      case "top-left":
        return "";
      case "top-right":
        return "scale-x-[-1]";
      case "bottom-left":
        return "scale-y-[-1]";
      case "bottom-right":
        return "scale-x-[-1] scale-y-[-1]";
    }
  };

  return (
    <svg
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`size-10 sm:size-14 text-amber-700/70 ${getTransforms()}`}
      aria-hidden="true"
    >
      <path
        d="M2 2 H40 C35 15, 20 20, 20 40 V58"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6 6 H28 C24 16, 16 24, 6 28 V6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeOpacity="0.85"
      />
      <circle cx="6" cy="6" r="2.8" fill="currentColor" />
      <circle cx="28" cy="6" r="1.8" fill="currentColor" />
      <circle cx="6" cy="28" r="1.8" fill="currentColor" />
      <path d="M12 12 Q18 12, 18 18" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
