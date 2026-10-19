"use client";

import React, { useEffect, useState } from "react";

interface AdData {
  id: number;
  slot_key: string;
  name: string;
  dimensions: string;
  active: boolean | number;
  image: string;
  link: string;
}

// Global in-memory cache to prevent redundant fetches across multiple slots on same page
let cachedAds: AdData[] | null = null;
let fetchPromise: Promise<AdData[]> | null = null;

async function getAds(): Promise<AdData[]> {
  if (cachedAds) return cachedAds;
  if (!fetchPromise) {
    fetchPromise = fetch("/api/ads")
      .then((res) => res.json())
      .then((data) => {
        cachedAds = data.ads || [];
        return cachedAds!;
      })
      .catch((err) => {
        console.error("Failed to load advertisements", err);
        return [];
      });
  }
  return fetchPromise;
}

interface AdvertisementSlotProps {
  variant?: "in-article" | "banner" | "sidebar" | "square";
  className?: string;
  dimensions?: string;
  label?: string; // e.g. "Ad 01", "Ad 06", "Ad 07"
  slotKey?: string; // e.g. "banner_global", "ad_01", "banner_category_mid"
}

export default function AdvertisementSlot({
  variant = "in-article",
  className = "",
  dimensions,
  label,
  slotKey,
}: AdvertisementSlotProps) {
  const [ad, setAd] = useState<AdData | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Normalize slot key
  let resolvedKey = slotKey;
  if (!resolvedKey) {
    if (variant === "banner") {
      resolvedKey = "banner_global";
    } else if (label) {
      const match = label.match(/ad\s*0?(\d+)/i);
      if (match) {
        resolvedKey = `ad_0${match[1]}`;
      }
    }
  }

  useEffect(() => {
    let isMounted = true;
    getAds().then((allAds) => {
      if (!isMounted) return;
      if (resolvedKey) {
        const found = allAds.find((a) => a.slot_key === resolvedKey);
        if (found) setAd(found);
      } else if (label) {
        const found = allAds.find((a) => a.name.toLowerCase().includes(label.toLowerCase()));
        if (found) setAd(found);
      }
      setLoaded(true);
    });
    return () => {
      isMounted = false;
    };
  }, [resolvedKey, label]);

  // Determine active state: if explicitly set to 0 or false, hide
  const isActive = ad ? Boolean(ad.active) : true;
  if (loaded && ad && !isActive) {
    // If admin set this slot to inactive, do not render anything
    return null;
  }

  const dimText = dimensions || (ad?.dimensions) || (variant === "sidebar" || variant === "square" ? "300 x 250" : "970 x 250");
  const isHalfPage = dimText.includes("600") || dimText.includes("400");

  // Render Creative if image exists
  if (ad && ad.image) {
    const content = (
      <img
        src={ad.image}
        alt={ad.name || label || "Advertisement"}
        className="w-full h-full object-cover rounded-xs transition-transform duration-300 group-hover:opacity-95"
      />
    );

    if (variant === "sidebar" || variant === "square") {
      return (
        <aside className={`w-full my-6 font-sans flex items-center justify-center ${className}`}>
          <div
            className={`w-full max-w-[300px] ${
              isHalfPage ? "min-h-[400px] sm:min-h-[600px]" : "h-[250px]"
            } overflow-hidden rounded-xs border border-gray-200 shadow-2xs group relative`}
          >
            {ad.link ? (
              <a
                href={ad.link}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="block w-full h-full"
              >
                {content}
              </a>
            ) : (
              content
            )}
            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest bg-black/60 text-white rounded pointer-events-none">
              Ad
            </span>
          </div>
        </aside>
      );
    }

    return (
      <div className={`w-full my-6 font-sans flex items-center justify-center ${className}`}>
        <div className="w-full max-w-[970px] max-h-[250px] overflow-hidden rounded-xs border border-gray-200 shadow-2xs group relative">
          {ad.link ? (
            <a
              href={ad.link}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="block w-full h-full"
            >
              {content}
            </a>
          ) : (
            content
          )}
          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest bg-black/60 text-white rounded pointer-events-none">
            Ad
          </span>
        </div>
      </div>
    );
  }

  // Fallback to elegant placeholder when no custom creative is uploaded yet
  if (variant === "sidebar" || variant === "square") {
    return (
      <aside className={`w-full my-6 font-sans flex items-center justify-center ${className}`}>
        <div
          className={`w-full max-w-[300px] ${
            isHalfPage ? "min-h-[400px] sm:min-h-[500px]" : "h-[250px]"
          } bg-[#e5e7eb] border border-[#d1d5db] rounded-xs flex flex-col items-center justify-center p-4 text-center select-none`}
        >
          <span className="text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase border border-gray-400 px-2 py-0.5 rounded mb-2 bg-white/50">
            {label ? label.toUpperCase() : "AD"}
          </span>
          <p className="text-sm font-mono font-bold text-gray-600 tracking-wider uppercase">
            {dimText}
          </p>
        </div>
      </aside>
    );
  }

  return (
    <div className={`w-full my-6 font-sans flex items-center justify-center ${className}`}>
      <div className="w-full max-w-[970px] min-h-[120px] sm:min-h-[140px] bg-[#e5e7eb] border border-[#d1d5db] rounded-xs flex flex-col items-center justify-center p-6 text-center select-none">
        <span className="text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase border border-gray-400 px-2.5 py-0.5 rounded mb-2 bg-white/50">
          {label ? label.toUpperCase() : "AD"}
        </span>
        <p className="text-sm sm:text-base font-mono font-bold text-gray-600 tracking-wider uppercase">
          {dimText}
        </p>
      </div>
    </div>
  );
}
