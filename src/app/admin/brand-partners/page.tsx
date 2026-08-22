"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Save, Image as ImageIcon, Search } from "lucide-react";
import type { CMSBrandPartner } from "@/lib/cms-types";
import ImageUploader from "@/components/admin/ImageUploader";

export default function BrandPartnersAdmin() {
  const [partners, setPartners] = useState<CMSBrandPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/brand-partners")
      .then((res) => res.json())
      .then((data) => {
        setPartners(data || []);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/brand-partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partners),
      });
      if (!res.ok) throw new Error("Failed to save");
      alert("Brand Partners saved successfully!");
    } catch (err: any) {
      alert("Error saving: " + err.message);
    }
    setSaving(false);
  };

  const addPartner = () => {
    const newPartner: CMSBrandPartner = {
      id: `partner_${Date.now()}`,
      name: "New Partner",
      shortName: "New",
      country: "",
      specialty: "",
      logoUrl: "",
      tag: "",
      order: partners.length + 1,
    };
    setPartners([...partners, newPartner]);
  };

  const updatePartner = (id: string, key: keyof CMSBrandPartner, value: string | number) => {
    setPartners(partners.map((p) => (p.id === id ? { ...p, [key]: value } : p)));
  };

  const removePartner = (id: string) => {
    if (confirm("Remove this partner?")) {
      setPartners(partners.filter((p) => p.id !== id));
    }
  };

  if (loading) return <div className="p-8 text-white">Loading partners...</div>;

  const filtered = partners.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 max-w-6xl mx-auto text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Brand Partners</h1>
          <p className="text-sm text-slate-400 mt-1">Manage authorized principals and manufacturing partners</p>
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
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search partners..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white pl-10 pr-4 py-2 rounded-lg text-sm w-64 focus:border-[#0072CE] outline-none"
            />
          </div>
          <button
            onClick={addPartner}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm transition-colors border border-slate-700"
          >
            <Plus size={16} />
            Add Partner
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Logo</th>
                <th className="px-6 py-4 font-medium">Name & Details</th>
                <th className="px-6 py-4 font-medium">Order</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.map((partner) => (
                <tr key={partner.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-16 h-12 bg-white rounded flex items-center justify-center p-1 border border-slate-700">
                      {partner.logoUrl ? (
                        <img src={partner.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                      ) : (
                        <ImageIcon className="text-slate-400" size={20} />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2 max-w-sm">
                      <input
                        value={partner.name}
                        onChange={(e) => updatePartner(partner.id, "name", e.target.value)}
                        placeholder="Full Name"
                        className="bg-transparent border-b border-slate-700 focus:border-[#0072CE] outline-none font-medium text-white px-1 py-0.5"
                      />
                      <div className="grid grid-cols-2 gap-2 text-xs">
                         <input
                          value={partner.shortName}
                          onChange={(e) => updatePartner(partner.id, "shortName", e.target.value)}
                          placeholder="Short Name"
                          className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-300 focus:border-[#0072CE] outline-none w-full"
                        />
                        <input
                          value={partner.country}
                          onChange={(e) => updatePartner(partner.id, "country", e.target.value)}
                          placeholder="Country / Cert"
                          className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-300 focus:border-[#0072CE] outline-none w-full"
                        />
                        <input
                          value={partner.specialty}
                          onChange={(e) => updatePartner(partner.id, "specialty", e.target.value)}
                          placeholder="Specialty"
                          className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-300 focus:border-[#0072CE] outline-none w-full"
                        />
                        <input
                          value={partner.tag}
                          onChange={(e) => updatePartner(partner.id, "tag", e.target.value)}
                          placeholder="Tag"
                          className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-300 focus:border-[#0072CE] outline-none w-full"
                        />
                      </div>
                      <div className="mt-2 w-full max-w-[200px]">
                        <span className="text-xs text-slate-500 mb-1 block">Logo Image:</span>
                        <ImageUploader
                          folder="brands"
                          onUpload={(url) => updatePartner(partner.id, "logoUrl", url)}
                        />
                        <input
                          value={partner.logoUrl}
                          onChange={(e) => updatePartner(partner.id, "logoUrl", e.target.value)}
                          placeholder="/images/brands/... (or upload above)"
                          className="mt-2 w-full bg-transparent border-b border-slate-700 focus:border-[#0072CE] outline-none text-xs text-slate-400 px-1 py-0.5"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <input
                        type="number"
                        value={partner.order}
                        onChange={(e) => updatePartner(partner.id, "order", parseInt(e.target.value) || 0)}
                        className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-300 focus:border-[#0072CE] outline-none w-16 text-center"
                      />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => removePartner(partner.id)}
                      className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 rounded-lg transition-colors"
                      title="Remove Partner"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No brand partners found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
