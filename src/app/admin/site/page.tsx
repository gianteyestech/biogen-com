"use client";
import { useState, useTransition, useEffect } from "react";
import ImageUploader from "@/components/admin/ImageUploader";
import type { CMSSiteConfig, CMSLocation } from "@/lib/cms-types";
import { actionUpdateSiteConfig, actionGetSiteConfig, actionChangeAdminPassword } from "../actions";
import { 
  Save, Check, KeyRound, ShieldCheck, ShoppingCart, 
  BookOpen, Layers, CheckCircle2, MessageSquare, Phone, FileText,
  MapPin, Plus, Trash2
} from "lucide-react";

export default function AdminSitePage() {
  const [config, setConfig] = useState<CMSSiteConfig | null>(null);
  const [pending, startT] = useTransition();
  const [msg, setMsg] = useState("");
  const [tab, setTab] = useState<"mode" | "brand" | "locations" | "promo" | "features" | "footer" | "seo" | "security">("mode");

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

  const currentMode = config.siteMode ?? "ecommerce";

  const tabs = [
    { id: "mode", label: "⚡ Store Mode" },
    { id: "brand", label: "Brand & Hubs" },
    { id: "locations", label: "📍 Locations" },
    { id: "promo", label: "Promo Banners" },
    { id: "features", label: "Assurance Bar" },
    { id: "footer", label: "Footer Links" },
    { id: "seo", label: "SEO & Meta" },
    { id: "security", label: "Security & Passwords" },
  ] as const;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto font-sans antialiased text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#00A3E0] uppercase tracking-wider">Facility Parameters</span>
            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
              currentMode === "ecommerce"
                ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                : "bg-blue-950/60 text-[#00A3E0] border border-blue-500/30"
            }`}>
              {currentMode === "ecommerce" ? "🛒 E-Commerce Mode" : "📋 Catalogue Mode"}
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">Site &amp; System Configuration</h1>
          <p className="text-slate-400 text-xs mt-0.5">Control operating mode, institutional contact parameters, hub addresses, and security credentials</p>
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

        {/* Operating Mode Tab */}
        {tab === "mode" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xs font-bold text-[#00A3E0] uppercase tracking-wider mb-1">Platform Operating Mode</h2>
              <p className="text-slate-400 text-xs">Choose how Biogen Pharma presents products and handles practitioner inquiries.</p>
            </div>

            {/* Mode Selector Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option 1: E-Commerce Mode */}
              <div 
                onClick={() => set("siteMode", "ecommerce")}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-4 ${
                  currentMode === "ecommerce"
                    ? "bg-[#070B14] border-[#0072CE] shadow-lg shadow-blue-500/10"
                    : "bg-[#070B14]/50 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      currentMode === "ecommerce" ? "bg-[#0072CE] text-white" : "bg-slate-800 text-slate-400"
                    }`}>
                      <ShoppingCart size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">E-Commerce Mode</h3>
                      <p className="text-[10px] text-slate-400 font-medium">Direct Online Procurement</p>
                    </div>
                  </div>
                  {currentMode === "ecommerce" && (
                    <span className="text-[#00A3E0]">
                      <CheckCircle2 size={18} />
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Full online shopping experience. Buyers can view prices, select packaging sizes, add items to cart, and checkout with online orders.
                </p>
                <div className="pt-2 border-t border-slate-800/80 text-[10px] font-semibold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Cart &amp; Checkout Active
                </div>
              </div>

              {/* Option 2: Catalogue Mode */}
              <div 
                onClick={() => set("siteMode", "catalogue")}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-4 ${
                  currentMode === "catalogue"
                    ? "bg-[#070B14] border-[#0072CE] shadow-lg shadow-blue-500/10"
                    : "bg-[#070B14]/50 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      currentMode === "catalogue" ? "bg-[#0072CE] text-white" : "bg-slate-800 text-slate-400"
                    }`}>
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">Catalogue Mode</h3>
                      <p className="text-[10px] text-slate-400 font-medium">B2B Showcase &amp; Quotation Requests</p>
                    </div>
                  </div>
                  {currentMode === "catalogue" && (
                    <span className="text-[#00A3E0]">
                      <CheckCircle2 size={18} />
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  B2B Showcase for hospitals, tenders &amp; clinics. Replaces &quot;Add to Cart&quot; with &quot;Request Official Quotation &amp; CoA&quot; and direct Biogen Chat consultations.
                </p>
                <div className="pt-2 border-t border-slate-800/80 text-[10px] font-semibold text-[#00A3E0] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00A3E0]" />
                  Institutional Inquiries &amp; Quotation Active
                </div>
              </div>
            </div>

            {/* Catalogue Mode Fine-Tuning Options */}
            {currentMode === "catalogue" && (
              <div className="bg-[#070B14] border border-blue-500/20 rounded-xl p-5 space-y-4 animate-in fade-in duration-200">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers size={14} className="text-[#00A3E0]" />
                  Catalogue Mode Settings
                </h3>

                {/* Hide Price Switch */}
                <div className="flex items-center justify-between py-2 border-b border-slate-800">
                  <div>
                    <p className="text-xs font-bold text-slate-200">Hide Prices on Catalogue</p>
                    <p className="text-[11px] text-slate-400">If enabled, price tags are hidden and replaced with &quot;Inquire for Institutional Pricing&quot;</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.hidePricesInCatalogue ?? false}
                      onChange={e => set("hidePricesInCatalogue", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0072CE]" />
                  </label>
                </div>

                {/* Custom CTA Label */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className={labelCls}>Quotation Button Label</label>
                    <input
                      value={config.catalogueInquiryText || "Request Official Quotation & CoA"}
                      onChange={e => set("catalogueInquiryText", e.target.value)}
                      className={inputCls}
                      placeholder="e.g. Request Official Quotation & CoA"
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Primary Inquire Channel</label>
                    <select
                      value={config.catalogueAction || "chat"}
                      onChange={e => set("catalogueAction", e.target.value)}
                      className={inputCls}
                    >
                      <option value="chat">Biogen Live Chat Desk</option>
                      <option value="whatsapp">WhatsApp Direct Consultation</option>
                      <option value="contact">Institutional Quote Form</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

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

            <h2 className="text-xs font-bold text-[#00A3E0] uppercase tracking-wider mt-6 mb-2">Procurement &amp; Transit Thresholds</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className={labelCls}>Standard Cold-Chain Transit Fee ($ USD)</label><input type="number" value={config.shipping.standardCost} onChange={e => set("shipping.standardCost", Number(e.target.value))} className={inputCls} /></div>
              <div><label className={labelCls}>Free Institutional Dispatch Threshold ($ USD)</label><input type="number" value={config.shipping.freeThreshold} onChange={e => set("shipping.freeThreshold", Number(e.target.value))} className={inputCls} /></div>
            </div>
          </>
        )}

        {/* Promo Tab */}
        {tab === "promo" && (
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-[#00A3E0] uppercase tracking-wider mb-2">Category Promo Callouts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {config.promoBanners.map((banner, i) => (
                <div key={banner.id} className="p-4 bg-[#070B14] border border-slate-700/60 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Banner #{i + 1}</span>
                    <div className="w-4 h-4 rounded-full border border-slate-600" style={{ background: banner.bg }} />
                  </div>
                  <div><label className={labelCls}>Heading Label</label><input value={banner.label} onChange={e => set(`promoBanners.${i}.label`, e.target.value)} className={inputCls} /></div>
                  <div><label className={labelCls}>Subtitle Details</label><input value={banner.sub} onChange={e => set(`promoBanners.${i}.sub`, e.target.value)} className={inputCls} /></div>
                  <div><label className={labelCls}>Target Category Slug</label><input value={banner.catId} onChange={e => set(`promoBanners.${i}.catId`, e.target.value)} className={inputCls} /></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features Tab */}
        {tab === "features" && (
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-[#00A3E0] uppercase tracking-wider mb-2">Clinical Trust &amp; Certification Badges</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {config.trustFeatures.map((feat, i) => (
                <div key={feat.id} className="p-4 bg-[#070B14] border border-slate-700/60 rounded-xl space-y-3">
                  <span className="text-xs font-bold text-slate-300">Badge #{i + 1} ({feat.icon})</span>
                  <div><label className={labelCls}>Badge Title</label><input value={feat.title} onChange={e => set(`trustFeatures.${i}.title`, e.target.value)} className={inputCls} /></div>
                  <div><label className={labelCls}>Description</label><input value={feat.sub} onChange={e => set(`trustFeatures.${i}.sub`, e.target.value)} className={inputCls} /></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locations Tab */}
        {tab === "locations" && (() => {
          const locations: CMSLocation[] = config.locations ?? [];

          const updateLocation = (idx: number, field: keyof CMSLocation, value: unknown) => {
            const updated = locations.map((l, i) => i === idx ? { ...l, [field]: value } : l);
            set("locations", updated);
          };

          const addLocation = () => {
            const newLoc: CMSLocation = {
              id: `loc-${Date.now()}`,
              label: "New Office",
              country: "",
              flag: "🏢",
              address: "",
              phone: "",
              email: "",
              mapUrl: "",
              enabled: true,
            };
            set("locations", [...locations, newLoc]);
          };

          const removeLocation = (idx: number) => {
            set("locations", locations.filter((_, i) => i !== idx));
          };

          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold text-[#00A3E0] uppercase tracking-wider">Office Locations</h2>
                  <p className="text-slate-400 text-xs mt-0.5">Manage regional offices shown in the footer. Toggle visibility per location.</p>
                </div>
                <button
                  onClick={addLocation}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0072CE] hover:bg-[#005EA6] transition-colors"
                >
                  <Plus size={13} /> Add Location
                </button>
              </div>

              {locations.length === 0 && (
                <div className="text-center py-10 text-slate-500 text-sm border border-dashed border-slate-700 rounded-xl">
                  <MapPin size={28} className="mx-auto mb-2 opacity-30" />
                  No locations added yet. Click "Add Location" to start.
                </div>
              )}

              <div className="space-y-4">
                {locations.map((loc, i) => (
                  <div key={loc.id} className="bg-[#070B14] border border-slate-700/60 rounded-2xl p-5 space-y-4">
                    {/* Location Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{loc.flag || "🏢"}</span>
                        <span className="text-sm font-bold text-white">{loc.label || `Location #${i + 1}`}</span>
                        {loc.enabled ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">VISIBLE</span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-600">HIDDEN</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {/* Enable/Disable toggle */}
                        <label className="relative inline-flex items-center cursor-pointer" title={loc.enabled ? "Hide from footer" : "Show in footer"}>
                          <input
                            type="checkbox"
                            checked={loc.enabled}
                            onChange={e => updateLocation(i, "enabled", e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0072CE]" />
                        </label>
                        <button
                          onClick={() => removeLocation(i)}
                          className="p-1.5 text-slate-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-950/30"
                          title="Remove location"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Location Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Office Label</label>
                        <input value={loc.label} onChange={e => updateLocation(i, "label", e.target.value)} className={inputCls} placeholder="e.g. Head Office — The Gambia" />
                      </div>
                      <div>
                        <label className={labelCls}>Country</label>
                        <input value={loc.country} onChange={e => updateLocation(i, "country", e.target.value)} className={inputCls} placeholder="e.g. The Gambia" />
                      </div>
                      <div>
                        <label className={labelCls}>Flag Emoji</label>
                        <input value={loc.flag} onChange={e => updateLocation(i, "flag", e.target.value)} className={inputCls} placeholder="🇬🇲" />
                      </div>
                      <div>
                        <label className={labelCls}>Phone Number</label>
                        <input value={loc.phone ?? ""} onChange={e => updateLocation(i, "phone", e.target.value)} className={inputCls} placeholder="+220 000 0000" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelCls}>Street Address</label>
                        <input value={loc.address} onChange={e => updateLocation(i, "address", e.target.value)} className={inputCls} placeholder="Full street address" />
                      </div>
                      <div>
                        <label className={labelCls}>Office Email</label>
                        <input value={loc.email ?? ""} onChange={e => updateLocation(i, "email", e.target.value)} className={inputCls} placeholder="office@biogenpharma.site" />
                      </div>
                      <div>
                        <label className={labelCls}>Google Maps URL</label>
                        <input value={loc.mapUrl ?? ""} onChange={e => updateLocation(i, "mapUrl", e.target.value)} className={inputCls} placeholder="https://maps.google.com/..." />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Footer Tab */}
        {tab === "footer" && (
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-[#00A3E0] uppercase tracking-wider mb-2">Footer &amp; Institutional Governance</h2>
            <div><label className={labelCls}>Newsletter Heading</label><input value={config.footer.newsletterTitle} onChange={e => set("footer.newsletterTitle", e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>Newsletter Subtitle</label><input value={config.footer.newsletterSub} onChange={e => set("footer.newsletterSub", e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>Copyright &amp; Regulatory Notice</label><input value={config.footer.copyrightText || ""} onChange={e => set("footer.copyrightText", e.target.value)} className={inputCls} /></div>
          </div>
        )}

        {/* SEO Tab */}
        {tab === "seo" && (
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-[#00A3E0] uppercase tracking-wider mb-2">Metadata &amp; Search Engine Optimization</h2>
            <div><label className={labelCls}>Default Meta Title</label><input value={config.seo.defaultTitle} onChange={e => set("seo.defaultTitle", e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>Default Meta Description</label><textarea rows={3} value={config.seo.defaultDescription} onChange={e => set("seo.defaultDescription", e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>Target Keywords (Comma Separated)</label><input value={config.seo.keywords} onChange={e => set("seo.keywords", e.target.value)} className={inputCls} /></div>
          </div>
        )}

        {/* Security Tab */}
        {tab === "security" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="text-[#00A3E0]" size={16} />
              <h2 className="text-xs font-bold text-[#00A3E0] uppercase tracking-wider">CMS Security &amp; Key Rotation</h2>
            </div>
            
            <form onSubmit={handlePasswordChange} className="bg-[#070B14] p-5 rounded-xl border border-slate-800 space-y-4">
              {passState?.error && (
                <div className="bg-red-950/50 border border-red-500/30 text-red-400 text-xs px-4 py-2.5 rounded-lg">
                  {passState.error}
                </div>
              )}
              {passState?.success && (
                <div className="bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs px-4 py-2.5 rounded-lg flex items-center gap-2">
                  <Check size={14} /> {passState.success}
                </div>
              )}
              <div>
                <label className={labelCls}>Current Master Security Key</label>
                <input type="password" name="currentPassword" required className={inputCls} placeholder="Enter current master key..." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>New Master Security Key</label>
                  <input type="password" name="newPassword" required minLength={8} className={inputCls} placeholder="Min 8 characters..." />
                </div>
                <div>
                  <label className={labelCls}>Confirm New Key</label>
                  <input type="password" name="confirmPassword" required minLength={8} className={inputCls} placeholder="Re-enter new key..." />
                </div>
              </div>
              <button
                type="submit"
                disabled={passPending}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-60 transition-colors shadow-sm uppercase tracking-wider"
              >
                {passPending ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <KeyRound size={15} />}
                Update Master Security Key
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
