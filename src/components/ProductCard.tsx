"use client";
import React from "react";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import { Product, getSavePercent } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

const goldGrad = "linear-gradient(135deg, #F0C040 0%, #C9A84C 55%, #B8922B 100%)";

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const defaultWeight = Object.keys(product.prices)[0];
  const savePercent = getSavePercent(product, defaultWeight);
  const originalPrice = product.originalPrices?.[defaultWeight];
  const currentPrice = product.prices[defaultWeight];

  return (
    <div className="bg-white rounded-lg overflow-hidden group border border-gray-100 hover:border-[#C9A84C]/40 hover:shadow-[0_8px_30px_rgba(0,152,70,0.1)] transition-all duration-300 flex flex-col h-full relative">
      {/* Image area */}
      <Link href={`/product/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-white flex-shrink-0">
        
        {/* Badges Container */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {savePercent && (
            <span className="bg-[#C9A84C] text-white text-[10px] font-bold uppercase px-2 py-1 rounded shadow-sm">
              -{savePercent}%
            </span>
          )}
          {product.isNew && !savePercent && (
            <span className="bg-red-500 text-white text-[10px] font-bold uppercase px-2 py-1 rounded shadow-sm">
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
        <div className="flex items-center gap-1 mb-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12}
              className={i < Math.floor(product.rating) ? "fill-orange-400 text-orange-400" : "fill-gray-200 text-gray-200"} />
          ))}
          <span className="text-[10px] text-gray-400 font-medium ml-1">({product.reviewsCount})</span>
        </div>

        {/* Title */}
        <Link href={`/product/${product.id}`} className="mb-1">
          <h3 className="font-sans text-[13px] sm:text-sm font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-[#C9A84C] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Spacer to push pricing and button to bottom */}
        <div className="mt-auto flex items-center justify-between">
          {/* Pricing */}
          <div className="flex flex-col">
            {originalPrice && (
              <span className="text-[11px] sm:text-xs text-gray-400 line-through font-medium">
                Rs. {(originalPrice ?? 0).toLocaleString()}
              </span>
            )}
            <span className="text-[15px] sm:text-base font-extrabold text-[#C9A84C]">
              Rs. {(currentPrice ?? 0).toLocaleString()}
            </span>
          </div>

          {/* Add to Cart Icon Button */}
          <button
            onClick={() => addToCart(product, defaultWeight)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#C9A84C] border border-[#C9A84C] hover:bg-[#C9A84C] hover:text-white transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
