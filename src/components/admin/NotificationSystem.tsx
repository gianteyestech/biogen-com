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
              title: "New Order Received!",
              message: `Order #${o.order_number} by ${o.customer_name} (Rs. ${o.total_amount.toLocaleString()})`,
              time: "Just now",
              read: false,
              link: "/admin/orders",
            }));

            setNotifications((prev) => {
              const existingIds = new Set(prev.map((n) => n.id));
              const newItems = pendingOrders.filter((n) => !existingIds.has(n.id));
              if (newItems.length > 0 && !toast) {
                setToast(newItems[0]); // trigger audio/toast popup
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
        className="relative p-2.5 rounded-xl bg-[#181818] border border-gray-800 text-gray-300 hover:text-[#C9A84C] hover:border-[#C9A84C]/40 transition-all duration-200"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow-md">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Floating Notification Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#181818] border border-[#C9A84C]/20 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3.5 border-b border-gray-800 flex items-center justify-between bg-[#111]">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-[#C9A84C]" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Admin Notifications
              </span>
            </div>
            {notifications.length > 0 && (
              <button
                onClick={markAllRead}
                className="text-[10px] font-bold text-[#C9A84C] hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-800/60 scrollbar-none">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Info size={24} className="mx-auto mb-2 opacity-40 text-[#C9A84C]" />
                <p className="text-xs font-semibold">No new notifications</p>
                <p className="text-[10px] text-gray-600 mt-1">
                  You're all caught up with your orders & inventory!
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 transition-colors flex items-start gap-3 ${
                    !item.read ? "bg-[#C9A84C]/5" : "hover:bg-[#111]"
                  }`}
                >
                  <div className="p-2 rounded-lg bg-[#C9A84C]/10 text-[#C9A84C] flex-shrink-0 mt-0.5">
                    <ShoppingBag size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-white leading-tight">{item.title}</p>
                      <span className="text-[9px] text-gray-500 font-medium">{item.time}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 leading-snug">{item.message}</p>
                    {item.link && (
                      <Link
                        href={item.link}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-[#C9A84C] hover:underline mt-2"
                      >
                        <span>View Orders</span>
                        <ArrowRight size={10} />
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Floating Instant Toast Popup Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111111] border border-[#C9A84C] text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 max-w-md">
          <div className="p-2.5 rounded-xl bg-[#C9A84C]/20 text-[#C9A84C]">
            <ShoppingBag size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-[#C9A84C] uppercase tracking-wider">{toast.title}</p>
            <p className="text-xs text-gray-300 font-medium mt-0.5 truncate">{toast.message}</p>
          </div>
          <Link
            href="/admin/orders"
            onClick={() => setToast(null)}
            className="px-3 py-1.5 bg-[#C9A84C] text-black text-xs font-bold rounded-lg hover:bg-white transition-colors flex-shrink-0"
          >
            Manage
          </Link>
          <button
            onClick={() => setToast(null)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
