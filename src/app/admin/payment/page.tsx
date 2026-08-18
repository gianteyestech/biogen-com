"use client";
import { useState, useTransition, useEffect } from "react";
import type { CMSSiteConfig, CMSPaymentMethod, CMSPaymentDetail } from "@/lib/cms-types";
import { actionUpdateSiteConfig, actionGetSiteConfig } from "../actions";
import { Save, Check, Plus, Trash2, CreditCard, Eye, Info, ShieldCheck } from "lucide-react";

const METHOD_META: Record<string, { bg: string; border: string; badge: string }> = {
  cod:           { bg: "#10b98115", border: "#10b98140", badge: "#10b981" },
  bank_transfer: { bg: "#0072ce15", border: "#0072ce40", badge: "#0072ce" },
  jazzcash:      { bg: "#00a3e015", border: "#00a3e040", badge: "#00a3e0" },
  easypaisa:     { bg: "#8b5cf615", border: "#8b5cf640", badge: "#8b5cf6" },
};

export default function AdminPaymentPage() {
  const [config, setConfig] = useState<CMSSiteConfig | null>(null);
  const [pending, startT] = useTransition();
  const [msg, setMsg] = useState("");

  useEffect(() => { actionGetSiteConfig().then(setConfig); }, []);

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const save = () => {
    if (!config) return;
    startT(async () => {
      await actionUpdateSiteConfig(config);
      flash("Settlement and payment channels saved!");
    });
  };

  const updateMethod = (id: string, patch: Partial<CMSPaymentMethod>) => {
    if (!config) return;
    setConfig({
      ...config,
      paymentMethods: config.paymentMethods.map((m) =>
        m.id === id ? { ...m, ...patch } : m
      ),
    });
  };

  const updateDetail = (methodId: string, idx: number, patch: Partial<CMSPaymentDetail>) => {
    if (!config) return;
    setConfig({
      ...config,
      paymentMethods: config.paymentMethods.map((m) => {
        if (m.id !== methodId) return m;
        const details = m.details.map((d, i) => (i === idx ? { ...d, ...patch } : d));
        return { ...m, details };
      }),
    });
  };

  const addDetail = (methodId: string) => {
    if (!config) return;
    setConfig({
      ...config,
      paymentMethods: config.paymentMethods.map((m) =>
        m.id === methodId
          ? { ...m, details: [...m.details, { label: "", value: "" }] }
          : m
      ),
    });
  };

  const removeDetail = (methodId: string, idx: number) => {
    if (!config) return;
    setConfig({
      ...config,
      paymentMethods: config.paymentMethods.map((m) =>
        m.id === methodId
          ? { ...m, details: m.details.filter((_, i) => i !== idx) }
          : m
      ),
    });
  };

  if (!config) return (
    <div className="p-8 flex items-center justify-center min-h-[300px]">
      <div className="w-8 h-8 border-2 border-blue-500/20 border-t-[#0072CE] rounded-full animate-spin" />
    </div>
  );

  const methods = config.paymentMethods ?? [];

  const inputCls = "w-full px-3 py-2 bg-[#070B14] border border-slate-700 rounded-lg text-white text-xs outline-none focus:border-[#0072CE] transition-all placeholder-slate-500";
  const labelCls = "block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto font-sans antialiased text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-[11px] font-bold text-[#00A3E0] uppercase tracking-wider">Financial Clearance</span>
          <h1 className="text-2xl font-black text-white flex items-center gap-2 mt-0.5">
            <CreditCard size={22} className="text-[#00A3E0]" />
            Settlement &amp; Payment Gateways
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">Enable, disable, and configure institutional and clinical settlement options</p>
        </div>
        <button
          onClick={save}
          disabled={pending}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0072CE] hover:bg-[#005EA6] disabled:opacity-60 transition-colors shadow-sm uppercase tracking-wider"
        >
          {pending
            ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            : <Save size={15} />}
          Save Methods
        </button>
      </div>

      {msg && (
        <div className="mb-5 bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2">
          <Check size={14} /> {msg}
        </div>
      )}

      {/* Info banner */}
      <div className="mb-6 bg-blue-500/10 border border-blue-500/30 rounded-xl px-4 py-3 flex gap-2 text-xs text-[#00A3E0]">
        <Info size={14} className="flex-shrink-0 mt-0.5" />
        <span>
          Enabled methods appear in clinical requisition checkout. Institutional customers will see them during checkout and in automated confirmation receipts.
        </span>
      </div>

      {/* Method cards */}
      <div className="space-y-5">
        {methods.map((method) => {
          const meta = METHOD_META[method.id] ?? { bg: "#ffffff10", border: "#ffffff20", badge: "#0072CE" };
          return (
            <div
              key={method.id}
              className="rounded-2xl border transition-all"
              style={{
                background: method.enabled ? meta.bg : "#0E1526",
                borderColor: method.enabled ? meta.border : "#1E293B",
              }}
            >
              {/* Card header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{method.icon}</span>
                  <div>
                    <p className="text-white font-bold text-sm">{method.label}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{method.description}</p>
                  </div>
                  {method.enabled && (
                    <span
                      className="ml-2 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{ background: `${meta.badge}25`, color: meta.badge }}
                    >
                      ACTIVE
                    </span>
                  )}
                </div>

                {/* Toggle */}
                <button
                  onClick={() => updateMethod(method.id, { enabled: !method.enabled })}
                  className={`relative w-12 h-6 rounded-full transition-all flex-shrink-0 ${
                    method.enabled ? "bg-[#0072CE]" : "bg-slate-700"
                  }`}
                  title={method.enabled ? "Disable" : "Enable"}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                      method.enabled ? "left-7" : "left-1"
                    }`}
                  />
                  <span className="sr-only">{method.enabled ? "Disable" : "Enable"}</span>
                </button>
              </div>

              {/* Editable fields */}
              <div className="px-5 py-4 space-y-4">
                {/* Label & icon row */}
                <div className="grid grid-cols-[1fr_auto] gap-3">
                  <div>
                    <label className={labelCls}>Display Label</label>
                    <input
                      className={inputCls}
                      value={method.label}
                      onChange={(e) => updateMethod(method.id, { label: e.target.value })}
                      placeholder="e.g. Hospital Invoice / Net 30"
                    />
                  </div>
                  <div className="w-20">
                    <label className={labelCls}>Icon (Emoji)</label>
                    <input
                      className={`${inputCls} text-center text-xl`}
                      value={method.icon}
                      onChange={(e) => updateMethod(method.id, { icon: e.target.value })}
                      placeholder="💵"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Description</label>
                  <input
                    className={inputCls}
                    value={method.description}
                    onChange={(e) => updateMethod(method.id, { description: e.target.value })}
                    placeholder="e.g. Official bank transfer with invoice dispatch"
                  />
                </div>

                {/* Details rows */}
                {method.details.length > 0 && (
                  <div>
                    <label className={labelCls}>Account / Beneficiary Credentials</label>
                    <div className="space-y-2">
                      {method.details.map((detail, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            className={`${inputCls} flex-[0.45]`}
                            value={detail.label}
                            onChange={(e) => updateDetail(method.id, idx, { label: e.target.value })}
                            placeholder="Field name (e.g. IBAN / SWIFT)"
                          />
                          <input
                            className={`${inputCls} flex-1`}
                            value={detail.value}
                            onChange={(e) => updateDetail(method.id, idx, { value: e.target.value })}
                            placeholder="Account Value"
                          />
                          <button
                            onClick={() => removeDetail(method.id, idx)}
                            className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-950/30 transition-all flex-shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {method.id !== "cod" && (
                  <button
                    onClick={() => addDetail(method.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#00A3E0] hover:underline"
                  >
                    <Plus size={13} />
                    Add Beneficiary Row
                  </button>
                )}

                {method.id === "cod" && (
                  <p className="text-xs text-slate-500 italic">
                    Pay on Delivery requires no account details — verified at medical facility receipt.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview section */}
      <div className="mt-8 bg-[#0E1526] border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Eye size={14} className="text-[#00A3E0]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-white">Practitioner Checkout Preview</h2>
          <span className="text-[10px] text-slate-500">— displayed to clinics and procurement officers</span>
        </div>
        <div className="space-y-2">
          {methods.filter((m) => m.enabled).length === 0 ? (
            <p className="text-xs text-red-400">⚠ No settlement methods active — practitioners will not be able to submit requisitions!</p>
          ) : (
            methods
              .filter((m) => m.enabled)
              .map((m) => (
                <div key={m.id} className="flex items-center gap-3 bg-[#070B14] border border-slate-800 rounded-xl px-4 py-3">
                  <span className="text-lg">{m.icon}</span>
                  <div>
                    <p className="text-white text-xs font-semibold">{m.label}</p>
                    <p className="text-slate-400 text-[11px]">{m.description}</p>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
