"use client";
import React from "react";
import Link from "next/link";
import { ShoppingCart, Star, ShieldCheck } from "lucide-react";
import { Product, getSavePercent } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const defaultWeight = Object.keys(product.prices)[0];
  const savePercent = getSavePercent(product, defaultWeight);
  const originalPrice = product.originalPrices?.[defaultWeight];
  const currentPrice = product.prices[defaultWeight];

  return (
    <div className="bg-white rounded-xl overflow-hidden group border border-slate-200/80 hover:border-[#0072CE]/50 hover:shadow-[0_12px_30px_rgba(0,114,206,0.12)] transition-all duration-300 flex flex-col h-full relative">
      {/* Image area */}
      <Link href={`/product/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-slate-50 flex-shrink-0">
        {/* Badges Container */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {savePercent && (
            <span className="bg-[#70BA28] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-md shadow-sm">
              Save {savePercent}%
            </span>
          )}
          {product.badge && (
            <span className="bg-[#0072CE] text-white text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
              <ShieldCheck size={10} />
              {product.badge}
            </span>
          )}
          {product.isNew && !product.badge && (
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

        {/* Packing / Variant Tag */}
        {defaultWeight && (
          <div className="text-[11px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded w-fit">
            {defaultWeight}
          </div>
        )}

        {/* Spacer to push pricing and button to bottom */}
        <div className="mt-auto pt-2 flex items-center justify-between">
          {/* Pricing */}
          <div className="flex flex-col">
            {originalPrice && (
              <span className="text-[11px] sm:text-xs text-slate-400 line-through font-medium">
                ${(originalPrice ?? 0).toLocaleString()}
              </span>
            )}
            <span className="text-[15px] sm:text-base font-extrabold text-[#0072CE]">
              ${(currentPrice ?? 0).toLocaleString()}
            </span>
          </div>

          {/* Add to Cart Icon Button */}
          <button
            onClick={() => addToCart(product, defaultWeight)}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#0072CE] bg-blue-50 border border-[#0072CE]/30 hover:bg-[#0072CE] hover:text-white hover:border-[#0072CE] transition-all shadow-sm active:scale-95"
            aria-label="Add to cart"
            title="Add to medical requisition / cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
