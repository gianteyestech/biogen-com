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
    sm: { iconSize: 30, titleSize: "text-sm", subSize: "text-[8px]", gap: "gap-2" },
    md: { iconSize: 38, titleSize: "text-base", subSize: "text-[9px]", gap: "gap-2.5" },
    lg: { iconSize: 48, titleSize: "text-xl", subSize: "text-[10px]", gap: "gap-3" },
    xl: { iconSize: 58, titleSize: "text-2xl", subSize: "text-xs", gap: "gap-3.5" },
  }[size];

  // Vector Medical Emblem
  const renderEmblem = (w: number, h: number) => (
    <svg
      width={w}
      height={h}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <defs>
        <linearGradient id="medBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00A3E0" />
          <stop offset="100%" stopColor="#0072CE" />
        </linearGradient>
        <linearGradient id="medGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#70BA28" />
          <stop offset="100%" stopColor="#4D8A1B" />
        </linearGradient>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0072CE" stopOpacity={isDarkBg ? "0.25" : "0.12"} />
          <stop offset="100%" stopColor="#00A3E0" stopOpacity={isDarkBg ? "0.08" : "0.03"} />
        </linearGradient>
        <filter id="medShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0072CE" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Hexagonal Protective Bio-Shield */}
      <path
        d="M50 4L88 25V75L50 96L12 75V25L50 4Z"
        fill="url(#shieldGrad)"
        stroke="url(#medBlueGrad)"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Cross Arms - Horizontal */}
      <rect
        x="22"
        y="42"
        width="56"
        height="16"
        rx="8"
        fill="url(#medBlueGrad)"
        filter="url(#medShadow)"
      />

      {/* Cross Arms - Vertical */}
      <rect
        x="42"
        y="22"
        width="16"
        height="56"
        rx="8"
        fill="url(#medBlueGrad)"
      />

      {/* Center Vital Green Bio-Core Pill */}
      <circle cx="50" cy="50" r="10" fill="url(#medGreenGrad)" stroke="#FFFFFF" strokeWidth="2.5" />
      
      {/* Precision Leaf / Growth Arc */}
      <path
        d="M48 45C52 43 55 46 54 52"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );

  // Symbol Only
  if (variant === "symbol") {
    return (
      <div className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}>
        {renderEmblem(dimensions.iconSize, dimensions.iconSize)}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${dimensions.gap} select-none ${className}`}>
      {/* High-Tech Vector Emblem */}
      {renderEmblem(dimensions.iconSize, dimensions.iconSize)}

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
          <span className={`font-semibold tracking-wider uppercase mt-1 ${dimensions.subSize} ${
            isDarkBg ? "text-slate-400" : "text-slate-500"
          }`}>
            Healthcare &amp; Clinical Supplies
          </span>
        )}
      </div>
    </div>
  );
}
