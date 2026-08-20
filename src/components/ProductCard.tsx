"use client";
import React from "react";
import Link from "next/link";
import { ShoppingCart, Star, ShieldCheck, MessageSquare, FileText, ArrowRight } from "lucide-react";
import { Product, getSavePercent } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  siteMode?: "ecommerce" | "catalogue";
  hidePrices?: boolean;
  catalogueInquiryText?: string;
}

export default function ProductCard({
  product,
  siteMode = "ecommerce",
  hidePrices = false,
  catalogueInquiryText = "Request Quote",
}: ProductCardProps) {
  const { addToCart } = useCart();
  const defaultWeight = Object.keys(product.prices)[0];
  const savePercent = getSavePercent(product, defaultWeight);
  const originalPrice = product.originalPrices?.[defaultWeight];
  const currentPrice = product.prices[defaultWeight];

  const isCatalogue = siteMode === "catalogue";

  return (
    <div className="bg-white rounded-xl overflow-hidden group border border-slate-200/80 hover:border-[#0072CE]/50 hover:shadow-[0_12px_30px_rgba(0,114,206,0.12)] transition-all duration-300 flex flex-col h-full relative">
      {/* Image area */}
      <Link href={`/product/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-slate-50 flex-shrink-0">
        {/* Badges Container */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {!isCatalogue && savePercent && (
            <span className="bg-[#70BA28] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-md shadow-sm">
              Save {savePercent}%
            </span>
          )}
          {isCatalogue && (
            <span className="bg-blue-900/90 text-[#00A3E0] border border-blue-400/30 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-sm">
              B2B CATALOGUE
            </span>
          )}
          {product.badge && (
            <span className="bg-[#0072CE] text-white text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
              <ShieldCheck size={10} />
              {product.badge}
            </span>
          )}
          {product.isNew && !product.badge && !isCatalogue && (
            <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-md shadow-sm">
              NEW
            </span>
          )}
        </div>

        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500 ease-out relative z-0"
        />
      </Link>

      {/* Card body */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={12}
              className={i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}
            />
          ))}
          <span className="text-[11px] text-slate-400 font-medium ml-1">({product.reviewsCount})</span>
        </div>

        {/* Title */}
        <Link href={`/product/${product.id}`} className="mb-1">
          <h3 className="font-sans text-[13px] sm:text-sm font-semibold text-slate-800 leading-snug line-clamp-2 group-hover:text-[#0072CE] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Brand & Packaging Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mt-auto">
          {product.brand && (
            <span className="text-[10px] text-blue-700 font-semibold bg-blue-50/80 px-1.5 py-0.5 rounded border border-blue-100/60 truncate max-w-[150px]">
              {product.brand}
            </span>
          )}
          {product.registrationNo && product.registrationNo.startsWith("MCA") && (
            <span className="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-1 py-0.5 rounded border border-emerald-100">
              MCA
            </span>
          )}
        </div>

        {/* Spacer to push pricing and button to bottom */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Pricing area */}
          <div className="flex flex-col min-w-0">
            {isCatalogue && hidePrices ? (
              <span className="text-[11px] font-bold text-slate-500 truncate">
                Inquire for Pricing
              </span>
            ) : (
              <>
                {originalPrice && !isCatalogue && (
                  <span className="text-[11px] sm:text-xs text-slate-400 line-through font-medium">
                    ${(originalPrice ?? 0).toLocaleString()}
                  </span>
                )}
                <span className="text-[14px] sm:text-[15px] font-extrabold text-[#0072CE]">
                  ${(currentPrice ?? 0).toLocaleString()}
                  {isCatalogue && <span className="text-[9px] font-medium text-slate-400 ml-1">/ unit</span>}
                </span>
              </>
            )}
          </div>

          {/* Action button */}
          {isCatalogue ? (
            <Link
              href={`/product/${product.id}`}
              className="px-2.5 py-1.5 rounded-lg flex items-center gap-1 text-xs font-bold text-[#0072CE] bg-blue-50 border border-blue-200 hover:bg-[#0072CE] hover:text-white transition-all shadow-xs"
              title="View specifications and request quote"
            >
              <span>Inquire</span>
              <ArrowRight size={12} />
            </Link>
          ) : (
            <button
              onClick={() => addToCart(product, defaultWeight)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[#0072CE] bg-blue-50 border border-[#0072CE]/30 hover:bg-[#0072CE] hover:text-white hover:border-[#0072CE] transition-all shadow-xs active:scale-95 flex-shrink-0"
              aria-label="Add to cart"
              title="Add to medical requisition / cart"
            >
              <ShoppingCart size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
