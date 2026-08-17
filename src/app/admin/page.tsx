import Link from "next/link";
import { getCMSProducts, getCMSCategories, getCMSHeroSlides, getCMSPagesConfig } from "@/lib/cms";
import { Package, Tag, ImagePlay, Layout, TrendingUp, AlertCircle, Star, BarChart3 } from "lucide-react";

const goldGrad = "linear-gradient(135deg, #F0C040 0%, #C9A84C 55%, #B8922B 100%)";
const goldText: React.CSSProperties = {
  background: goldGrad,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [products, categories, slides, pages] = await Promise.all([
    getCMSProducts(),
    getCMSCategories(),
    getCMSHeroSlides(),
    getCMSPagesConfig(),
  ]);

  const totalProducts = products.length;
  const inStockCount = products.filter((p) => p.inStock).length;
  const outOfStockCount = totalProducts - inStockCount;
  const featuredCount = products.filter((p) => p.featured).length;
  const newCount = products.filter((p) => p.isNew).length;
  const avgRating = products.length
    ? (products.reduce((s, p) => s + p.rating, 0) / products.length).toFixed(1)
    : "0";
  const totalReviews = products.reduce((s, p) => s + p.reviewsCount, 0);
  const totalCategories = categories.categories.length - 1; // minus "all"

  const stats = [
    { label: "Total Products", value: totalProducts, icon: Package, color: "#C9A84C", href: "/admin/products" },
    { label: "Categories", value: totalCategories, icon: Tag, color: "#3b82f6", href: "/admin/categories" },
    { label: "Hero Slides", value: slides.length, icon: ImagePlay, color: "#8b5cf6", href: "/admin/hero" },
    { label: "Page Sections", value: pages.sections.filter(s => s.visible).length, icon: Layout, color: "#10b981", href: "/admin/sections" },
  ];

  const quickStats = [
    { label: "In Stock", value: inStockCount, color: "#10b981" },
    { label: "Out of Stock", value: outOfStockCount, color: "#ef4444" },
    { label: "Featured", value: featuredCount, color: "#C9A84C" },
    { label: "New Arrivals", value: newCount, color: "#3b82f6" },
  ];

  const topProducts = [...products]
    .sort((a, b) => b.reviewsCount - a.reviewsCount)
    .slice(0, 5);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] w-full mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1 text-xs sm:text-sm">Welcome to the Ideal Dry Fruit CMS</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
        {stats.map(({ label, value, icon: Icon, color, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-[#181818] border border-[#C9A84C]/10 rounded-2xl p-4 sm:p-5 hover:border-[#C9A84C]/30 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <span className="text-xs text-gray-600 group-hover:text-[#C9A84C] transition-colors font-semibold">MANAGE →</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">{value}</p>
            <p className="text-xs text-gray-400 mt-1 font-semibold uppercase tracking-wider">{label}</p>
          </Link>
        ))}
      </div>

      {/* Secondary stats + reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6 sm:mb-8">
        {/* Inventory breakdown */}
        <div className="bg-[#181818] border border-[#C9A84C]/10 rounded-2xl p-4 sm:p-5 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={16} className="text-[#C9A84C]" />
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">Inventory Breakdown</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickStats.map(({ label, value, color }) => (
              <div key={label} className="bg-[#111] rounded-xl p-3 sm:p-4 text-center border border-white/5">
                <p className="text-xl sm:text-2xl font-black" style={{ color }}>{value}</p>
                <p className="text-[10px] text-gray-500 mt-1 font-semibold uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ratings */}
        <div className="bg-[#181818] border border-[#C9A84C]/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <Star size={16} className="text-[#C9A84C]" />
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">Reviews</h2>
          </div>
          <div className="text-center py-2">
            <p className="text-4xl sm:text-5xl font-black" style={goldText}>{avgRating}</p>
            <p className="text-xs text-gray-400 mt-1">Average Rating</p>
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-xl sm:text-2xl font-black text-white">{totalReviews.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">Total Reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Products */}
        <div className="bg-[#181818] border border-[#C9A84C]/10 rounded-2xl p-4 sm:p-5 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-[#C9A84C]" />
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">Top Products by Reviews</h2>
          </div>
          <div className="space-y-2">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#111] border border-white/5">
                <span className="text-xs font-black text-gray-600 w-5 text-center">{i + 1}</span>
                <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-gray-800" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                  <p className="text-[10px] text-gray-500">{p.reviewsCount} reviews · ★ {p.rating}</p>
                </div>
                <Link
                  href={`/admin/products?edit=${p.id}`}
                  className="text-[10px] font-bold text-[#C9A84C] hover:underline flex-shrink-0"
                >
                  EDIT
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts & Quick Actions */}
        <div className="bg-[#181818] border border-[#C9A84C]/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={16} className="text-[#C9A84C]" />
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">Alerts</h2>
          </div>
          <div className="space-y-3">
            {outOfStockCount > 0 && (
              <div className="bg-red-950/30 border border-red-500/20 rounded-xl p-3">
                <p className="text-xs font-bold text-red-400">{outOfStockCount} products out of stock</p>
                <Link href="/admin/products" className="text-[10px] text-red-400/70 hover:text-red-400 underline mt-1 block">
                  Manage inventory →
                </Link>
              </div>
            )}
            {outOfStockCount === 0 && (
              <div className="bg-green-950/30 border border-green-500/20 rounded-xl p-3">
                <p className="text-xs font-bold text-green-400">All products in stock ✓</p>
              </div>
            )}
            <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-xl p-3">
              <p className="text-xs font-bold text-[#C9A84C]">Quick Actions</p>
              <div className="mt-2 space-y-1">
                <Link href="/admin/products" className="block text-[10px] text-gray-400 hover:text-[#C9A84C] transition-colors">
                  + Add new product
                </Link>
                <Link href="/admin/hero" className="block text-[10px] text-gray-400 hover:text-[#C9A84C] transition-colors">
                  + Add hero slide
                </Link>
                <Link href="/admin/site" className="block text-[10px] text-gray-400 hover:text-[#C9A84C] transition-colors">
                  ✎ Edit site config
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
