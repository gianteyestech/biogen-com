"use client";

import { useState, useEffect } from "react";
import { Package, Search, Filter, RefreshCw, CheckCircle2, Clock, Truck, XCircle, ChevronDown, Printer, ShieldCheck } from "lucide-react";

interface OrderItem {
  id: number;
  product_name: string;
  weight: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  payment_method: string;
  total_amount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  created_at: string;
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?status=${filterStatus}`);
      const data = await res.json();
      if (res.ok && data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as Order["status"] } : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus as Order["status"] } : null));
        }
      }
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const term = searchTerm.toLowerCase();
    return (
      o.order_number.toLowerCase().includes(term) ||
      o.customer_name.toLowerCase().includes(term) ||
      o.customer_phone.toLowerCase().includes(term) ||
      o.city.toLowerCase().includes(term)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <span className="px-2.5 py-1 bg-blue-900/50 text-blue-400 font-bold text-[10px] rounded-full border border-blue-800">Confirmed</span>;
      case "shipped":
        return <span className="px-2.5 py-1 bg-purple-900/50 text-purple-400 font-bold text-[10px] rounded-full border border-purple-800">In Transit</span>;
      case "delivered":
        return <span className="px-2.5 py-1 bg-emerald-900/50 text-emerald-400 font-bold text-[10px] rounded-full border border-emerald-800">Delivered</span>;
      case "cancelled":
        return <span className="px-2.5 py-1 bg-red-900/50 text-red-400 font-bold text-[10px] rounded-full border border-red-800">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 bg-amber-900/50 text-amber-400 font-bold text-[10px] rounded-full border border-amber-800">Pending Review</span>;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans antialiased text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#00A3E0] uppercase tracking-wider">Requisition Desk</span>
          <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">Medical Requisitions &amp; Orders</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor and fulfill clinical orders, institutional dispatches, and cold-chain shipments
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 bg-[#131D31] hover:bg-[#1E2D4A] border border-slate-700 text-white rounded-xl text-xs font-semibold transition-colors self-start sm:self-auto shadow-xs"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh Data
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-[#0E1526] p-4 rounded-2xl border border-slate-800 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by Requisition #, Facility Name, Phone, City..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#070B14] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0072CE]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={16} className="text-slate-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#070B14] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#0072CE]"
          >
            <option value="all">All Dispatch Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">In Transit (Cold Chain)</option>
            <option value="delivered">Delivered to Facility</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#0E1526] rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0A0F1D] text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Requisition #</th>
                <th className="p-4">Facility / Customer</th>
                <th className="p-4">Medical Items</th>
                <th className="p-4">Total ($)</th>
                <th className="p-4">Settlement</th>
                <th className="p-4">Dispatch Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Loading medical requisitions...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No requisitions found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-slate-800/30 transition-colors cursor-pointer"
                  >
                    <td className="p-4 font-mono font-bold text-[#00A3E0]">#{order.order_number}</td>
                    <td className="p-4 space-y-0.5">
                      <p className="font-bold text-white">{order.customer_name}</p>
                      <p className="text-slate-400">{order.customer_phone}</p>
                      <p className="text-[11px] text-slate-500">{order.city}</p>
                    </td>
                    <td className="p-4 max-w-[200px]">
                      {order.items &&
                        order.items.map((item, idx) => (
                          <div key={idx} className="truncate text-slate-400">
                            {item.product_name} ({item.weight}) ×{item.quantity}
                          </div>
                        ))}
                    </td>
                    <td className="p-4 font-bold text-white">${order.total_amount?.toLocaleString()}</td>
                    <td className="p-4 uppercase text-[10px] font-bold text-slate-400">{order.payment_method}</td>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="bg-[#070B14] border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold text-white focus:outline-none focus:border-[#0072CE]"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">In Transit</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 rounded-lg bg-[#0072CE] text-white font-bold text-[11px] hover:bg-[#005EA6] transition-colors shadow-xs"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0E1526] border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs text-[#00A3E0] font-mono font-bold uppercase tracking-wider">
                  Requisition Invoice
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">#{selectedOrder.order_number}</h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10"
              >
                <XCircle size={20} />
              </button>
            </div>

            {/* Customer & Shipping Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#070B14] p-4 rounded-xl border border-slate-800">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Facility / Contact</p>
                <p className="text-sm font-bold text-white mt-0.5">{selectedOrder.customer_name}</p>
                <p className="text-xs text-slate-400 mt-1">{selectedOrder.customer_phone}</p>
                {selectedOrder.customer_email && (
                  <p className="text-xs text-slate-400">{selectedOrder.customer_email}</p>
                )}
              </div>

              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Dispatch Address</p>
                <p className="text-xs text-slate-300 mt-0.5 font-medium leading-relaxed">
                  {selectedOrder.shipping_address}
                </p>
                <p className="text-xs font-bold text-[#00A3E0] mt-1">{selectedOrder.city}</p>
              </div>
            </div>

            {/* Items Breakdown Table */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Consigned Items ({selectedOrder.items?.length || 0})
              </h3>
              <div className="bg-[#070B14] rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs divide-y divide-slate-800">
                  <thead className="bg-black/40 text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Specification</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {selectedOrder.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-semibold text-white">{item.product_name}</td>
                        <td className="p-3 text-slate-400">{item.weight}</td>
                        <td className="p-3 text-center font-bold">{item.quantity}</td>
                        <td className="p-3 text-right">${item.price?.toLocaleString()}</td>
                        <td className="p-3 text-right font-bold text-white">
                          ${(item.price * item.quantity).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#070B14] p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold uppercase">
                  Method: {selectedOrder.payment_method}
                </span>
                <span className="text-xs text-slate-400">
                  Date: {new Date(selectedOrder.created_at).toLocaleDateString("en-US", { dateStyle: "medium" })}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Total Amount</span>
                <span className="text-xl font-black text-[#0072CE]">
                  ${selectedOrder.total_amount?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                <Printer size={14} /> Print Clinical Invoice
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-[#0072CE] hover:bg-[#005EA6] text-white font-bold text-xs rounded-xl transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
