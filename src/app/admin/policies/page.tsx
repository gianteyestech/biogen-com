"use client";

import React, { useState, useEffect } from "react";
import { Save, AlertCircle } from "lucide-react";
import type { CMSPolicyPage } from "@/lib/cms-types";

export default function PoliciesAdmin() {
  const [policies, setPolicies] = useState<CMSPolicyPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("privacy-policy");

  useEffect(() => {
    fetch("/api/admin/policies")
      .then((res) => res.json())
      .then((data) => {
        setPolicies(data);
        if (data.length > 0) setActiveTab(data[0].id);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(policies),
      });
      if (!res.ok) throw new Error("Failed to save");
      alert("Policies saved successfully!");
    } catch (err: any) {
      alert("Error saving: " + err.message);
    }
    setSaving(false);
  };

  const updatePolicy = (id: string, field: keyof CMSPolicyPage, value: string) => {
    setPolicies(policies.map(p => (p.id === id ? { ...p, [field]: value } : p)));
  };

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  const activePolicy = policies.find(p => p.id === activeTab);
  const inputCls = "w-full px-3 py-2 bg-[#070B14] border border-slate-700 rounded-lg text-white text-xs outline-none focus:border-[#0072CE] transition-all";
  const labelCls = "block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1";

  return (
    <div className="p-6 max-w-6xl mx-auto text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Policy Pages</h1>
          <p className="text-sm text-slate-400 mt-1">Manage legal and policy content using HTML/Markdown</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#0072CE] hover:bg-[#005ea6] text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {policies.map(p => (
          <button
            key={p.id}
            onClick={() => setActiveTab(p.id)}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === p.id ? "bg-[#0072CE] text-white" : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      {activePolicy && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Page Title (H1)</label>
              <input 
                value={activePolicy.title} 
                onChange={(e) => updatePolicy(activePolicy.id, "title", e.target.value)} 
                className={inputCls} 
              />
            </div>
            <div>
              <label className={labelCls}>SEO Title</label>
              <input 
                value={activePolicy.seoTitle || ""} 
                onChange={(e) => updatePolicy(activePolicy.id, "seoTitle", e.target.value)} 
                className={inputCls} 
                placeholder="e.g. Privacy Policy - Biogen Pharma"
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>SEO Description</label>
            <input 
              value={activePolicy.seoDescription || ""} 
              onChange={(e) => updatePolicy(activePolicy.id, "seoDescription", e.target.value)} 
              className={inputCls} 
              placeholder="e.g. Learn about how we handle your data..."
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className={labelCls}>Page Content (HTML supported)</label>
              <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold uppercase">
                <AlertCircle size={12} /> Accepts valid HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;li&gt;
              </div>
            </div>
            <textarea 
              rows={20} 
              value={activePolicy.contentHtml} 
              onChange={(e) => updatePolicy(activePolicy.id, "contentHtml", e.target.value)} 
              className={`${inputCls} font-mono text-[13px] leading-relaxed`} 
              placeholder="<h1>Privacy Policy</h1><p>Content goes here...</p>"
            />
          </div>
        </div>
      )}
    </div>
  );
}
