"use client";

import React, { useState, useEffect, useRef } from "react";
import { Link2, Eye, EyeOff, Image as ImageIcon, ExternalLink, RefreshCw, CheckCircle2 } from "lucide-react";

export interface AdSlot {
  id: number;
  slot_key: string;
  name: string;
  slot_type: "banner" | "home" | "category" | "article" | "author" | string;
  dimensions: string;
  description: string;
  active: boolean | number;
  image: string;
  action_type: string;
  link: string;
}

export default function ManageAds() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [adSlots, setAdSlots] = useState<AdSlot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [saveSuccessId, setSaveSuccessId] = useState<number | null>(null);

  // File input refs for each ad slot
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ads");
      const data = await res.json();
      if (data.ads) {
        setAdSlots(data.ads);
      }
    } catch (err) {
      console.error("Failed to fetch ads", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAd = async (id: number, updates: Partial<AdSlot>) => {
    try {
      // Optimistic update
      setAdSlots((prev) => prev.map((ad) => (ad.id === id ? { ...ad, ...updates } : ad)));

      const res = await fetch("/api/ads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      if (!res.ok) throw new Error("Failed to update ad");
      const data = await res.json();
      if (data.image) {
        setAdSlots((prev) => prev.map((ad) => (ad.id === id ? { ...ad, image: data.image } : ad)));
      }

      setSaveSuccessId(id);
      setTimeout(() => setSaveSuccessId((prev) => (prev === id ? null : prev)), 2000);
    } catch (err) {
      console.error(err);
      fetchAds();
    }
  };

  const handleImageUpload = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      handleUpdateAd(id, { image: base64String });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (id: number) => {
    if (confirm("Are you sure you want to remove this advertisement graphic?")) {
      handleUpdateAd(id, { image: "" });
      if (fileInputRefs.current[id]) {
        fileInputRefs.current[id]!.value = "";
      }
    }
  };

  // Group tabs strictly matching user requirement:
  // "banner ad is same for every pages but square ads are we will put separate ads for each and every ads.
  // so we wanna put separate tools for ad 1 to 6, ad 07 also separate one
  // and also current manage ads has 4 slots all, home page,category... so you should put our slots like that with working tool."
  const tabs = [
    { id: "all", label: `ALL SLOTS (${adSlots.length})` },
    { id: "banner", label: `GLOBAL BANNER (${adSlots.filter((a) => a.slot_key === "banner_global").length})` },
    { id: "home", label: `HOMEPAGE (Ad 01 – Ad 05)` },
    { id: "category", label: `CATEGORY PAGE` },
    { id: "article", label: `ARTICLE PAGE (Ad 06)` },
    { id: "author", label: `AUTHOR PAGE (Ad 07)` },
  ];

  const filteredAds = adSlots.filter((ad) => {
    if (activeTab === "all") return true;
    if (activeTab === "banner") return ad.slot_key === "banner_global";
    if (activeTab === "home") return ad.slot_type === "home";
    if (activeTab === "category") return ad.slot_type === "category";
    if (activeTab === "article") return ad.slot_type === "article" || ad.slot_key === "ad_06";
    if (activeTab === "author") return ad.slot_type === "author" || ad.slot_key === "ad_07";
    return true;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ce1126]" />
            <h2 className="text-xl font-bold text-[#1e2532]">Manage Advertisements</h2>
          </div>
          <p className="text-xs text-gray-500 font-medium">
            Configure advertisement creatives and target URLs for Global Banners, Homepage Square Ads (01 – 05), Article Sidebar (06), and Author Skyscraper (07).
          </p>
        </div>
        <button
          onClick={fetchAds}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto custom-scrollbar gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border-b-2 ${
                isActive
                  ? "border-[#ce1126] text-[#ce1126] bg-red-50/30"
                  : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Slot list */}
      {isLoading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <RefreshCw size={24} className="text-[#ce1126] animate-spin" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Loading Advertisement Slots...
          </span>
        </div>
      ) : filteredAds.length === 0 ? (
        <div className="py-16 text-center text-sm text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          No ad slots configured for this filter.
        </div>
      ) : (
        <div className="space-y-6">
          {filteredAds.map((ad) => {
            const isActive = Boolean(ad.active);
            const isBanner = ad.dimensions.includes("970");
            const isTall = ad.dimensions.includes("600");

            return (
              <div
                key={ad.id}
                className="border border-gray-200 hover:border-gray-300 transition-all rounded-xl p-5 sm:p-6 bg-white shadow-xs flex flex-col lg:flex-row gap-6 lg:gap-8 relative"
              >
                {/* Visual Preview / Upload Box */}
                <div className="w-full lg:w-[360px] flex-shrink-0 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-[#ce1126] uppercase tracking-widest">
                      DIMENSIONS: {ad.dimensions}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-bold">
                      {ad.slot_key.toUpperCase()}
                    </span>
                  </div>

                  <div
                    onClick={() => fileInputRefs.current[ad.id]?.click()}
                    className={`w-full ${
                      isTall
                        ? "h-[220px]"
                        : isBanner
                        ? "h-[110px]"
                        : "h-[150px]"
                    } bg-[#f9fafb] rounded-lg border-2 border-dashed border-gray-200 hover:border-[#ce1126] transition-colors overflow-hidden flex flex-col items-center justify-center relative cursor-pointer group`}
                  >
                    {ad.image ? (
                      <img
                        src={ad.image}
                        alt={ad.name}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 text-gray-400 group-hover:text-[#ce1126] transition-colors p-4 text-center">
                        <ImageIcon size={28} className="stroke-[1.5]" />
                        <span className="text-xs font-bold">Click to Upload Ad Graphic</span>
                        <span className="text-[10px] text-gray-400">JPG, PNG, WebP or GIF</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <span className="text-white text-[11px] font-bold uppercase tracking-wider bg-[#ce1126] px-3 py-1.5 rounded shadow">
                        {ad.image ? "Change Creative" : "Upload Creative"}
                      </span>
                    </div>
                  </div>

                  {/* Actions & File Input */}
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <label className="cursor-pointer font-bold text-[#ce1126] hover:text-[#a00d1d] transition-colors">
                      Browse File...
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        ref={(el) => {
                          fileInputRefs.current[ad.id] = el;
                        }}
                        onChange={(e) => handleImageUpload(ad.id, e)}
                      />
                    </label>

                    {ad.image && (
                      <button
                        onClick={() => handleRemoveImage(ad.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors text-[11px] font-semibold"
                      >
                        Remove Creative
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Configuration Form */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    {/* Title + Toggle */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-gray-100 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-[#1e2532]">{ad.name}</h3>
                          {saveSuccessId === ad.id && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                              <CheckCircle2 size={12} /> Saved
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{ad.description}</p>
                      </div>

                      {/* Active Toggle Switch */}
                      <div className="flex items-center gap-2.5 self-start sm:self-auto bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isActive}
                            onChange={(e) => handleUpdateAd(ad.id, { active: e.target.checked })}
                          />
                          <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#ce1126]" />
                        </label>
                        <span
                          className={`text-[10px] font-extrabold uppercase tracking-wider ${
                            isActive ? "text-[#ce1126]" : "text-gray-400"
                          }`}
                        >
                          {isActive ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                          ACTION TYPE
                        </label>
                        <select
                          disabled
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs bg-gray-50 text-gray-600 cursor-not-allowed font-medium"
                        >
                          <option>{ad.action_type || "External Link (URL)"}</option>
                        </select>
                        <p className="text-[10px] text-gray-400 mt-1">
                          When users click this ad, it redirects to the URL below in a new tab.
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                            DESTINATION URL
                          </label>
                          {ad.link && (
                            <a
                              href={ad.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-bold text-[#ce1126] hover:underline flex items-center gap-1"
                            >
                              Test <ExternalLink size={10} />
                            </a>
                          )}
                        </div>

                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Link2 size={13} />
                          </div>
                          <input
                            type="url"
                            value={ad.link || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setAdSlots((prev) =>
                                prev.map((a) => (a.id === ad.id ? { ...a, link: val } : a))
                              );
                            }}
                            onBlur={() => {
                              handleUpdateAd(ad.id, { link: ad.link });
                            }}
                            placeholder="https://sponsor-landing-page.com"
                            className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#ce1126] focus:border-[#ce1126] transition-all font-mono"
                          />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">
                          Changes save automatically when you click outside or press Tab.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer status notice */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                    <span>
                      Placement: <strong className="text-gray-600 font-semibold">{ad.slot_type.toUpperCase()}</strong>
                    </span>
                    <span>
                      Status:{" "}
                      <strong className={isActive ? "text-emerald-600 font-semibold" : "text-gray-400 font-medium"}>
                        {isActive ? (ad.image ? "Live with Creative" : "Active (Displaying Size Placeholder)") : "Hidden"}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
