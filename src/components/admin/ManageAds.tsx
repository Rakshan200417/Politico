"use client";

import React, { useState, useEffect, useRef } from "react";
import { Link2 } from "lucide-react";

interface AdSlot {
  id: number;
  name: string;
  slot_type: string;
  dimensions: string;
  description: string;
  active: boolean;
  image: string;
  action_type: string;
  link: string;
}

export default function ManageAds() {
  const [activeAdTab, setActiveAdTab] = useState("all");
  const [adSlots, setAdSlots] = useState<AdSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // File input refs for each ad slot
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
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
    } catch (err) {
      console.error(err);
      // Re-fetch on error to revert optimistic update
      fetchAds();
    }
  };

  const handleImageUpload = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Use FileReader to convert image to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      handleUpdateAd(id, { image: base64String });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (id: number) => {
    if (confirm("Are you sure you want to remove this ad image?")) {
      handleUpdateAd(id, { image: "" });
      // Clear file input value
      if (fileInputRefs.current[id]) {
        fileInputRefs.current[id]!.value = "";
      }
    }
  };

  const filteredAds = adSlots.filter((ad) => {
    if (activeAdTab === "all") return true;
    return ad.slot_type === activeAdTab;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[#1e2532] mb-1">Manage Ads</h2>
        <p className="text-xs text-gray-500 font-medium">
          Configure customized advertisement graphics or promote internal articles in predefined slots.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto custom-scrollbar">
        {[
          { id: "all", label: `ALL AD SLOTS (${adSlots.length})` },
          { id: "home", label: `HOMEPAGE SLOTS (${adSlots.filter(a => a.slot_type === 'home').length})` },
          { id: "category", label: `CATEGORY PAGE SLOTS (${adSlots.filter(a => a.slot_type === 'category').length})` },
          { id: "author", label: `AUTHOR PAGE SLOTS (${adSlots.filter(a => a.slot_type === 'author').length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAdTab(tab.id)}
            className={`px-4 py-3 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors border-b-2 ${
              activeAdTab === tab.id
                ? "border-[#ce1126] text-[#ce1126]"
                : "border-transparent text-gray-500 hover:text-[#ce1126]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Ad Slots List */}
      <div className="space-y-8">
        {isLoading ? (
          <div className="text-center py-10 text-gray-500 text-sm">Loading ad slots...</div>
        ) : filteredAds.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-sm">No ad slots found for this category.</div>
        ) : (
          filteredAds.map((ad) => (
            <div key={ad.id} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm flex flex-col xl:flex-row gap-8 relative">
              
              {/* Left: Image Upload */}
              <div className="w-full xl:w-[400px] flex-shrink-0 flex flex-col">
                <div className="text-[10px] font-black text-[#ce1126] uppercase tracking-widest mb-3">
                  SLOT DIMENSIONS: {ad.dimensions}
                </div>
                <div 
                  className="w-full h-[150px] bg-gray-50 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center mb-4 relative group cursor-pointer hover:border-[#ce1126] transition-colors"
                  onClick={() => fileInputRefs.current[ad.id]?.click()}
                >
                  {ad.image ? (
                    <img src={ad.image} alt={ad.name} className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-xs text-gray-400 font-medium">No Image (Blank)</div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-bold uppercase tracking-widest">
                      {ad.image ? "Change Image" : "Upload Image"}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex justify-between items-center">
                    <span>UPLOAD BANNER IMAGE</span>
                    {ad.image && (
                      <button onClick={() => handleRemoveImage(ad.id)} className="text-red-500 hover:text-red-700">Remove</button>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer">
                      <span className="text-xs font-bold text-[#ce1126] hover:text-[#a00d1d]">Choose File</span>
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
                    <span className="text-xs text-gray-500 truncate max-w-[200px]">
                      {ad.image ? "Image uploaded" : "No file chosen"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Ad Configuration */}
              <div className="w-full flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base font-bold text-[#1e2532]">{ad.name}</h3>
                    
                    {/* Toggle Switch */}
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          checked={ad.active}
                          onChange={(e) => handleUpdateAd(ad.id, { active: e.target.checked })}
                        />
                        <div className={`block w-10 h-6 rounded-full transition-colors ${ad.active ? 'bg-[#ce1126]' : 'bg-gray-300'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${ad.active ? 'transform translate-x-4' : ''}`}></div>
                      </div>
                      <div className={`ml-3 text-[10px] font-bold uppercase tracking-widest ${ad.active ? 'text-[#ce1126]' : 'text-gray-400'}`}>
                        {ad.active ? 'Active' : 'Inactive'}
                      </div>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mb-6">{ad.description}</p>

                  {/* Settings Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                        ACTION TYPE
                      </label>
                      <select 
                        disabled
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#ce1126] bg-gray-50 text-gray-500 cursor-not-allowed"
                      >
                        <option>{ad.action_type}</option>
                      </select>
                      <p className="text-[10px] text-gray-400 mt-1">Currently supports external URLs.</p>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                        DESTINATION URL
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Link2 size={14} className="text-gray-400" />
                        </div>
                        <input
                          type="url"
                          value={ad.link}
                          onChange={(e) => {
                            // Update local state without triggering API call immediately for every keystroke
                            setAdSlots((prev) => prev.map((a) => (a.id === ad.id ? { ...a, link: e.target.value } : a)));
                          }}
                          onBlur={() => {
                            // Save on blur
                            handleUpdateAd(ad.id, { link: ad.link });
                          }}
                          placeholder="https://example.com"
                          className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#ce1126] focus:border-[#ce1126] transition-all"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">Saves automatically when you click away.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
