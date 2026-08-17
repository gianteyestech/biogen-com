"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminLogout } from "./actions";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  Tag,
  ImagePlay,
  Settings,
  Layout,
  LogOut,
  CreditCard,
  ShoppingBag,
  History,
  MessageSquare,
  Menu,
  X,
} from "lucide-react";

const goldGrad = "linear-gradient(135deg, #F0C040 0%, #C9A84C 55%, #B8922B 100%)";

const NAV = [
  { href: "/admin",          label: "Dashboard",       icon: LayoutDashboard },
  { href: "/admin/orders",    label: "Orders & Leads",  icon: ShoppingBag },
  { href: "/admin/live-chat", label: "Live Support",   icon: MessageSquare },
  { href: "/admin/products", label: "Products",        icon: Package },
  { href: "/admin/categories",label: "Categories",    icon: Tag },
  { href: "/admin/hero",     label: "Hero Slides",    icon: ImagePlay },
  { href: "/admin/sections", label: "Page Sections",  icon: Layout },
  { href: "/admin/payment",  label: "Payment Methods", icon: CreditCard },
  { href: "/admin/site",     label: "Site Config",    icon: Settings },
  { href: "/admin/activity-logs", label: "Activity Logs", icon: History },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Toggle Bar (visible on sm/md screens) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#111111] border-b border-[#C9A84C]/10 px-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg border border-[#C9A84C]/40 overflow-hidden flex-shrink-0 bg-black">
            <Image src="/ideal-logo.png" alt="Logo" width={32} height={32} className="object-cover" />
          </div>
          <span className="text-xs font-black text-white">IDEAL DRY FRUIT</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-gray-300 hover:text-white bg-[#1a1a1a] border border-[#C9A84C]/20 rounded-xl"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
        />
      )}

      {/* Sidebar Drawer Container */}
      <aside
        className={`w-[240px] flex-shrink-0 flex flex-col border-r border-[#C9A84C]/10 min-h-screen bg-[#111111] fixed lg:sticky top-0 left-0 bottom-0 z-50 transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="px-5 py-6 border-b border-[#C9A84C]/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl border border-[#C9A84C]/40 overflow-hidden flex-shrink-0 bg-black">
              <Image src="/ideal-logo.png" alt="Logo" width={40} height={40} className="object-cover" />
            </div>
            <div>
              <p className="text-xs font-black text-white leading-none">IDEAL DRY FRUIT</p>
              <p className="text-[10px] text-[#C9A84C] mt-0.5 font-semibold">CMS Admin</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-gray-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "text-[#0D0D0D] shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                style={active ? { background: goldGrad } : {}}
              >
                <Icon size={16} className={active ? "text-[#0D0D0D]" : ""} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-6 border-t border-[#C9A84C]/10 pt-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-all mb-1"
          >
            <Layout size={16} />
            View Storefront
          </a>
          <form action={adminLogout}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-all"
            >
              <LogOut size={16} />
              Logout
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}

