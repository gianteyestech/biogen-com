"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, Image as ImageIcon, Link as LinkIcon, X, Check, Loader2, RefreshCw } from "lucide-react";

interface MediaItem {
  url: string;
  filename: string;
  size: number;
  createdAt: number;
}

interface ImageUploaderProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  folder?: "products" | "banners" | "category" | "site";
}

export default function ImageUploader({
  label = "Image",
  value,
  onChange,
  placeholder = "Upload an image or enter image URL...",
  folder = "products",
}: ImageUploaderProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "library" | "url">("upload");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [inputUrl, setInputUrl] = useState(value || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value !== undefined && value !== inputUrl) {
      setInputUrl(value);
    }
  }, [value, inputUrl]);

  const fetchMediaList = async () => {
    setLoadingMedia(true);
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (res.ok && data.media) {
        setMediaList(data.media);
      }
    } catch {
      // Ignore background media fetch failure
    } finally {
      setLoadingMedia(false);
    }
  };

  const openLibrary = () => {
    setIsModalOpen(true);
    fetchMediaList();
  };

  const handleFileUpload = async (file: File) => {
    setError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      onChange(data.url);
      setInputUrl(data.url);
      setIsModalOpen(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">
          {label}
        </label>
      )}

      {/* Main Input Display */}
      <div className="flex gap-2 items-center">
        {/* Preview Thumbnail */}
        <div className="relative w-12 h-12 rounded-xl bg-[#111] border border-gray-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
          {value ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon size={20} className="text-gray-600" />
          )}
        </div>

        {/* URL Input field */}
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => {
            setInputUrl(e.target.value);
            onChange(e.target.value);
          }}
          placeholder={placeholder}
          className="flex-1 px-3 py-2.5 bg-[#111] border border-gray-700 rounded-xl text-white text-sm outline-none focus:border-[#C9A84C] transition-all placeholder-gray-600"
        />

        {/* Upload / Library Trigger Button */}
        <button
          type="button"
          onClick={openLibrary}
          className="px-4 py-2.5 bg-[#222] hover:bg-[#333] border border-gray-700 hover:border-[#C9A84C] rounded-xl text-xs font-semibold text-white flex items-center gap-2 transition-all flex-shrink-0"
        >
          <Upload size={14} className="text-[#C9A84C]" />
          Browse / Upload
        </button>

        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setInputUrl("");
            }}
            title="Clear Image"
            className="p-2.5 bg-red-950/40 border border-red-800/40 text-red-400 hover:bg-red-900/60 rounded-xl transition-all"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Media Manager Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-gray-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ImageIcon size={18} className="text-[#C9A84C]" /> Media Manager
                </h3>
                <p className="text-xs text-gray-400">Upload new images or pick from your library</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="px-6 border-b border-gray-800 flex gap-4 bg-[#111]">
              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all ${
                  activeTab === "upload"
                    ? "border-[#C9A84C] text-[#C9A84C]"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                }`}
              >
                <Upload size={14} /> Direct Upload
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("library");
                  fetchMediaList();
                }}
                className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all ${
                  activeTab === "library"
                    ? "border-[#C9A84C] text-[#C9A84C]"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                }`}
              >
                <ImageIcon size={14} /> Media Library ({mediaList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("url")}
                className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all ${
                  activeTab === "url"
                    ? "border-[#C9A84C] text-[#C9A84C]"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                }`}
              >
                <LinkIcon size={14} /> External Link
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {error && (
                <div className="mb-4 p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-300 flex items-center justify-between">
                  <span>{error}</span>
                  <button type="button" onClick={() => setError("")}>
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* TAB 1: UPLOAD */}
              {activeTab === "upload" && (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[220px] ${
                    dragActive
                      ? "border-[#C9A84C] bg-[#C9A84C]/10"
                      : "border-gray-700 hover:border-gray-500 bg-[#111]"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />

                  {uploading ? (
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 size={32} className="animate-spin text-[#C9A84C]" />
                      <p className="text-sm font-medium text-white">Uploading & Processing Image...</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-full bg-[#1e1e1e] border border-gray-700 flex items-center justify-center mb-3">
                        <Upload size={24} className="text-[#C9A84C]" />
                      </div>
                      <p className="text-sm font-semibold text-white mb-1">
                        Drag & Drop image here, or <span className="text-[#C9A84C]">Browse</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Supported: PNG, JPG, WEBP, AVIF, SVG (Auto converted to optimized .webp)
                      </p>
                    </>
                  )}
                </div>
              )}

              {/* TAB 2: MEDIA LIBRARY */}
              {activeTab === "library" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-xs text-gray-400">Click any image to select it for your form.</p>
                    <button
                      type="button"
                      onClick={fetchMediaList}
                      className="text-xs text-[#C9A84C] hover:underline flex items-center gap-1"
                    >
                      <RefreshCw size={12} className={loadingMedia ? "animate-spin" : ""} /> Refresh
                    </button>
                  </div>

                  {loadingMedia ? (
                    <div className="py-12 flex justify-center">
                      <Loader2 size={28} className="animate-spin text-[#C9A84C]" />
                    </div>
                  ) : mediaList.length === 0 ? (
                    <div className="py-12 text-center border border-gray-800 rounded-xl bg-[#111]">
                      <ImageIcon size={32} className="mx-auto text-gray-600 mb-2" />
                      <p className="text-sm text-gray-400">No uploaded media found.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {mediaList.map((item) => {
                        const isSelected = value === item.url;
                        return (
                          <div
                            key={item.filename}
                            onClick={() => {
                              onChange(item.url);
                              setInputUrl(item.url);
                              setIsModalOpen(false);
                            }}
                            className={`group relative aspect-square bg-[#111] border rounded-xl overflow-hidden cursor-pointer transition-all ${
                              isSelected
                                ? "border-[#C9A84C] ring-2 ring-[#C9A84C]/40"
                                : "border-gray-800 hover:border-gray-600"
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.url}
                              alt={item.filename}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {isSelected && (
                              <div className="absolute top-2 right-2 bg-[#C9A84C] text-black p-1 rounded-full shadow">
                                <Check size={12} strokeWidth={3} />
                              </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 bg-black/75 backdrop-blur-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <p className="text-[10px] text-white font-medium truncate">{item.filename}</p>
                              <p className="text-[9px] text-gray-400">{formatSize(item.size)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: EXTERNAL URL */}
              {activeTab === "url" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                      Direct Image URL
                    </label>
                    <input
                      type="text"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-3 py-2.5 bg-[#111] border border-gray-700 rounded-xl text-white text-sm outline-none focus:border-[#C9A84C]"
                    />
                  </div>

                  {inputUrl && (
                    <div className="p-4 border border-gray-800 rounded-xl bg-[#111]">
                      <p className="text-xs text-gray-400 mb-2 font-medium">Image Preview:</p>
                      <div className="max-h-48 rounded-lg overflow-hidden flex items-center justify-center bg-black/40">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={inputUrl}
                          alt="External Preview"
                          className="max-h-48 object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      onChange(inputUrl);
                      setIsModalOpen(false);
                    }}
                    className="w-full py-2.5 bg-[#C9A84C] hover:bg-[#b8922b] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                  >
                    Confirm Image URL
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
