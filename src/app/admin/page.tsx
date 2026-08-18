import Link from "next/link";
import { getCMSProducts, getCMSCategories, getCMSHeroSlides, getCMSPagesConfig } from "@/lib/cms";
import { Package, Tag, ImagePlay, Layout, TrendingUp, AlertCircle, Star, BarChart3, ShieldCheck } from "lucide-react";

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
    { label: "Medical Supplies", value: totalProducts, icon: Package, color: "#0072CE", href: "/admin/products" },
    { label: "Departments", value: totalCategories, icon: Tag, color: "#00A3E0", href: "/admin/categories" },
    { label: "Hero Banners", value: slides.length, icon: ImagePlay, color: "#8b5cf6", href: "/admin/hero" },
    { label: "Page Sections", value: pages.sections.filter(s => s.visible).length, icon: Layout, color: "#10b981", href: "/admin/sections" },
  ];

  const quickStats = [
    { label: "Active Stock", value: inStockCount, color: "#10b981" },
    { label: "Reorder Needed", value: outOfStockCount, color: "#ef4444" },
    { label: "Spotlight Items", value: featuredCount, color: "#0072CE" },
    { label: "New Formulations", value: newCount, color: "#00A3E0" },
  ];

  const topProducts = [...products]
    .sort((a, b) => b.reviewsCount - a.reviewsCount)
    .slice(0, 5);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] w-full mx-auto font-sans antialiased text-white">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-[#00A3E0] uppercase tracking-wider">Executive Overview</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">Biogen Pharma Clinical CMS</h1>
          <p className="text-slate-400 mt-1 text-xs sm:text-sm">Manage certified pharmaceutical inventory, hospital requisitions, and clinical content</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#00A3E0]">
          <ShieldCheck size={16} /> GMP Certified System
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
        {stats.map(({ label, value, icon: Icon, color, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-[#0E1526] border border-slate-800 rounded-2xl p-4 sm:p-5 hover:border-[#0072CE]/60 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <span className="text-xs text-slate-500 group-hover:text-[#00A3E0] transition-colors font-semibold">MANAGE →</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">{value}</p>
            <p className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">{label}</p>
          </Link>
        ))}
      </div>

      {/* Secondary stats + reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6 sm:mb-8">
        {/* Inventory breakdown */}
        <div className="bg-[#0E1526] border border-slate-800 rounded-2xl p-4 sm:p-5 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={16} className="text-[#00A3E0]" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Catalog Allocation Breakdown</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickStats.map(({ label, value, color }) => (
              <div key={label} className="bg-[#070B14] rounded-xl p-3 sm:p-4 text-center border border-slate-800">
                <p className="text-xl sm:text-2xl font-black" style={{ color }}>{value}</p>
                <p className="text-[10px] text-slate-400 mt-1 font-semibold uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ratings */}
        <div className="bg-[#0E1526] border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <Star size={16} className="text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Clinical Satisfaction</h2>
          </div>
          <div className="text-center py-2">
            <p className="text-4xl sm:text-5xl font-black text-[#00A3E0]">{avgRating}</p>
            <p className="text-xs text-slate-400 mt-1">Average Practitioner Rating</p>
            <div className="mt-4 pt-4 border-t border-slate-800">
              <p className="text-xl sm:text-2xl font-black text-white">{totalReviews.toLocaleString()}</p>
              <p className="text-xs text-slate-400 mt-1">Verified Feedback Submissions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Products */}
        <div className="bg-[#0E1526] border border-slate-800 rounded-2xl p-4 sm:p-5 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-[#00A3E0]" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Top Requisitioned Medical Supplies</h2>
          </div>
          <div className="space-y-2">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#070B14] border border-slate-800">
                <span className="text-xs font-black text-slate-500 w-5 text-center">{i + 1}</span>
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white p-1">
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                  <p className="text-[10px] text-slate-400">{p.reviewsCount} reviews · ★ {p.rating}</p>
                </div>
                <Link
                  href={`/admin/products?edit=${p.id}`}
                  className="text-[10px] font-bold text-[#00A3E0] hover:underline flex-shrink-0"
                >
                  EDIT
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts & Quick Actions */}
        <div className="bg-[#0E1526] border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={16} className="text-[#00A3E0]" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Alerts &amp; Dispatch</h2>
          </div>
          <div className="space-y-3">
            {outOfStockCount > 0 && (
              <div className="bg-red-950/30 border border-red-500/20 rounded-xl p-3">
                <p className="text-xs font-bold text-red-400">{outOfStockCount} supplies require inventory restock</p>
                <Link href="/admin/products" className="text-[10px] text-red-400/70 hover:text-red-400 underline mt-1 block">
                  Manage medical inventory →
                </Link>
              </div>
            )}
            {outOfStockCount === 0 && (
              <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-3">
                <p className="text-xs font-bold text-emerald-400">All catalog items active &amp; in stock ✓</p>
              </div>
            )}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
              <p className="text-xs font-bold text-[#00A3E0]">Quick Management</p>
              <div className="mt-2 space-y-1.5">
                <Link href="/admin/products" className="block text-[11px] text-slate-300 hover:text-[#00A3E0] transition-colors">
                  + Add Medical Formulation / Supply
                </Link>
                <Link href="/admin/hero" className="block text-[11px] text-slate-300 hover:text-[#00A3E0] transition-colors">
                  + Add Hero Carousel Slide
                </Link>
                <Link href="/admin/site" className="block text-[11px] text-slate-300 hover:text-[#00A3E0] transition-colors">
                  ✎ Update Facility Operational Parameters
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
