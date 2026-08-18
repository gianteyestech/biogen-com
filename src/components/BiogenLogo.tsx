import React from "react";

interface BiogenLogoProps {
  variant?: "dark" | "light" | "symbol";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showSubtitle?: boolean;
}

export default function BiogenLogo({
  variant = "dark",
  size = "md",
  className = "",
  showSubtitle = true,
}: BiogenLogoProps) {
  const isDarkBg = variant === "dark";

  // Sizing definitions
  const dimensions = {
    sm: { iconSize: 28, titleSize: "text-sm", subSize: "text-[8px]", gap: "gap-2" },
    md: { iconSize: 36, titleSize: "text-base", subSize: "text-[9px]", gap: "gap-2.5" },
    lg: { iconSize: 46, titleSize: "text-xl", subSize: "text-[11px]", gap: "gap-3" },
    xl: { iconSize: 56, titleSize: "text-2xl", subSize: "text-xs", gap: "gap-3.5" },
  }[size];

  // Symbol Only
  if (variant === "symbol") {
    return (
      <div className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}>
        <svg
          width={dimensions.iconSize}
          height={dimensions.iconSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm"
        >
          <defs>
            <linearGradient id="bioGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00A3E0" />
              <stop offset="100%" stopColor="#0072CE" />
            </linearGradient>
            <linearGradient id="bioGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#70BA28" />
              <stop offset="100%" stopColor="#00A3E0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Hexagonal Shield Container */}
          <path
            d="M50 6L88 27.5V72.5L50 94L12 72.5V27.5L50 6Z"
            fill="url(#bioGrad1)"
            fillOpacity={isDarkBg ? "0.15" : "0.08"}
            stroke="url(#bioGrad1)"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Dynamic DNA Cross Core */}
          <path
            d="M50 20V80M20 50H80"
            stroke="url(#bioGrad1)"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Molecular Helix Nodes */}
          <circle cx="50" cy="50" r="10" fill="url(#bioGrad2)" />
          <circle cx="50" cy="22" r="5" fill="#00A3E0" />
          <circle cx="50" cy="78" r="5" fill="#0072CE" />
          <circle cx="22" cy="50" r="5" fill="#70BA28" />
          <circle cx="78" cy="50" r="5" fill="#00A3E0" />

          {/* Diagonal Bonds */}
          <circle cx="30" cy="30" r="3.5" fill="#00A3E0" fillOpacity="0.8" />
          <circle cx="70" cy="70" r="3.5" fill="#70BA28" fillOpacity="0.8" />
          <circle cx="70" cy="30" r="3.5" fill="#0072CE" fillOpacity="0.8" />
          <circle cx="30" cy="70" r="3.5" fill="#00A3E0" fillOpacity="0.8" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${dimensions.gap} select-none ${className}`}>
      {/* High-Tech Molecular Vector Emblem */}
      <div className="relative flex-shrink-0">
        <svg
          width={dimensions.iconSize}
          height={dimensions.iconSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="bioGradFull1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00A3E0" />
              <stop offset="100%" stopColor="#0072CE" />
            </linearGradient>
            <linearGradient id="bioGradFull2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#70BA28" />
              <stop offset="100%" stopColor="#00A3E0" />
            </linearGradient>
          </defs>

          {/* Hexagonal Medical Crest */}
          <path
            d="M50 7L87 28V72L50 93L13 72V28L50 7Z"
            fill={isDarkBg ? "#0072CE" : "#0072CE"}
            fillOpacity={isDarkBg ? "0.15" : "0.1"}
            stroke="url(#bioGradFull1)"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Clinical Cross */}
          <path
            d="M50 22V78M22 50H78"
            stroke="url(#bioGradFull1)"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Vital Core Sphere */}
          <circle cx="50" cy="50" r="9" fill="url(#bioGradFull2)" />

          {/* Orbital Satellite Nodes */}
          <circle cx="50" cy="22" r="5" fill="#00A3E0" />
          <circle cx="50" cy="78" r="5" fill="#0072CE" />
          <circle cx="22" cy="50" r="5" fill="#70BA28" />
          <circle cx="78" cy="50" r="5" fill="#00A3E0" />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-center tracking-tight">
          <span className={`font-black uppercase tracking-wider ${dimensions.titleSize} ${isDarkBg ? "text-white" : "text-slate-900"}`}>
            BIO<span className="text-[#0072CE]">GEN</span>
          </span>
          <span className={`font-black uppercase ml-1.5 px-1.5 py-0.5 rounded text-[10px] tracking-widest ${
            isDarkBg
              ? "bg-[#0072CE]/20 text-[#00A3E0] border border-[#0072CE]/40"
              : "bg-[#0072CE]/10 text-[#0072CE] border border-[#0072CE]/20"
          }`}>
            PHARMA
          </span>
        </div>

        {showSubtitle && (
          <span className={`font-semibold tracking-widest uppercase mt-1 ${dimensions.subSize} ${
            isDarkBg ? "text-slate-400" : "text-slate-500"
          }`}>
            Healthcare &amp; Clinical Supplies
          </span>
        )}
      </div>
    </div>
  );
}
