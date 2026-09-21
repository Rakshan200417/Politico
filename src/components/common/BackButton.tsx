"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
  text?: string;
}

export default function BackButton({ text = "GO BACK" }: BackButtonProps) {
  return (
    <a 
      href="#" 
      className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[#555] hover:text-[#111] transition-colors cursor-pointer"
      onClick={(e) => {
        e.preventDefault();
        window.history.back();
      }}
    >
      <ChevronLeft size={14} strokeWidth={2.5} />
      {text}
    </a>
  );
}
