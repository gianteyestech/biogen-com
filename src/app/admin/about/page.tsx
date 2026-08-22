"use client";

import React, { useState, useEffect } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import type { CMSAboutContent } from "@/lib/cms-types";

export default function AboutAdmin() {
  const [content, setContent] = useState<CMSAboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/about")
      .then((res) => res.json())
      .then((data) => {
        setContent(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!res.ok) throw new Error("Failed to save");
      alert("About content saved successfully!");
    } catch (err: any) {
      alert("Error saving: " + err.message);
    }
    setSaving(false);
  };

  const addFeature = () => {
    if (!content) return;
    const newFeature = {
      id: `f_${Date.now()}`,
      icon: "Star",
      title: "New Feature",
      description: "Description here...",
      color: "blue"
    };
    setContent({ ...content, features: [...content.features, newFeature] });
  };

  const updateFeature = (index: number, field: string, value: string) => {
    if (!content) return;
    const newFeatures = [...content.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setContent({ ...content, features: newFeatures });
  };

  const removeFeature = (index: number) => {
    if (!content) return;
    const newFeatures = [...content.features];
    newFeatures.splice(index, 1);
    setContent({ ...content, features: newFeatures });
  };

  if (loading) return <div className="p-8 text-white">Loading...</div>;
  if (!content) return <div className="p-8 text-white">No content found.</div>;

  const inputCls = "w-full px-3 py-2 bg-[#070B14] border border-slate-700 rounded-lg text-white text-xs outline-none focus:border-[#0072CE] transition-all";
  const labelCls = "block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1";

  return (
    <div className="p-6 max-w-5xl mx-auto text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">About Us Content</h1>
          <p className="text-sm text-slate-400 mt-1">Manage intro text and core division features</p>
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

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl mb-6">
        <label className={labelCls}>Introductary Text</label>
        <textarea
          value={content.introText}
          onChange={(e) => setContent({ ...content, introText: e.target.value })}
          className={inputCls}
          rows={4}
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Core Healthcare Divisions (Features)</h2>
          <button
            onClick={addFeature}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors"
          >
            <Plus size={14} /> Add Division
          </button>
        </div>

        <div className="space-y-4">
          {content.features.map((f, i) => (
            <div key={f.id} className="p-4 bg-[#070B14] border border-slate-700 rounded-lg relative">
              <button
                onClick={() => removeFeature(i)}
                className="absolute top-4 right-4 text-slate-500 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mr-8">
                <div>
                  <label className={labelCls}>Title</label>
                  <input
                    value={f.title}
                    onChange={(e) => updateFeature(i, "title", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Icon (Lucide)</label>
                  <input
                    value={f.icon}
                    onChange={(e) => updateFeature(i, "icon", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Color theme</label>
                  <select
                    value={f.color}
                    onChange={(e) => updateFeature(i, "color", e.target.value)}
                    className={inputCls}
                  >
                    <option value="blue">Blue</option>
                    <option value="sky">Sky</option>
                    <option value="indigo">Indigo</option>
                    <option value="purple">Purple</option>
                    <option value="emerald">Emerald</option>
                    <option value="rose">Rose</option>
                    <option value="amber">Amber</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className={labelCls}>Description</label>
                  <textarea
                    value={f.description}
                    onChange={(e) => updateFeature(i, "description", e.target.value)}
                    className={inputCls}
                    rows={2}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
