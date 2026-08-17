"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Package, Clock, Truck, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface OrderItem {
  product_name: string;
  weight: string;
  quantity: number;
  price: number;
}

interface OrderDetail {
  id: string;
  order_number: string;
  customer_name: string;
  city: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  total_amount: number;
  created_at: string;
  items: OrderItem[];
}

function OrderTrackerContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";

  const [orderId, setOrderId] = useState(initialId);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<OrderDetail | null>(null);

  const fetchOrder = async (searchId: string, searchPhone?: string) => {
    if (!searchId) return;
    setLoading(true);
    setError("");

    try {
      let url = `/api/orders/${encodeURIComponent(searchId)}`;
      if (searchPhone) url += `?phone=${encodeURIComponent(searchPhone)}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Order not found");
      }

      setOrder(data.order);
    } catch (err: unknown) {
      setOrder(null);
      setError(err instanceof Error ? err.message : "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      fetchOrder(initialId);
    }
  }, [initialId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderId, phone);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 font-bold text-xs rounded-full">Confirmed</span>;
      case "shipped":
        return <span className="px-3 py-1 bg-purple-100 text-purple-800 font-bold text-xs rounded-full">Dispatched / Shipped</span>;
      case "delivered":
        return <span className="px-3 py-1 bg-green-100 text-green-800 font-bold text-xs rounded-full">Delivered 🎉</span>;
      case "cancelled":
        return <span className="px-3 py-1 bg-red-100 text-red-800 font-bold text-xs rounded-full">Cancelled</span>;
      default:
        return <span className="px-3 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded-full">Pending Verification</span>;
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#FAF9F6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#0A0A0A] text-[#C9A84C] rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Package size={24} />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Track Your Order</h1>
          <p className="text-xs text-gray-500">Enter your Order ID (e.g. IDF-123456) to check current status</p>
        </div>

        {/* Search Card */}
        <form onSubmit={handleSearch} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Order ID / Number *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. IDF-847291"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C9A84C] outline-none text-sm text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Mobile Phone Number (Optional verification)
            </label>
            <input
              type="tel"
              placeholder="0300 1234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C9A84C] outline-none text-sm text-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#0A0A0A] text-[#C9A84C] font-bold rounded-xl text-sm hover:bg-black transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            Track Order
          </button>
        </form>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Order Details Display */}
        {order && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Order Number</span>
                <h3 className="text-lg font-bold text-gray-900">#{order.order_number}</h3>
              </div>
              <div>{getStatusBadge(order.status)}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 font-medium">Customer Name:</span>
                <p className="font-bold text-gray-800">{order.customer_name}</p>
              </div>
              <div>
                <span className="text-gray-400 font-medium">City:</span>
                <p className="font-bold text-gray-800">{order.city}</p>
              </div>
            </div>

            {/* Items List */}
            <div className="border-t border-gray-100 pt-4 space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order Items</p>
              {order.items &&
                order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-1">
                    <span className="font-semibold text-gray-800">
                      {item.product_name} ({item.weight}) x {item.quantity}
                    </span>
                    <span className="font-bold text-gray-900">Rs. {item.price * item.quantity}</span>
                  </div>
                ))}
              <div className="flex justify-between items-center text-sm font-extrabold text-gray-900 pt-3 border-t border-gray-100">
                <span>Total Amount:</span>
                <span className="text-[#C9A84C]">Rs. {order.total_amount}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center"><Loader2 size={32} className="animate-spin text-[#C9A84C]" /></div>}>
      <OrderTrackerContent />
    </Suspense>
  );
}
