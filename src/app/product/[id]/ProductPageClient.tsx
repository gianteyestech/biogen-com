"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Star, ShoppingBag, ChevronRight, Minus, Plus, CheckCircle2, Package, Truck, Shield } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { BRAND } from "@/config/brand";
import Header from "@/components/Header";
import CartSlider from "@/components/CartSlider";
import ProductCard from "@/components/ProductCard";
import { getSavePercent } from "@/lib/cms-types";
import type { CMSProduct } from "@/lib/cms-types";

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const goldGrad = "linear-gradient(135deg, #F0C040 0%, #C9A84C 55%, #B8922B 100%)";
const goldText: React.CSSProperties = {
  background: goldGrad, WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent", backgroundClip: "text",
};

interface ProductPageClientProps {
  product: CMSProduct | null;
  related: CMSProduct[];
}

export default function ProductPageClient({ product, related }: ProductPageClientProps) {
  const { addToCart, setIsCartOpen } = useCart();
  const [selectedWeight, setSelectedWeight] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [addedNotice, setAddedNotice] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F0F0F0]">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        <CartSlider />
        <div className="global-container py-24 text-center">
          <p className="text-5xl mb-4">🔍</p>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h1>
          <Link href="/" className="inline-block px-6 py-3 rounded-xl font-bold text-sm uppercase text-[#0D0D0D]" style={{ background: goldGrad }}>← Back to Shop</Link>
        </div>
      </div>
    );
  }

  const weights = Object.keys(product.prices);
  const activeWeight = selectedWeight || weights[0] || "";
  const currentPrice = product.prices[activeWeight];
  const originalPrice = product.originalPrices?.[activeWeight];
  const savePercent = getSavePercent(product, activeWeight);

  const handleBuyNow = () => addToCart(product, activeWeight, quantity);

  const handleWhatsApp = () => {
    const total = currentPrice * quantity;
    const msg = [
      `🛒 *Order from Ideal Dry Fruit*`,
      ``, `• ${product.name}`,
      `  Weight: ${activeWeight} | Qty: ${quantity} | Rs. ${total.toLocaleString()}`,
      ``, `💰 *Total:* Rs. ${total.toLocaleString()}`,
      `📦 *Payment:* Cash on Delivery (COD)`,
      ``, `Please confirm my order. Thank you! 🙏`,
    ].join("\n");
    window.open(`${BRAND.contact.whatsappBase}&text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] font-sans">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      <CartSlider />

      <div className="global-container py-5">
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#C9A84C] transition-colors">Home</Link>
          <ChevronRight size={13} />
          <span className="text-[#C9A84C] font-semibold line-clamp-1">{product.name}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <div>
              <div className="relative rounded-2xl overflow-hidden bg-[#111111] aspect-square max-h-[480px]">
                {savePercent && (
                  <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-lg text-[#0D0D0D] text-xs font-extrabold" style={{ background: goldGrad }}>
                    SAVE {savePercent}%
                  </div>
                )}
                <div className="absolute top-4 right-4 z-10 bg-[#0D0D0D]/70 border border-[#C9A84C]/40 px-2.5 py-1 rounded-lg">
                  <span className="text-[#C9A84C] text-[10px] font-bold uppercase tracking-wide">HIGH QUALITY</span>
                </div>
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col gap-5">
              <div className="flex items-start justify-between gap-4">
                <h1 className="font-sans text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight flex-1">{product.name}</h1>
                {product.inStock && (
                  <span className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-full">
                    <CheckCircle2 size={11} /> IN STOCK
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex">{[...Array(5)].map((_, i) => (<Star key={i} size={15} className={i < Math.floor(product.rating) ? "fill-[#C9A84C] text-[#C9A84C]" : "fill-gray-200 text-gray-200"} />))}</div>
                <span className="text-sm text-gray-500">{product.reviewsCount} reviews</span>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black" style={goldText}>Rs. {(currentPrice ?? 0).toLocaleString()}</span>
                {originalPrice && <span className="text-lg text-gray-400 line-through">Rs. {originalPrice.toLocaleString()}</span>}
              </div>

              <hr className="border-gray-100" />

              <div>
                <p className="font-sans text-xs font-extrabold uppercase tracking-widest text-gray-500 mb-3">SELECT WEIGHT</p>
                <div className="flex flex-wrap gap-2.5">
                  {weights.map((w) => {
                    const sp = getSavePercent(product, w);
                    const isActive = activeWeight === w;
                    const priceForWeight = product.prices[w] ?? 0;
                    return (
                      <button key={w} onClick={() => setSelectedWeight(w)}
                        className={`relative flex flex-col items-center px-5 py-3 rounded-xl border-2 transition-all font-sans text-sm font-bold ${isActive ? "border-[#C9A84C] bg-[#FFF8E7]" : "border-gray-200 hover:border-[#C9A84C]/50 bg-white"}`}>
                        {sp && <span className="absolute -top-2.5 -right-2 text-[8px] font-extrabold px-1.5 py-0.5 rounded text-[#0D0D0D]" style={{ background: goldGrad }}>SAVE {sp}%</span>}
                        <span className={isActive ? "text-[#1a1a1a]" : "text-gray-600"}>{w}</span>
                        <span className="text-xs font-semibold" style={isActive ? goldText : { color: "#9ca3af" }}>Rs. {priceForWeight.toLocaleString()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="font-sans text-xs font-extrabold uppercase tracking-widest text-gray-500 mb-3">QUANTITY</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 text-gray-600 hover:bg-gray-50"><Minus size={14} /></button>
                    <span className="px-5 py-3 font-bold text-gray-900 min-w-[48px] text-center">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 text-gray-600 hover:bg-gray-50"><Plus size={14} /></button>
                  </div>
                  <span className="text-xs text-green-600 font-semibold flex items-center gap-1"><CheckCircle2 size={12} /> In Stock</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-[10px]">
                {["Premium Quality", "Fresh Stock", "100% Natural", "QC Verified"].map((t) => (
                  <span key={t} className="flex items-center gap-1 bg-[#FFF8E7] border border-[#C9A84C]/30 text-[#C9A84C] px-3 py-1 rounded-full font-semibold">✓ {t}</span>
                ))}
              </div>

              {addedNotice && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 size={16} /> Added {quantity}x {product.name} ({activeWeight}) to your cart!
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    addToCart(product, activeWeight, quantity);
                    setIsCartOpen(true);
                    setAddedNotice(true);
                    setTimeout(() => setAddedNotice(false), 3000);
                  }}
                  className="flex-1 py-3.5 rounded-xl font-sans text-sm font-extrabold uppercase tracking-wider bg-[#111111] text-white hover:bg-black transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 border border-gray-800"
                >
                  <ShoppingBag size={16} /> ADD TO CART
                </button>
                <button
                  onClick={() => {
                    addToCart(product, activeWeight, quantity);
                    window.location.href = "/checkout";
                  }}
                  className="flex-1 py-3.5 rounded-xl font-sans text-sm font-extrabold uppercase tracking-wider text-[#0D0D0D] hover:opacity-90 transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
                  style={{ background: goldGrad }}
                >
                  BUY NOW
                </button>
              </div>

              <div className="bg-[#F8F8F8] rounded-xl p-4 grid grid-cols-3 gap-3 border border-gray-100">
                {[{ icon: Package, text: "COD Available" }, { icon: Truck, text: "1–3 Day Delivery" }, { icon: Shield, text: "7-Day Return" }].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex flex-col items-center gap-1 text-center">
                    <Icon size={18} className="text-[#C9A84C]" />
                    <span className="text-[10px] font-semibold text-gray-600">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-sans text-xl font-extrabold text-gray-900 uppercase tracking-wide">Related Products</h2>
              <Link href="/" className="text-xs font-bold uppercase tracking-wider flex items-center gap-1" style={goldText}>
                View All <ChevronRight size={13} className="text-[#C9A84C]" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      <a href={BRAND.contact.whatsappBase} target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
        style={{ background: "#25D366", boxShadow: "0 4px 20px rgba(37,211,102,0.4)" }} aria-label="Live Chat">
        <WhatsAppIcon size={28} />
      </a>
    </div>
  );
}
