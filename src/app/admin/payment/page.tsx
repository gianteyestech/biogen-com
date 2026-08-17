"use client";
import { useState, useTransition, useEffect } from "react";
import type { CMSSiteConfig, CMSPaymentMethod, CMSPaymentDetail } from "@/lib/cms-types";
import { actionUpdateSiteConfig, actionGetSiteConfig } from "../actions";
import { Save, Check, Plus, Trash2, CreditCard, Eye, Info } from "lucide-react";

const goldGrad = "linear-gradient(135deg, #F0C040 0%, #C9A84C 55%, #B8922B 100%)";

const METHOD_META: Record<string, { bg: string; border: string; badge: string }> = {
  cod:           { bg: "#16a34a15", border: "#16a34a40", badge: "#16a34a" },
  bank_transfer: { bg: "#2563eb15", border: "#2563eb40", badge: "#2563eb" },
  jazzcash:      { bg: "#dc262615", border: "#dc262640", badge: "#dc2626" },
  easypaisa:     { bg: "#7c3aed15", border: "#7c3aed40", badge: "#7c3aed" },
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
      flash("Payment methods saved!");
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
      <div className="w-8 h-8 border-2 border-[#C9A84C]/20 border-t-[#C9A84C] rounded-full animate-spin" />
    </div>
  );

  const methods = config.paymentMethods ?? [];

  const inputCls = "w-full px-3 py-2 bg-[#111] border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-[#C9A84C] transition-all placeholder-gray-600";
  const labelCls = "block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5";

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <CreditCard size={22} className="text-[#C9A84C]" />
            Payment Methods
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">Enable, disable and configure how customers can pay</p>
        </div>
        <button
          onClick={save}
          disabled={pending}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-[#0D0D0D] disabled:opacity-60"
          style={{ background: goldGrad }}
        >
          {pending
            ? <span className="w-4 h-4 border-2 border-[#0D0D0D]/40 border-t-[#0D0D0D] rounded-full animate-spin" />
            : <Save size={15} />}
          Save Methods
        </button>
      </div>

      {msg && (
        <div className="mb-5 bg-green-950/50 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <Check size={14} /> {msg}
        </div>
      )}

      {/* Info banner */}
      <div className="mb-6 bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-xl px-4 py-3 flex gap-2 text-xs text-[#C9A84C]">
        <Info size={14} className="flex-shrink-0 mt-0.5" />
        <span>
          Enabled methods appear in the cart checkout flow. Customers will see them as options before sending their WhatsApp order. Account details are included in the WhatsApp message.
        </span>
      </div>

      {/* Method cards */}
      <div className="space-y-5">
        {methods.map((method) => {
          const meta = METHOD_META[method.id] ?? { bg: "#ffffff10", border: "#ffffff20", badge: "#C9A84C" };
          return (
            <div
              key={method.id}
              className="rounded-2xl border transition-all"
              style={{
                background: method.enabled ? meta.bg : "#181818",
                borderColor: method.enabled ? meta.border : "#C9A84C15",
              }}
            >
              {/* Card header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{method.icon}</span>
                  <div>
                    <p className="text-white font-bold text-sm">{method.label}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{method.description}</p>
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
                    method.enabled ? "bg-[#C9A84C]" : "bg-gray-700"
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
                      placeholder="e.g. Cash on Delivery (COD)"
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
                  <label className={labelCls}>Short Description</label>
                  <input
                    className={inputCls}
                    value={method.description}
                    onChange={(e) => updateMethod(method.id, { description: e.target.value })}
                    placeholder="e.g. Pay cash when your order arrives"
                  />
                </div>

                {/* Details rows */}
                {method.details.length > 0 && (
                  <div>
                    <label className={labelCls}>Account / Payment Details</label>
                    <div className="space-y-2">
                      {method.details.map((detail, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            className={`${inputCls} flex-[0.45]`}
                            value={detail.label}
                            onChange={(e) => updateDetail(method.id, idx, { label: e.target.value })}
                            placeholder="Field name (e.g. IBAN)"
                          />
                          <input
                            className={`${inputCls} flex-1`}
                            value={detail.value}
                            onChange={(e) => updateDetail(method.id, idx, { value: e.target.value })}
                            placeholder="Value"
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
                    className="flex items-center gap-1.5 text-xs font-bold text-[#C9A84C] hover:text-white transition-colors"
                  >
                    <Plus size={13} />
                    Add Detail Row
                  </button>
                )}

                {method.id === "cod" && (
                  <p className="text-xs text-gray-600 italic">
                    COD requires no account details — customer pays on delivery.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview section */}
      <div className="mt-8 bg-[#181818] border border-[#C9A84C]/10 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Eye size={14} className="text-[#C9A84C]" />
          <h2 className="text-xs font-black uppercase tracking-widest text-white">Customer Preview</h2>
          <span className="text-[10px] text-gray-500">— what customers see in the cart checkout</span>
        </div>
        <div className="space-y-2">
          {methods.filter((m) => m.enabled).length === 0 ? (
            <p className="text-xs text-red-400">⚠ No payment methods enabled — customers won&apos;t be able to checkout!</p>
          ) : (
            methods
              .filter((m) => m.enabled)
              .map((m) => (
                <div key={m.id} className="flex items-center gap-3 bg-[#111] border border-white/5 rounded-xl px-4 py-3">
                  <span className="text-lg">{m.icon}</span>
                  <div>
                    <p className="text-white text-sm font-semibold">{m.label}</p>
                    <p className="text-gray-500 text-[11px]">{m.description}</p>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
