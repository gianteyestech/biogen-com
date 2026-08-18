import { type ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import NotificationSystem from "@/components/admin/NotificationSystem";

export const metadata = {
  title: "CMS Admin — Biogen Pharma",
  robots: "noindex,nofollow",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0F1D] flex flex-col lg:flex-row font-sans antialiased text-slate-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 pt-16 lg:pt-0">
        {/* Admin Topbar Header */}
        <header className="h-16 border-b border-slate-800 bg-[#0E1526] px-4 sm:px-8 flex items-center justify-between sticky top-16 lg:top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">
              Biogen Medical Network Active
            </span>
          </div>
          <div className="flex items-center gap-4">
            <NotificationSystem />
          </div>
        </header>
        <main className="flex-1 min-w-0 overflow-y-auto bg-[#070B14]">
          {children}
        </main>
      </div>
    </div>
  );
}
