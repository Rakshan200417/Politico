"use client";

import React, { useState } from "react";
import { Play, Pause } from "lucide-react";

export default function PodcastsNewsletters() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <aside className="w-full font-sans pl-0 lg:pl-4 space-y-8">
      {/* ── PODCASTS Widget ── */}
      <div>
        <div className="flex items-center gap-2 pb-2 mb-4 border-b-2 border-black">
          <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block" />
          <h2 className="text-xs font-black tracking-widest text-[#111111] uppercase font-sans">
            PODCASTS
          </h2>
        </div>

        <div className="bg-[#f8f9fa] border border-gray-200 p-5 space-y-4">
          <span className="text-[11px] font-bold text-gray-500 block text-center tracking-tight">
            Aug. 31, 2026
          </span>
          <h3 className="text-xs font-black text-center text-gray-900 leading-snug uppercase px-1 tracking-tight border-b border-[#d32f2f] pb-2">
            CAN AMERICA'S OIL AND GAS INDUSTRY ACTUALLY POWER AI?
          </h3>

          <p className="text-[11px] font-serif text-gray-600 text-center leading-tight">
            Subscribe to POLITICO Energy. The latest in energy politics and policy.
          </p>

          <div className="flex items-center justify-center space-x-2">
            <a
              href="#"
              className="bg-black hover:bg-gray-800 text-white text-[9px] font-bold px-2.5 py-1.5 rounded inline-flex items-center space-x-1"
            >
              <svg className="w-3 h-3 fill-white mr-1" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 3a7 7 0 110 14A7 7 0 0112 5zm-1 3.5v7l5-3.5-5-3.5z" />
              </svg>
              <span>Listen on</span>
              <span className="font-extrabold">Apple Podcasts</span>
            </a>
            <a
              href="#"
              className="bg-black hover:bg-gray-800 text-white text-[9px] font-bold px-2.5 py-1.5 rounded inline-flex items-center space-x-1"
            >
              <span>LISTEN ON</span>
              <span className="font-extrabold text-[#1ed760]">Spotify</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── NEWSLETTERS Widget ── */}
      <div>
        <div className="flex items-center gap-2 pb-2 mb-4 border-b-2 border-black">
          <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block" />
          <h2 className="text-xs font-black tracking-widest text-[#111111] uppercase font-sans">
            NEWSLETTERS
          </h2>
        </div>

        <div className="bg-white border border-gray-200 p-5 font-sans">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-2xl font-black tracking-tight text-gray-900 font-serif">
              Playbook
            </h3>
            <div className="w-8 h-8 rounded-full bg-[#1b365d] flex items-center justify-center text-white text-[9px] font-black border border-yellow-500 shadow-xs">
              ★ US ★
            </div>
          </div>

          <p className="text-xs text-gray-600 mb-4 leading-snug font-serif">
            The unofficial guide to official Washington, every morning and weekday afternoons.
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-600 tracking-wider block mb-1">
                EMAIL
              </label>
              <input
                type="email"
                placeholder="Your Email"
                className="w-full bg-white border-b border-gray-900 py-1 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#d32f2f]"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#525866] hover:bg-[#3d4350] text-white font-extrabold text-[11px] tracking-widest uppercase py-2 transition"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
