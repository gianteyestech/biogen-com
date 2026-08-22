"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Save, Search } from "lucide-react";
import type { CMSFaq } from "@/lib/cms-types";

export default function FaqsAdmin() {
  const [faqs, setFaqs] = useState<CMSFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/faqs")
      .then((res) => res.json())
      .then((data) => {
        setFaqs(data || []);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(faqs),
      });
      if (!res.ok) throw new Error("Failed to save");
      alert("FAQs saved successfully!");
    } catch (err: any) {
      alert("Error saving: " + err.message);
    }
    setSaving(false);
  };

  const addFaq = () => {
    const newFaq: CMSFaq = {
      id: `faq_${Date.now()}`,
      question: "New Question",
      answer: "New Answer",
      category: "General",
      order: faqs.length + 1,
    };
    setFaqs([...faqs, newFaq]);
  };

  const updateFaq = (id: string, key: keyof CMSFaq, value: string | number) => {
    setFaqs(faqs.map((f) => (f.id === id ? { ...f, [key]: value } : f)));
  };

  const removeFaq = (id: string) => {
    if (confirm("Remove this FAQ?")) {
      setFaqs(faqs.filter((f) => f.id !== id));
    }
  };

  if (loading) return <div className="p-8 text-white">Loading FAQs...</div>;

  const filtered = faqs.filter((f) => f.question.toLowerCase().includes(search.toLowerCase()) || f.category.toLowerCase().includes(search.toLowerCase()));

  const inputCls = "w-full px-3 py-2 bg-[#070B14] border border-slate-700 rounded-lg text-white text-sm outline-none focus:border-[#0072CE] transition-all";
  const labelCls = "block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1";

  return (
    <div className="p-6 max-w-6xl mx-auto text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>
          <p className="text-sm text-slate-400 mt-1">Manage institutional FAQs and answers</p>
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

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mb-6">
        <div className="p-4 border-b border-slate-800 flex flex-wrap justify-between items-center gap-4 bg-slate-950">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white pl-10 pr-4 py-2 rounded-lg text-sm w-64 focus:border-[#0072CE] outline-none"
            />
          </div>
          <button
            onClick={addFaq}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm transition-colors border border-slate-700"
          >
            <Plus size={16} />
            Add FAQ
          </button>
        </div>

        <div className="p-6 space-y-4">
          {filtered.map((faq, i) => (
            <div key={faq.id} className="bg-[#070B14] border border-slate-800 p-5 rounded-xl flex gap-6 relative group hover:border-[#0072CE]/50 transition-colors">
              <button
                onClick={() => removeFaq(faq.id)}
                className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>
              
              <div className="flex-1 space-y-4 pr-8">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_200px_100px] gap-4">
                  <div>
                    <label className={labelCls}>Question</label>
                    <input value={faq.question} onChange={(e) => updateFaq(faq.id, "question", e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Category</label>
                    <input value={faq.category} onChange={(e) => updateFaq(faq.id, "category", e.target.value)} className={inputCls} placeholder="e.g. Products, Shipping" />
                  </div>
                  <div>
                    <label className={labelCls}>Order</label>
                    <input type="number" value={faq.order} onChange={(e) => updateFaq(faq.id, "order", parseInt(e.target.value) || 0)} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Answer</label>
                  <textarea rows={3} value={faq.answer} onChange={(e) => updateFaq(faq.id, "answer", e.target.value)} className={inputCls} />
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-10 text-slate-500">No FAQs found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
