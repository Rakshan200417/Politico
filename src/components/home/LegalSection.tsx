"use client";

import React from "react";

export default function LegalSection() {
  const legalSubStories = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
      title: "Musk's AI company sues its users as victim lawsuits over Grok deepfakes mount",
      byline: "BY HASSAN ALI KANU",
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=600&q=80",
      title: "Judge blocks Trump's mail-in voting plan, again",
      byline: "BY KYLE CHENEY",
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=600&q=80",
      title: "Fired Stars and Stripes journalists sue Pentagon to get their jobs back",
      byline: "BY JALEN BECKFORD",
    },
  ];

  return (
    <section className="w-full font-sans my-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 items-start max-w-[1400px] mx-auto">
        
        {/* Left Column (3 cols): Empty / Secondary Feed Spacer */}
        <div className="hidden lg:block lg:col-span-3 pr-3">
          {/* Subtle side divider spacer */}
        </div>

        {/* Middle Column (6 cols): LEGAL Main Section */}
        <div className="lg:col-span-6 space-y-6 pt-6 lg:pt-0 lg:px-4">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-black">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
            <h2 className="text-xs font-black tracking-widest text-[#111111] uppercase font-sans">
              LEGAL
            </h2>
          </div>

          {/* Main Hero Lead Story for Legal */}
          <article className="group cursor-pointer">
            <a href="#" className="block space-y-3">
              <div className="aspect-[16/9] bg-gray-100 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1000&q=80"
                  alt="Pentagon Aerial View"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight text-gray-900 group-hover:text-[#d32f2f] transition-colors tracking-tight font-sans">
                Stars and Stripes journalists facing firing get 1-week reprieve
              </h1>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider font-sans">
                BY JOSH GERSTEIN
              </p>
            </a>
          </article>

          {/* 3 Stacked Horizontal Story Items */}
          <div className="divide-y divide-gray-200 pt-2">
            {legalSubStories.map((item) => (
              <article key={item.id} className="py-4 first:pt-0 group cursor-pointer">
                <a href="#" className="flex items-start gap-4">
                  <div className="w-28 sm:w-36 aspect-[4/3] bg-gray-100 shrink-0 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <h3 className="text-base font-extrabold leading-snug text-gray-900 group-hover:text-[#d32f2f] transition-colors font-sans">
                      {item.title}
                    </h3>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider font-sans">
                      {item.byline}
                    </p>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
