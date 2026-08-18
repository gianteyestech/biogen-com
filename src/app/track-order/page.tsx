"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Package, CheckCircle2, AlertCircle, Loader2, ShieldCheck } from "lucide-react";

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
        throw new Error(data.error || "Medical Requisition order not found");
      }

      setOrder(data.order);
    } catch (err: unknown) {
      setOrder(null);
      setError(err instanceof Error ? err.message : "Failed to load requisition status");
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
        return <span className="px-3 py-1 bg-blue-100 text-[#0072CE] font-bold text-xs rounded-full">Confirmed &amp; Allocated</span>;
      case "shipped":
        return <span className="px-3 py-1 bg-purple-100 text-purple-800 font-bold text-xs rounded-full">In Transit (Cold-Chain)</span>;
      case "delivered":
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">Delivered to Facility 🎉</span>;
      case "cancelled":
        return <span className="px-3 py-1 bg-red-100 text-red-800 font-bold text-xs rounded-full">Cancelled</span>;
      default:
        return <span className="px-3 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded-full">Under Verification</span>;
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-50 text-[#0072CE] rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-blue-100">
            <Package size={24} />
          </div>
          <span className="text-[11px] font-bold text-[#0072CE] uppercase tracking-wider">Biogen Pharma Logistics</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Track Medical Requisition</h1>
          <p className="text-xs text-slate-500">Enter your Requisition ID (e.g. BGP-847291) to check dispatch and delivery status</p>
        </div>

        {/* Search Card */}
        <form onSubmit={handleSearch} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Requisition Order ID *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. BGP-847291"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0072CE] outline-none text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Institutional Contact Phone (Optional Verification)
            </label>
            <input
              type="tel"
              placeholder="+220 / +232 ..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0072CE] outline-none text-xs text-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0072CE] hover:bg-[#005EA6] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 active:scale-98"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            Track Requisition
          </button>
        </form>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-3">
            <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Order Details Display */}
        {order && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Requisition Number</span>
                <h3 className="text-lg font-bold text-slate-900">#{order.order_number}</h3>
              </div>
              <div>{getStatusBadge(order.status)}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Facility / Recipient:</span>
                <p className="font-bold text-slate-800 mt-0.5">{order.customer_name}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Destination Region:</span>
                <p className="font-bold text-slate-800 mt-0.5">{order.city}</p>
              </div>
            </div>

            {/* Items List */}
            <div className="border-t border-slate-100 pt-4 space-y-2">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Consigned Medical Items</p>
              {order.items &&
                order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-1">
                    <span className="font-semibold text-slate-800">
                      {item.product_name} ({item.weight}) × {item.quantity}
                    </span>
                    <span className="font-bold text-slate-900">${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              <div className="flex justify-between items-center text-sm font-extrabold text-slate-900 pt-3 border-t border-slate-100">
                <span>Total Amount:</span>
                <span className="text-[#0072CE]">${order.total_amount?.toLocaleString()}</span>
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
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center"><Loader2 size={32} className="animate-spin text-[#0072CE]" /></div>}>
      <OrderTrackerContent />
    </Suspense>
  );
}
