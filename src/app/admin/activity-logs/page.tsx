"use client";

import { useEffect, useState } from "react";
import { actionGetActivityLogs } from "../actions";
import type { CMSActivityLog } from "@/lib/cms-types";
import { History, Search, RefreshCw, Filter, ShieldCheck } from "lucide-react";

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<CMSActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("ALL");
  const [entityFilter, setEntityFilter] = useState<string>("ALL");

  async function loadLogs() {
    setLoading(true);
    try {
      const data = await actionGetActivityLogs(200);
      setLogs(data);
    } catch (err) {
      console.error("Failed to load activity logs:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.entityId.toLowerCase().includes(search.toLowerCase()) ||
      (log.user && log.user.toLowerCase().includes(search.toLowerCase()));

    const matchesAction = actionFilter === "ALL" || log.action === actionFilter;
    const matchesEntity = entityFilter === "ALL" || log.entity === entityFilter;

    return matchesSearch && matchesAction && matchesEntity;
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case "CREATE":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "UPDATE":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "DELETE":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#18181b] border border-[#C9A84C]/20 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C]">
              <History size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">CMS Activity Logs</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Audit trail of changes made to products, categories, site configuration & media.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={loadLogs}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C9A84C] text-black font-semibold text-xs hover:bg-[#d8b555] transition-all disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh Logs
        </button>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search details or entity ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#18181b] border border-[#C9A84C]/20 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A84C]"
          />
        </div>

        {/* Action Filter */}
        <div className="relative">
          <Filter size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#18181b] border border-[#C9A84C]/20 rounded-xl text-xs text-white focus:outline-none focus:border-[#C9A84C] appearance-none"
          >
            <option value="ALL">All Actions (CREATE, UPDATE, DELETE)</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>

        {/* Entity Filter */}
        <div className="relative">
          <ShieldCheck size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#18181b] border border-[#C9A84C]/20 rounded-xl text-xs text-white focus:outline-none focus:border-[#C9A84C] appearance-none"
          >
            <option value="ALL">All Entities (Product, Category, Config...)</option>
            <option value="Product">Products</option>
            <option value="Category">Categories</option>
            <option value="HeroSlide">Hero Slides</option>
            <option value="PaymentMethod">Payment Methods</option>
            <option value="SiteConfig">Site Config</option>
            <option value="PagesConfig">Page Layouts</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[#18181b] border border-[#C9A84C]/20 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-xs flex flex-col items-center justify-center gap-3">
            <RefreshCw size={24} className="animate-spin text-[#C9A84C]" />
            Loading CMS audit logs...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-xs">
            No activity logs found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#C9A84C]/10 bg-black/40 text-gray-400 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Entity</th>
                  <th className="py-3.5 px-4">Details</th>
                  <th className="py-3.5 px-4">User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C9A84C]/10">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap text-gray-400 font-mono text-[11px]">
                      {new Date(log.timestamp).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold border ${getActionBadge(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-white font-medium">
                      {log.entity}
                    </td>
                    <td className="py-3.5 px-4 text-gray-300 max-w-md truncate">
                      {log.details}
                      <span className="block text-[10px] text-gray-500 font-mono mt-0.5">
                        ID: {log.entityId}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-gray-400">
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px]">
                        {log.user || "Admin"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
