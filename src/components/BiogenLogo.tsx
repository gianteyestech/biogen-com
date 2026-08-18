import React from "react";
import Image from "next/image";

interface BiogenLogoProps {
  variant?: "dark" | "light" | "symbol";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showSubtitle?: boolean;
}

export default function BiogenLogo({
  variant = "light",
  size = "md",
  className = "",
}: BiogenLogoProps) {
  // Sizing map for authentic official logo image
  const sizeMap = {
    sm: { width: 140, height: 38, className: "h-8 sm:h-9" },
    md: { width: 180, height: 48, className: "h-10 sm:h-11" },
    lg: { width: 220, height: 60, className: "h-12 sm:h-14" },
    xl: { width: 280, height: 75, className: "h-16 sm:h-20" },
  }[size];

  if (variant === "symbol") {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <Image
          src="/logo.png"
          alt="Biogen Pharma"
          width={60}
          height={60}
          className="h-8 w-auto object-contain drop-shadow-sm"
          priority
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <Image
        src="/logo.png"
        alt="Biogen Pharma"
        width={sizeMap.width}
        height={sizeMap.height}
        className={`${sizeMap.className} w-auto object-contain transition-transform group-hover:scale-[1.02] drop-shadow-xs`}
        priority
      />
    </div>
  );
}
