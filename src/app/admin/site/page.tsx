"use client";
import { useState, useTransition, useEffect } from "react";
import ImageUploader from "@/components/admin/ImageUploader";
import type { CMSSiteConfig } from "@/lib/cms-types";
import { actionUpdateSiteConfig, actionGetSiteConfig, actionChangeAdminPassword } from "../actions";
import { Save, Check, KeyRound, ShieldCheck } from "lucide-react";

export default function AdminSitePage() {
  const [config, setConfig] = useState<CMSSiteConfig | null>(null);
  const [pending, startT] = useTransition();
  const [msg, setMsg] = useState("");
  const [tab, setTab] = useState<"brand" | "promo" | "features" | "footer" | "seo" | "security">("brand");

  const [passState, setPassState] = useState<{ error?: string; success?: string } | null>(null);
  const [passPending, startPassT] = useTransition();

  useEffect(() => { actionGetSiteConfig().then(setConfig); }, []);

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const handlePasswordChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startPassT(async () => {
      const res = await actionChangeAdminPassword(null, formData);
      setPassState(res);
      if (res?.success) {
        (e.target as HTMLFormElement).reset();
      }
    });
  };

  const save = () => {
    if (!config) return;
    startT(async () => {
      await actionUpdateSiteConfig(config);
      flash("Site operational parameters saved!");
    });
  };

  const set = (path: string, value: unknown) => {
    if (!config) return;
    const keys = path.split(".");
    const updated = JSON.parse(JSON.stringify(config));
    let cur: Record<string, unknown> = updated;
    for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]] as Record<string, unknown>;
    cur[keys[keys.length - 1]] = value;
    setConfig(updated);
  };

  if (!config) return (
    <div className="p-8 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-500/20 border-t-[#0072CE] rounded-full animate-spin" />
    </div>
  );

  const inputCls = "w-full px-3 py-2.5 bg-[#070B14] border border-slate-700 rounded-xl text-white text-xs outline-none focus:border-[#0072CE] transition-all placeholder-slate-500";
  const labelCls = "block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5";

  const tabs = [
    { id: "brand", label: "Brand & Hubs" },
    { id: "promo", label: "Promo Banners" },
    { id: "features", label: "Assurance Bar" },
    { id: "footer", label: "Footer Links" },
    { id: "seo", label: "SEO & Meta" },
    { id: "security", label: "Security & Passwords" },
  ] as const;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto font-sans antialiased text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-[11px] font-bold text-[#00A3E0] uppercase tracking-wider">Facility Parameters</span>
          <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">Site &amp; System Configuration</h1>
          <p className="text-slate-400 text-xs mt-0.5">Manage institutional contact parameters, hub addresses, and security credentials</p>
        </div>
        <button
          onClick={save}
          disabled={pending}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0072CE] hover:bg-[#005EA6] disabled:opacity-60 transition-colors shadow-sm uppercase tracking-wider"
        >
          {pending ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
          Save Config
        </button>
      </div>

      {msg && (
        <div className="mb-4 bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2">
          <Check size={14} /> {msg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#0E1526] border border-slate-800 rounded-xl p-1 overflow-x-auto scrollbar-none">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 min-w-[110px] py-2 text-xs font-bold rounded-lg transition-all ${
              tab === t.id
                ? "bg-[#0072CE] text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-[#0E1526] border border-slate-800 rounded-2xl p-6 space-y-5 shadow-sm">

        {/* Brand Tab */}
        {tab === "brand" && (
          <>
            <h2 className="text-xs font-bold text-[#00A3E0] uppercase tracking-wider mb-2">Corporate Identity &amp; Contact Hubs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className={labelCls}>Company Name</label><input value={config.brand.name} onChange={e => set("brand.name", e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>Mission Statement / Tagline</label><input value={config.brand.tagline} onChange={e => set("brand.tagline", e.target.value)} className={inputCls} /></div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={labelCls}>Direct Phone / Hotline</label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs text-[#00A3E0] font-bold">
                    <input
                      type="checkbox"
                      checked={config.brand.showPhone ?? false}
                      onChange={e => set("brand.showPhone", e.target.checked)}
                      className="rounded border-slate-700 bg-[#070B14] text-[#0072CE] focus:ring-[#0072CE]"
                    />
                    Display on Storefront
                  </label>
                </div>
                <input value={config.brand.phone} onChange={e => set("brand.phone", e.target.value)} className={inputCls} placeholder="+232 75 011616" />
              </div>
              <div><label className={labelCls}>Official Inquiries Email</label><input value={config.brand.email} onChange={e => set("brand.email", e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>WhatsApp Biogen Chat URL</label><input value={config.brand.whatsapp} onChange={e => set("brand.whatsapp", e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>Primary Operational Address (Gambia/Sierra Leone)</label><input value={config.brand.address} onChange={e => set("brand.address", e.target.value)} className={inputCls} /></div>
              <div className="col-span-1 sm:col-span-2">
                <ImageUploader
                  label="Official Brand Logo"
                  value={config.brand.logoUrl}
                  folder="site"
                  onChange={(url) => set("brand.logoUrl", url)}
                  placeholder="Upload brand logo graphic..."
                />
              </div>
            </div>
            <hr className="border-slate-800" />
            <h3 className="text-xs font-bold text-[#00A3E0] uppercase tracking-wider">Institutional Promotional Voucher</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className={labelCls}>Voucher Code</label><input value={config.promoCode.code} onChange={e => set("promoCode.code", e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>Discount %</label><input type="number" value={config.promoCode.discountPercent} onChange={e => set("promoCode.discountPercent", Number(e.target.value))} className={inputCls} /></div>
              <div><label className={labelCls}>Minimum Order Requirement ($)</label><input type="number" value={config.promoCode.minOrderAmount} onChange={e => set("promoCode.minOrderAmount", Number(e.target.value))} className={inputCls} /></div>
              <div><label className={labelCls}>Description</label><input value={config.promoCode.description} onChange={e => set("promoCode.description", e.target.value)} className={inputCls} /></div>
            </div>
            <hr className="border-slate-800" />
            <h3 className="text-xs font-bold text-[#00A3E0] uppercase tracking-wider">Logistics &amp; Shipping Charges</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelCls}>Free Priority Delivery Threshold ($)</label><input type="number" value={config.shipping.freeThreshold} onChange={e => set("shipping.freeThreshold", Number(e.target.value))} className={inputCls} /></div>
              <div><label className={labelCls}>Standard Freight / Logistics Fee ($)</label><input type="number" value={config.shipping.standardCost} onChange={e => set("shipping.standardCost", Number(e.target.value))} className={inputCls} /></div>
            </div>
          </>
        )}

        {/* Promo Banners Tab */}
        {tab === "promo" && (
          <>
            <h2 className="text-xs font-bold text-[#00A3E0] uppercase tracking-wider mb-2">Category Promotional Modules</h2>
            <div className="space-y-4">
              {config.promoBanners.map((banner, i) => (
                <div key={banner.id} className="bg-[#070B14] border border-slate-800 rounded-xl p-4 grid grid-cols-2 gap-3">
                  <div><label className={labelCls}>Label</label><input value={banner.label} onChange={e => { const b = [...config.promoBanners]; b[i] = { ...b[i], label: e.target.value }; set("promoBanners", b); }} className={inputCls} /></div>
                  <div><label className={labelCls}>Subtext</label><input value={banner.sub} onChange={e => { const b = [...config.promoBanners]; b[i] = { ...b[i], sub: e.target.value }; set("promoBanners", b); }} className={inputCls} /></div>
                  <div><label className={labelCls}>Link to Department ID</label><input value={banner.catId} onChange={e => { const b = [...config.promoBanners]; b[i] = { ...b[i], catId: e.target.value }; set("promoBanners", b); }} className={inputCls} /></div>
                  <div><label className={labelCls}>Accent Color (Hex)</label>
                    <div className="flex gap-2">
                      <input value={banner.color} onChange={e => { const b = [...config.promoBanners]; b[i] = { ...b[i], color: e.target.value }; set("promoBanners", b); }} className={inputCls} />
                      <input type="color" value={banner.color} onChange={e => { const b = [...config.promoBanners]; b[i] = { ...b[i], color: e.target.value }; set("promoBanners", b); }} className="w-10 h-10 rounded-lg border border-slate-700 bg-[#070B14] cursor-pointer" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Assurance Features Tab */}
        {tab === "features" && (
          <>
            <h2 className="text-xs font-bold text-[#00A3E0] uppercase tracking-wider mb-2">Quality &amp; Logistics Assurance Bar</h2>
            <p className="text-xs text-slate-500 mb-4">Supported Icons: Truck, RotateCcw, Headphones, Tag, Shield, Star, Package</p>
            <div className="space-y-3">
              {config.trustFeatures.map((f, i) => (
                <div key={f.id} className="bg-[#070B14] border border-slate-800 rounded-xl p-4 grid grid-cols-3 gap-3 items-center">
                  <div><label className={labelCls}>Icon Name</label><input value={f.icon} onChange={e => { const t = [...config.trustFeatures]; t[i] = { ...t[i], icon: e.target.value }; set("trustFeatures", t); }} className={inputCls} /></div>
                  <div><label className={labelCls}>Title</label><input value={f.title} onChange={e => { const t = [...config.trustFeatures]; t[i] = { ...t[i], title: e.target.value }; set("trustFeatures", t); }} className={inputCls} /></div>
                  <div><label className={labelCls}>Subtitle</label><input value={f.sub} onChange={e => { const t = [...config.trustFeatures]; t[i] = { ...t[i], sub: e.target.value }; set("trustFeatures", t); }} className={inputCls} /></div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Footer Tab */}
        {tab === "footer" && (
          <>
            <h2 className="text-xs font-bold text-[#00A3E0] uppercase tracking-wider mb-2">Footer Navigation &amp; Social</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Quick Links (one per line)</label>
                <textarea rows={8} value={config.footer.quickLinks.join("\n")}
                  onChange={e => set("footer.quickLinks", e.target.value.split("\n"))}
                  className={inputCls + " resize-none"} />
              </div>
              <div>
                <label className={labelCls}>Policy Links (one per line)</label>
                <textarea rows={8} value={config.footer.moreLinks.join("\n")}
                  onChange={e => set("footer.moreLinks", e.target.value.split("\n"))}
                  className={inputCls + " resize-none"} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Newsletter Headline</label>
              <input value={config.footer.newsletterTitle} onChange={e => set("footer.newsletterTitle", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Newsletter Subtitle</label>
              <input value={config.footer.newsletterSub} onChange={e => set("footer.newsletterSub", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Footer Copyright Text</label>
              <input value={config.footer.copyrightText || ""} onChange={e => set("footer.copyrightText", e.target.value)} className={inputCls} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelCls}>Social Channels (FB, IG, LI, WA)</label>
                <button
                  type="button"
                  onClick={() => {
                    const soc = [...config.footer.social, { label: "LI", href: "https://linkedin.com/company/biogenpharma" }];
                    set("footer.social", soc);
                  }}
                  className="text-xs text-[#00A3E0] font-bold hover:underline"
                >
                  + Add Channel
                </button>
              </div>
              <div className="space-y-2">
                {config.footer.social.map((s, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input value={s.label} onChange={e => { const soc = [...config.footer.social]; soc[i] = { ...soc[i], label: e.target.value }; set("footer.social", soc); }} placeholder="Label (e.g. LI)" className="w-24 px-3 py-2 bg-[#070B14] border border-slate-700 rounded-lg text-white text-xs outline-none focus:border-[#0072CE]" />
                    <input value={s.href} onChange={e => { const soc = [...config.footer.social]; soc[i] = { ...soc[i], href: e.target.value }; set("footer.social", soc); }} placeholder="Channel URL" className={inputCls} />
                    <button
                      type="button"
                      onClick={() => {
                        const soc = config.footer.social.filter((_, idx) => idx !== i);
                        set("footer.social", soc);
                      }}
                      className="p-2 text-slate-500 hover:text-red-400"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* SEO Tab */}
        {tab === "seo" && (
          <>
            <h2 className="text-xs font-bold text-[#00A3E0] uppercase tracking-wider mb-2">Search Engine Optimization (SEO)</h2>
            <div className="space-y-4">
              <div><label className={labelCls}>Site Brand Name</label><input value={config.seo.siteName} onChange={e => set("seo.siteName", e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>Default Page Title</label><input value={config.seo.defaultTitle} onChange={e => set("seo.defaultTitle", e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>Default Meta Description</label><textarea rows={3} value={config.seo.defaultDescription} onChange={e => set("seo.defaultDescription", e.target.value)} className={inputCls + " resize-none"} /></div>
              <div><label className={labelCls}>Search Keywords</label><input value={config.seo.keywords} onChange={e => set("seo.keywords", e.target.value)} className={inputCls} placeholder="pharmaceuticals, medical devices, surgical instruments..." /></div>
            </div>
          </>
        )}

        {/* Security / Password Tab */}
        {tab === "security" && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <KeyRound className="w-5 h-5 text-[#00A3E0]" />
              <h2 className="text-xs font-bold text-[#00A3E0] uppercase tracking-wider">Update Admin Master Password</h2>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md bg-[#070B14] p-6 rounded-xl border border-slate-800">
              {passState?.error && (
                <div className="bg-red-950/50 border border-red-500/30 text-red-400 text-xs px-3 py-2 rounded-lg">
                  {passState.error}
                </div>
              )}
              {passState?.success && (
                <div className="bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-2 rounded-lg">
                  {passState.success}
                </div>
              )}

              <div>
                <label className={labelCls}>Current Master Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  required
                  placeholder="Enter current password"
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  required
                  minLength={6}
                  placeholder="Enter new password (min 6 chars)"
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  minLength={6}
                  placeholder="Confirm new password"
                  className={inputCls}
                />
              </div>

              <button
                type="submit"
                disabled={passPending}
                className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#0072CE] hover:bg-[#005EA6] transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm"
              >
                {passPending ? "Updating Database…" : "Update Master Password"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
