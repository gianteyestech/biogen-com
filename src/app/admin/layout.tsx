import { type ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import NotificationSystem from "@/components/admin/NotificationSystem";

export const metadata = {
  title: "CMS Admin — Ideal Dry Fruit",
  robots: "noindex,nofollow",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col lg:flex-row">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 pt-16 lg:pt-0">
        {/* Admin Topbar Header */}
        <header className="h-16 border-b border-[#C9A84C]/10 bg-[#111111] px-4 sm:px-8 flex items-center justify-between sticky top-16 lg:top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">
              Storefront System Live
            </span>
          </div>
          <div className="flex items-center gap-4">
            <NotificationSystem />
          </div>
        </header>
        <main className="flex-1 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

