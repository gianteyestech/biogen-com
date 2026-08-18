"use client";

import React, { useState, useEffect } from "react";
import { Bell, CheckCircle2, AlertTriangle, Info, X, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

interface NotificationItem {
  id: string;
  type: "order" | "stock" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
}

export default function NotificationSystem() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [toast, setToast] = useState<NotificationItem | null>(null);

  // Check for orders & low stock alert
  useEffect(() => {
    async function checkNotifications() {
      try {
        const res = await fetch("/api/orders?status=pending");
        if (res.ok) {
          const data = await res.json();
          if (data.orders && data.orders.length > 0) {
            const pendingOrders: NotificationItem[] = data.orders.slice(0, 5).map((o: any) => ({
              id: `order-${o.id}`,
              type: "order",
              title: "New Requisition Received!",
              message: `Order #${o.order_number} by ${o.customer_name} ($${o.total_amount?.toLocaleString()})`,
              time: "Just now",
              read: false,
              link: "/admin/orders",
            }));

            setNotifications((prev) => {
              const existingIds = new Set(prev.map((n) => n.id));
              const newItems = pendingOrders.filter((n) => !existingIds.has(n.id));
              if (newItems.length > 0 && !toast) {
                setToast(newItems[0]);
              }
              return [...newItems, ...prev];
            });
          }
        }
      } catch (e) {
        console.error("Failed to check order notifications:", e);
      }
    }

    checkNotifications();
    const interval = setInterval(checkNotifications, 15000); // Check every 15s
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative z-50">
      {/* Bell Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) markAllRead();
        }}
        className="relative p-2.5 rounded-xl bg-[#131D31] border border-slate-700 text-slate-300 hover:text-[#00A3E0] hover:border-[#0072CE]/60 transition-all duration-200"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#0072CE] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow-md">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Floating Notification Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#0E1526] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 text-white">
          <div className="px-4 py-3.5 border-b border-slate-800 flex items-center justify-between bg-[#0A0F1D]">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-[#00A3E0]" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Clinical Notifications
              </span>
            </div>
            {notifications.length > 0 && (
              <button
                onClick={markAllRead}
                className="text-[10px] font-bold text-[#00A3E0] hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[350px] overflow-y-auto divide-y divide-slate-800/80">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Info size={24} className="mx-auto mb-2 opacity-40 text-[#00A3E0]" />
                <p className="text-xs font-semibold">No new requisitions or alerts</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Everything is operating normally</p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 flex gap-3 items-start transition-colors ${
                    !item.read ? "bg-blue-500/10" : "hover:bg-slate-800/50"
                  }`}
                >
                  <div className="p-2 rounded-lg bg-blue-500/20 text-[#00A3E0] flex-shrink-0 mt-0.5">
                    <ShoppingBag size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-white leading-tight">{item.title}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{item.time}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-snug">{item.message}</p>
                    {item.link && (
                      <Link
                        href={item.link}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-[#00A3E0] hover:underline mt-2"
                      >
                        View Requisitions <ArrowRight size={10} />
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Floating Audio Toast Notification Popup */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A0F1D] border border-[#0072CE] text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 max-w-md">
          <div className="p-2.5 rounded-xl bg-blue-500/20 text-[#00A3E0]">
            <ShoppingBag size={20} />
          </div>
          <div className="flex-1 min-w-0 pr-2">
            <p className="text-xs font-black text-[#00A3E0] uppercase tracking-wider">{toast.title}</p>
            <p className="text-xs text-slate-200 mt-0.5 line-clamp-1">{toast.message}</p>
          </div>
          {toast.link && (
            <Link
              href={toast.link}
              onClick={() => setToast(null)}
              className="px-3 py-1.5 bg-[#0072CE] text-white text-xs font-bold rounded-lg hover:bg-[#005EA6] transition-colors flex-shrink-0"
            >
              Review
            </Link>
          )}
          <button
            onClick={() => setToast(null)}
            className="p-1 text-slate-400 hover:text-white rounded-lg"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
