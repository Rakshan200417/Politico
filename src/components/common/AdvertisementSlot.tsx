import React from "react";

interface AdvertisementSlotProps {
  variant?: "in-article" | "banner" | "sidebar";
  className?: string;
}

export default function AdvertisementSlot({
  variant = "in-article",
  className = "",
}: AdvertisementSlotProps) {
  if (variant === "sidebar") {
    return (
      <aside className={`w-full my-6 font-sans text-center ${className}`}>
        <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-2">
          Advertisement
        </span>
        <div className="w-full h-[250px] bg-[#f8f9fa] border border-[#e5e7eb] rounded-xs flex flex-col items-center justify-center p-4">
          <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase border border-gray-300 px-2 py-0.5 rounded mb-2">
            AD
          </span>
          <p className="text-xs font-serif text-gray-400 italic">Sponsored Content</p>
        </div>
      </aside>
    );
  }

  if (variant === "banner") {
    return (
      <div className={`w-full my-8 font-sans text-center ${className}`}>
        <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-2">
          Advertisement
        </span>
        <div className="w-full min-h-[110px] sm:min-h-[140px] bg-[#f9fafb] border border-[#e5e7eb] rounded-xs flex flex-col items-center justify-center p-6 relative overflow-hidden">
          <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase border border-gray-300 px-2.5 py-0.5 rounded mb-1">
            AD
          </span>
          <span className="text-[11px] font-sans font-medium text-gray-400">
            POLITICO Commercial Network
          </span>
        </div>
      </div>
    );
  }

  // Exact reproduction of in-article ad slot from user's 3rd screenshot
  return (
    <div className={`w-full my-10 py-4 font-sans text-center ${className}`}>
      <span className="block text-[11px] font-sans font-normal text-gray-400 uppercase tracking-wider mb-6">
        Advertisement
      </span>

      <div className="w-full min-h-[140px] sm:min-h-[180px] flex items-center justify-center">
        <span className="text-[11px] font-mono font-bold tracking-widest text-gray-400 uppercase px-3 py-1 bg-gray-50 border border-gray-200 rounded">
          AD
        </span>
      </div>
    </div>
  );
}
