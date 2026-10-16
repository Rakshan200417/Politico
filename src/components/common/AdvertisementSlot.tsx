import React from "react";

interface AdvertisementSlotProps {
  variant?: "in-article" | "banner" | "sidebar" | "square";
  className?: string;
  dimensions?: string;
  label?: string;
}

export default function AdvertisementSlot({
  variant = "in-article",
  className = "",
  dimensions,
  label,
}: AdvertisementSlotProps) {
  if (variant === "sidebar" || variant === "square") {
    const dimText = dimensions || "300 x 250";
    const isHalfPage = dimText.includes("600") || dimText.includes("400");
    return (
      <aside className={`w-full my-6 font-sans flex items-center justify-center ${className}`}>
        <div className={`w-full max-w-[300px] ${isHalfPage ? "min-h-[400px] sm:min-h-[500px]" : "h-[250px]"} bg-[#e5e7eb] border border-[#d1d5db] rounded-xs flex flex-col items-center justify-center p-4 text-center select-none`}>
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

  // Banner / In-article standard sizes (970 x 250 / 970 x 140)
  const dimText = dimensions || (variant === "in-article" ? "970 x 140" : "970 x 250");

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

