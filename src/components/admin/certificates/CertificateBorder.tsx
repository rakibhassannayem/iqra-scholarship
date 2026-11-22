import React from "react";

/**
 * Beautiful ornamental floral border for certificate,
 * matching the authentic classic multi-color Bengali scholarship certificate design.
 */
export function CertificateBorder({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 size-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      viewBox="0 0 1000 700"
      aria-hidden="true"
    >
      <defs>
        {/* Repeating floral motif pattern for top and bottom borders */}
        <pattern
          id="cert-horizontal-vine"
          width="40"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          {/* Main central wavy vine */}
          <path
            d="M0,12 Q10,4 20,12 T40,12"
            fill="none"
            stroke="#166534"
            strokeWidth="1.8"
          />
          {/* Leaves */}
          <path d="M8,9 Q5,3 10,4 Q12,8 8,9 Z" fill="#15803d" />
          <path d="M28,15 Q31,21 26,20 Q24,16 28,15 Z" fill="#16a34a" />
          {/* Flowers */}
          <circle cx="20" cy="12" r="3.5" fill="#dc2626" />
          <circle cx="20" cy="12" r="1.5" fill="#facc15" />
          <circle cx="40" cy="12" r="3" fill="#2563eb" />
          <circle cx="40" cy="12" r="1.2" fill="#fef08a" />
          <circle cx="0" cy="12" r="3" fill="#2563eb" />
          <circle cx="0" cy="12" r="1.2" fill="#fef08a" />
          <circle cx="10" cy="6" r="2.2" fill="#f59e0b" />
          <circle cx="30" cy="18" r="2.2" fill="#ea580c" />
        </pattern>

        {/* Repeating floral motif pattern for left and right vertical borders */}
        <pattern
          id="cert-vertical-vine"
          width="24"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          {/* Main central wavy vine */}
          <path
            d="M12,0 Q4,10 12,20 T12,40"
            fill="none"
            stroke="#166534"
            strokeWidth="1.8"
          />
          {/* Leaves */}
          <path d="M9,8 Q3,5 4,10 Q8,12 9,8 Z" fill="#15803d" />
          <path d="M15,28 Q21,31 20,26 Q16,24 15,28 Z" fill="#16a34a" />
          {/* Flowers */}
          <circle cx="12" cy="20" r="3.5" fill="#dc2626" />
          <circle cx="12" cy="20" r="1.5" fill="#facc15" />
          <circle cx="12" cy="40" r="3" fill="#2563eb" />
          <circle cx="12" cy="40" r="1.2" fill="#fef08a" />
          <circle cx="12" cy="0" r="3" fill="#2563eb" />
          <circle cx="12" cy="0" r="1.2" fill="#fef08a" />
          <circle cx="6" cy="10" r="2.2" fill="#f59e0b" />
          <circle cx="18" cy="30" r="2.2" fill="#ea580c" />
        </pattern>
      </defs>

      {/* Outermost solid boundary line */}
      <rect
        x="6"
        y="6"
        width="988"
        height="688"
        fill="none"
        stroke="#1e293b"
        strokeWidth="1.5"
      />

      {/* Decorative Floral Vine Ribbon (Top) */}
      <rect x="36" y="8" width="928" height="24" fill="url(#cert-horizontal-vine)" />
      {/* Decorative Floral Vine Ribbon (Bottom) */}
      <rect x="36" y="668" width="928" height="24" fill="url(#cert-horizontal-vine)" />
      {/* Decorative Floral Vine Ribbon (Left) */}
      <rect x="8" y="36" width="24" height="628" fill="url(#cert-vertical-vine)" />
      {/* Decorative Floral Vine Ribbon (Right) */}
      <rect x="968" y="36" width="24" height="628" fill="url(#cert-vertical-vine)" />

      {/* Outer framing lines around floral ribbon */}
      <rect
        x="32"
        y="32"
        width="936"
        height="636"
        fill="none"
        stroke="#0f172a"
        strokeWidth="1.2"
      />
      <rect
        x="35"
        y="35"
        width="930"
        height="630"
        fill="none"
        stroke="#b45309"
        strokeWidth="0.8"
      />

      {/* Corner Rosettes */}
      {/* Top-Left Corner */}
      <g transform="translate(8, 8)">
        <rect x="0" y="0" width="28" height="28" fill="#fef3c7" stroke="#b45309" strokeWidth="1" />
        <circle cx="14" cy="14" r="9" fill="#dc2626" />
        <circle cx="14" cy="14" r="5" fill="#facc15" stroke="#166534" strokeWidth="1" />
        <circle cx="14" cy="14" r="2" fill="#1e3a8a" />
        <path d="M4,4 L10,10 M24,4 L18,10 M4,24 L10,18 M24,24 L18,18" stroke="#15803d" strokeWidth="1.5" />
      </g>

      {/* Top-Right Corner */}
      <g transform="translate(964, 8)">
        <rect x="0" y="0" width="28" height="28" fill="#fef3c7" stroke="#b45309" strokeWidth="1" />
        <circle cx="14" cy="14" r="9" fill="#dc2626" />
        <circle cx="14" cy="14" r="5" fill="#facc15" stroke="#166534" strokeWidth="1" />
        <circle cx="14" cy="14" r="2" fill="#1e3a8a" />
        <path d="M4,4 L10,10 M24,4 L18,10 M4,24 L10,18 M24,24 L18,18" stroke="#15803d" strokeWidth="1.5" />
      </g>

      {/* Bottom-Left Corner */}
      <g transform="translate(8, 664)">
        <rect x="0" y="0" width="28" height="28" fill="#fef3c7" stroke="#b45309" strokeWidth="1" />
        <circle cx="14" cy="14" r="9" fill="#dc2626" />
        <circle cx="14" cy="14" r="5" fill="#facc15" stroke="#166534" strokeWidth="1" />
        <circle cx="14" cy="14" r="2" fill="#1e3a8a" />
        <path d="M4,4 L10,10 M24,4 L18,10 M4,24 L10,18 M24,24 L18,18" stroke="#15803d" strokeWidth="1.5" />
      </g>

      {/* Bottom-Right Corner */}
      <g transform="translate(964, 664)">
        <rect x="0" y="0" width="28" height="28" fill="#fef3c7" stroke="#b45309" strokeWidth="1" />
        <circle cx="14" cy="14" r="9" fill="#dc2626" />
        <circle cx="14" cy="14" r="5" fill="#facc15" stroke="#166534" strokeWidth="1" />
        <circle cx="14" cy="14" r="2" fill="#1e3a8a" />
        <path d="M4,4 L10,10 M24,4 L18,10 M4,24 L10,18 M24,24 L18,18" stroke="#15803d" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

/**
 * Ornamental Cartouche Badge for "বৃত্তি সনদ" (Scholarship Certificate),
 * matching the green wing flourishes, deep purple pill body, and golden yellow typography.
 */
export function CertificateCartouche({
  text = "বৃত্তি সনদ",
  className = "",
}: {
  text?: string;
  className?: string;
}) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 340 56"
        className="h-12 w-auto sm:h-14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left Green Ornamental Wing / Flourish */}
        <path
          d="M32 28 C20 16 12 18 2 28 C12 38 20 40 32 28 Z"
          fill="#15803d"
          stroke="#052e16"
          strokeWidth="1.5"
        />
        <path
          d="M20 28 C12 24 8 26 2 28 C8 30 12 32 20 28 Z"
          fill="#16a34a"
        />
        <circle cx="8" cy="28" r="2" fill="#facc15" />

        {/* Right Green Ornamental Wing / Flourish */}
        <path
          d="M308 28 C320 16 328 18 338 28 C328 38 320 40 308 28 Z"
          fill="#15803d"
          stroke="#052e16"
          strokeWidth="1.5"
        />
        <path
          d="M320 28 C328 24 332 26 338 28 C332 30 328 32 320 28 Z"
          fill="#16a34a"
        />
        <circle cx="332" cy="28" r="2" fill="#facc15" />

        {/* Outer Green Border of the Cartouche */}
        <rect
          x="24"
          y="6"
          width="292"
          height="44"
          rx="22"
          fill="#15803d"
          stroke="#052e16"
          strokeWidth="2"
        />

        {/* Inner Purple / Magenta Filled Body */}
        <rect
          x="28"
          y="10"
          width="284"
          height="36"
          rx="18"
          fill="#86198f"
          stroke="#fde047"
          strokeWidth="1"
        />

        {/* Left / Right inner bracket dots */}
        <circle cx="42" cy="28" r="2.5" fill="#fde047" />
        <circle cx="298" cy="28" r="2.5" fill="#fde047" />

        {/* Vibrant Yellow Calligraphic Text */}
        <text
          x="170"
          y="35"
          textAnchor="middle"
          fill="#fef08a"
          stroke="#fde047"
          strokeWidth="0.8"
          fontSize="23"
          fontWeight="900"
          letterSpacing="2"
          style={{
            fontFamily:
              "'Hind Siliguri', 'Kalpurush', 'SolaimanLipi', sans-serif",
          }}
        >
          {text}
        </text>
      </svg>
    </div>
  );
}
