"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminLogout } from "./actions";
import BiogenLogo from "@/components/BiogenLogo";
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
  ShieldCheck,
  FileText,
  Users,
} from "lucide-react";

const brandGrad = "linear-gradient(135deg, #00A3E0 0%, #0072CE 100%)";

const NAV = [
  { href: "/admin",          label: "Dashboard",       icon: LayoutDashboard },
  { href: "/admin/orders",    label: "Requisitions",   icon: ShoppingBag },
  { href: "/admin/live-chat", label: "Clinical Support", icon: MessageSquare },
  { href: "/admin/products", label: "Medical Catalog", icon: Package },
  { href: "/admin/categories",label: "Departments",    icon: Tag },
  { href: "/admin/hero",     label: "Hero Slides",    icon: ImagePlay },
  { href: "/admin/sections", label: "Page Sections",  icon: Layout },
  { href: "/admin/brand-partners", label: "Brand Partners", icon: Users },
  { href: "/admin/about",    label: "About Content",  icon: FileText },
  { href: "/admin/policies", label: "Policies",       icon: FileText },
  { href: "/admin/payment",  label: "Settlement Methods", icon: CreditCard },
  { href: "/admin/site",     label: "Facility Config", icon: Settings },
  { href: "/admin/activity-logs", label: "Audit Logs", icon: History },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Toggle Bar (visible on sm/md screens) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0A0F1D] border-b border-slate-800 px-4 flex items-center justify-between z-50">
        <BiogenLogo variant="dark" size="sm" showSubtitle={false} />
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-slate-300 hover:text-white bg-slate-800 border border-slate-700 rounded-xl"
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
        className={`w-[260px] flex-shrink-0 flex flex-col border-r border-slate-800/80 min-h-screen bg-[#0A0F1D] fixed lg:sticky top-0 left-0 bottom-0 z-50 transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo Header */}
        <div className="px-5 py-5 border-b border-slate-800/80 flex items-center justify-between">
          <BiogenLogo variant="dark" size="md" />
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white"
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
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? "text-white shadow-md shadow-blue-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
                style={active ? { background: brandGrad } : {}}
              >
                <Icon size={16} className={active ? "text-white" : ""} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-6 border-t border-slate-800/80 pt-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all mb-1"
          >
            <Layout size={16} />
            View Storefront
          </a>
          <form action={adminLogout}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-all"
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
