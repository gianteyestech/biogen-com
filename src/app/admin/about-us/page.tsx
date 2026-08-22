"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Save, Image as ImageIcon } from "lucide-react";
import type { CMSGalleryData, CMSTeamMember, CMSGalleryItem } from "@/lib/cms-types";
import ImageUploader from "@/components/admin/ImageUploader";

export default function AboutUsAdmin() {
  const [data, setData] = useState<CMSGalleryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"team" | "gallery">("team");

  useEffect(() => {
    fetch("/api/admin/gallery")
      .then((res) => res.json())
      .then((resData) => {
        setData({
          team: resData.team || [],
          gallery: resData.gallery || [],
        });
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save");
      alert("About Us data saved successfully!");
    } catch (err: any) {
      alert("Error saving: " + err.message);
    }
    setSaving(false);
  };

  const addTeamMember = () => {
    if (!data) return;
    const newMember: CMSTeamMember = {
      id: `team_${Date.now()}`,
      name: "New Member",
      role: "Role",
      bio: "Short biography.",
      imageUrl: "",
    };
    setData({ ...data, team: [...data.team, newMember] });
  };

  const updateTeamMember = (id: string, field: keyof CMSTeamMember, value: string) => {
    if (!data) return;
    setData({
      ...data,
      team: data.team.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    });
  };

  const removeTeamMember = (id: string) => {
    if (!data) return;
    if (confirm("Remove this team member?")) {
      setData({ ...data, team: data.team.filter((m) => m.id !== id) });
    }
  };

  const addGalleryItem = () => {
    if (!data) return;
    const newItem: CMSGalleryItem = {
      id: `gallery_${Date.now()}`,
      title: "New Image",
      category: "Category",
      badge: "Badge",
      imageUrl: "",
      aspectRatio: "landscape",
    };
    setData({ ...data, gallery: [...data.gallery, newItem] });
  };

  const updateGalleryItem = (id: string, field: keyof CMSGalleryItem, value: string) => {
    if (!data) return;
    setData({
      ...data,
      gallery: data.gallery.map((g) => (g.id === id ? { ...g, [field]: value } : g)),
    });
  };

  const removeGalleryItem = (id: string) => {
    if (!data) return;
    if (confirm("Remove this gallery image?")) {
      setData({ ...data, gallery: data.gallery.filter((g) => g.id !== id) });
    }
  };

  if (loading || !data) return <div className="p-8 text-white">Loading...</div>;

  const inputCls = "w-full px-3 py-2 bg-[#070B14] border border-slate-700 rounded-lg text-white text-xs outline-none focus:border-[#0072CE] transition-all";
  const labelCls = "block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1";

  return (
    <div className="p-6 max-w-6xl mx-auto text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">About Us & Gallery</h1>
          <p className="text-sm text-slate-400 mt-1">Manage executive team members and corporate event gallery</p>
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

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("team")}
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
            tab === "team" ? "bg-[#0072CE] text-white" : "bg-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          Executive Team
        </button>
        <button
          onClick={() => setTab("gallery")}
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
            tab === "gallery" ? "bg-[#0072CE] text-white" : "bg-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          Corporate Gallery
        </button>
      </div>

      {tab === "team" && (
        <div className="space-y-4">
          <button
            onClick={addTeamMember}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm transition-colors mb-2"
          >
            <Plus size={16} /> Add Team Member
          </button>
          
          {data.team.map((member) => (
            <div key={member.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex gap-6 relative group">
              <button
                onClick={() => removeTeamMember(member.id)}
                className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition-colors"
              >
                <Trash2 size={18} />
              </button>
              
              <div className="w-48 shrink-0">
                <ImageUploader
                  label="Profile Photo"
                  value={member.imageUrl}
                  folder="team"
                  onChange={(url) => updateTeamMember(member.id, "imageUrl", url)}
                  placeholder="Upload photo..."
                />
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Name</label>
                    <input value={member.name} onChange={(e) => updateTeamMember(member.id, "name", e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Role / Title</label>
                    <input value={member.role} onChange={(e) => updateTeamMember(member.id, "role", e.target.value)} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Biography</label>
                  <textarea rows={3} value={member.bio} onChange={(e) => updateTeamMember(member.id, "bio", e.target.value)} className={inputCls} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "gallery" && (
        <div className="space-y-4">
          <button
            onClick={addGalleryItem}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm transition-colors mb-2"
          >
            <Plus size={16} /> Add Gallery Image
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {data.gallery.map((item) => (
              <div key={item.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl relative group flex flex-col">
                <button
                  onClick={() => removeGalleryItem(item.id)}
                  className="absolute top-2 right-2 p-1.5 bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg transition-all z-10 opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
                
                <div className="mb-4">
                  <ImageUploader
                    label=""
                    value={item.imageUrl}
                    folder="gallery"
                    onChange={(url) => updateGalleryItem(item.id, "imageUrl", url)}
                    placeholder="Upload image..."
                  />
                </div>

                <div className="space-y-3 flex-1 flex flex-col justify-end">
                  <div>
                    <label className={labelCls}>Title</label>
                    <input value={item.title} onChange={(e) => updateGalleryItem(item.id, "title", e.target.value)} className={inputCls} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={labelCls}>Category</label>
                      <input value={item.category} onChange={(e) => updateGalleryItem(item.id, "category", e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Badge</label>
                      <input value={item.badge} onChange={(e) => updateGalleryItem(item.id, "badge", e.target.value)} className={inputCls} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
