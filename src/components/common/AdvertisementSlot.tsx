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
          <p className="text-xs font-sans text-gray-400 italic">Sponsored Content</p>
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

  // Exact reproduction of Politico California Currents ad banner from user's 3rd image
  return (
    <div className={`w-full my-6 font-sans text-center ${className}`}>
      <span className="block text-[11px] font-sans font-normal text-gray-400 uppercase tracking-wider mb-2">
        Advertisement
      </span>

      <div className="w-full bg-[#f2f2f2] border border-[#e5e7eb] px-4 py-3 sm:px-8 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <div className="flex flex-col items-start leading-none shrink-0">
            <span className="text-[12px] font-black tracking-wider text-[#ce1126] uppercase">POLITICO</span>
            <span className="text-[18px] sm:text-[21px] font-serif font-black tracking-tight text-[#111]">California Currents</span>
          </div>
          <p className="text-[13px] sm:text-[14px] text-gray-700 font-sans leading-snug max-w-xl">
            How the politics of energy, the environment and transportation are shaping California&apos;s future
          </p>
        </div>
        <a
          href="#subscribe"
          className="bg-[#059669] hover:bg-[#047857] text-white text-[11px] sm:text-xs font-black uppercase tracking-wider px-4 py-2 rounded-full transition-colors shrink-0 whitespace-nowrap"
        >
          Subscribe Now
        </a>
      </div>
    </div>
  );
}
