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
        return "bg-blue-500/10 text-[#00A3E0] border-blue-500/30";
      case "DELETE":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      default:
        return "bg-slate-700/50 text-slate-400 border-slate-700";
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans antialiased text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0E1526] border border-slate-800 p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-[#00A3E0]">
              <History size={22} />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#00A3E0] uppercase tracking-wider">Compliance Audit Trail</span>
              <h1 className="text-xl font-bold text-white tracking-wide mt-0.5">CMS Activity &amp; Governance Logs</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Cryptographic audit trail of changes made to formulations, supplies, facility configurations &amp; media.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={loadLogs}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0072CE] text-white font-semibold text-xs hover:bg-[#005EA6] transition-all disabled:opacity-50 shadow-xs"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh Logs
        </button>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search details or entity ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0E1526] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0072CE]"
          />
        </div>

        {/* Action Filter */}
        <div className="relative">
          <Filter size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0E1526] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0072CE] appearance-none"
          >
            <option value="ALL">All Actions (CREATE, UPDATE, DELETE)</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>

        {/* Entity Filter */}
        <div className="relative">
          <ShieldCheck size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0E1526] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0072CE] appearance-none"
          >
            <option value="ALL">All Entities (Product, Category, Config...)</option>
            <option value="Product">Medical Products</option>
            <option value="Category">Departments</option>
            <option value="HeroSlide">Hero Slides</option>
            <option value="PaymentMethod">Settlement Methods</option>
            <option value="SiteConfig">Facility Config</option>
            <option value="PagesConfig">Page Layouts</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[#0E1526] border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-3">
            <RefreshCw size={24} className="animate-spin text-[#00A3E0]" />
            Loading audit logs...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No activity logs found matching current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0A0F1D] text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Entity</th>
                  <th className="py-3.5 px-4">Details</th>
                  <th className="py-3.5 px-4">Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
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
                    <td className="py-3.5 px-4 text-slate-300 max-w-md truncate">
                      {log.details}
                      <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                        ID: {log.entityId}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-400">
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px]">
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
