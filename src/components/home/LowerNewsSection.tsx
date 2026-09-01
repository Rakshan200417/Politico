import React from "react";

export default function LowerNewsSection() {
  return (
    <div className="w-full space-y-8 font-sans">
      {/* Top Lead Story Section */}
      <div>
        <div className="flex items-center gap-2 pb-2 mb-4 border-b-2 border-black">
          <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
          <h2 className="text-xs font-black tracking-widest text-[#111111] uppercase font-sans">
            TOP NEWS
          </h2>
        </div>

        {/* Hero Lead Story */}
        <article className="group cursor-pointer mb-8">
          <a href="#" className="block">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-gray-900 group-hover:text-[#d32f2f] transition-colors duration-150 tracking-tight font-sans mb-3">
              The House is back in session. Many Republicans hope it won't be for long.
            </h1>
            <p className="text-gray-700 font-serif text-base sm:text-lg leading-relaxed mb-3">
              If lawmakers can pass a shutdown-averting stopgap, many are hoping to beat an early retreat to the campaign trail.
            </p>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-4">
              BY MIA MCCARTHY AND JORDAIN CARNEY
            </p>
            <div className="relative w-full aspect-[16/9] bg-gray-100 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80"
                alt="House Speaker Mike Johnson"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </a>
        </article>

        {/* 3-Column Sub-Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-6 border-t border-gray-200">
          <article className="group cursor-pointer">
            <a href="#" className="block space-y-2">
              <div className="aspect-[4/3] bg-gray-100 overflow-hidden mb-2">
                <img
                  src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80"
                  alt="USDA Research Building"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-sm font-extrabold leading-snug text-gray-900 group-hover:text-[#d32f2f] transition-colors">
                USDA cyclosporiasis research projects shelved amid funding cuts and relocations
              </h3>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
                BY MARCIA BROWN AND RACHEL SHIN
              </p>
            </a>
          </article>

          <article className="group cursor-pointer">
            <a href="#" className="block space-y-2">
              <div className="aspect-[4/3] bg-gray-100 overflow-hidden mb-2">
                <img
                  src="https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=600&q=80"
                  alt="AUKUS Polar Facility"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-sm font-extrabold leading-snug text-gray-900 group-hover:text-[#d32f2f] transition-colors">
                'There should be a Pillar 3 in AUKUS: Polar Security'
              </h3>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
                BY RYAN HEATH
              </p>
            </a>
          </article>

          <article className="group cursor-pointer">
            <a href="#" className="block space-y-2">
              <div className="aspect-[4/3] bg-gray-100 overflow-hidden mb-2">
                <img
                  src="https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=600&q=80"
                  alt="Political Campaign"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-sm font-extrabold leading-snug text-gray-900 group-hover:text-[#d32f2f] transition-colors">
                Key House races to watch as election season heats up
              </h3>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
                BY ALLISON WENZEL
              </p>
            </a>
          </article>
        </div>
      </div>
    </div>
  );
}
