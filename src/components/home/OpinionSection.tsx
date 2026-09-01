"use client";

import React from "react";

export default function OpinionSection() {
  return (
    <div className="w-full font-sans">
      {/* Category Focus Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* O CONGRESS */}
        <section className="border-t border-gray-200 pt-6">
          <div className="flex items-center gap-2 pb-3 mb-6 border-b-2 border-black">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-[#ce1126] bg-transparent inline-block"></span>
            <h2 className="text-xs font-black tracking-widest text-[#111111] uppercase font-sans">
              CONGRESS
            </h2>
          </div>

          <article className="group cursor-pointer">
            <a href="#">
              <div className="aspect-[16/9] bg-gray-100 overflow-hidden mb-4">
                <img
                  src="https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80"
                  alt="Congress Member Speaking at Podium"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 leading-tight group-hover:text-[#ce1126] transition-colors mb-2">
                Trump pollster says Abdul El-Sayed's polling lead is a 'fake narrative'
              </h3>
              <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">
                BY MEREDITH LEE HILL
              </p>
            </a>
          </article>
        </section>

        {/* O WHITE HOUSE */}
        <section className="border-t border-gray-200 pt-6">
          <div className="flex items-center gap-2 pb-3 mb-6 border-b-2 border-black">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-[#ce1126] bg-transparent inline-block"></span>
            <h2 className="text-xs font-black tracking-widest text-[#111111] uppercase font-sans">
              WHITE HOUSE
            </h2>
          </div>

          <article className="group cursor-pointer">
            <a href="#">
              <div className="aspect-[16/9] bg-gray-100 overflow-hidden mb-4">
                <img
                  src="https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80"
                  alt="Marco Rubio Official Presser"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 leading-tight group-hover:text-[#ce1126] transition-colors mb-2">
                Judge declares Rubio's speech-based student deportations violate the Constitution
              </h3>
              <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">
                BY GREGORY SVIRNOVSKIY AND BEN JOHANSEN
              </p>
            </a>
          </article>
        </section>

        {/* O ELECTIONS */}
        <section className="border-t border-gray-200 pt-6">
          <div className="flex items-center gap-2 pb-3 mb-6 border-b-2 border-black">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-[#ce1126] bg-transparent inline-block"></span>
            <h2 className="text-xs font-black tracking-widest text-[#111111] uppercase font-sans">
              ELECTIONS
            </h2>
          </div>

          <article className="group cursor-pointer">
            <a href="#">
              <div className="aspect-[16/9] bg-gray-100 overflow-hidden mb-4">
                <img
                  src="https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80"
                  alt="Political Campaign Rally Crowd"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 leading-tight group-hover:text-[#ce1126] transition-colors mb-2">
                Mike Johnson planning to meet with Elon Musk in Texas
              </h3>
              <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">
                BY ANDREW HOWARD, ERIN DOHERTY AND MEREDITH LEE HILL
              </p>
            </a>
          </article>
        </section>
      </div>
    </div>
  );
}
