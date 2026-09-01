"use client";

import React from "react";

export default function CongressSection() {
  const congressSubStories = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
      title: "Big hemp is betting Republicans roll over on 'diet weed' ban to avoid shutdown",
      byline: "BY JENNIFER SCHOLTES, MIA MCCARTHY AND GRACE YARROW",
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=600&q=80",
      title: "Trump's MAGA Inc. to host first public event in battleground Michigan",
      byline: "BY JESSICA PIPER",
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1575517111478-7f6afd0973db?auto=format&fit=crop&w=600&q=80",
      title: "House Democrat moves to reverse Trump's 'Lake America' order",
      byline: "BY RILEY ROGERSON",
    },
  ];

  const mostReadStories = [
    {
      num: 1,
      title: "The Republican Party's Midterm Nightmare Is Taking Shape",
    },
    {
      num: 2,
      title: "Judge declares Rubio's speech-based student deportations violate the Constitution",
    },
    {
      num: 3,
      title: "Trump won the heart of Michigan's Arab American community. They're moving away from Mike Rogers.",
    },
    {
      num: 4,
      title: "Trump calls for NBC's Kristen Welker to face 'rebuke or punishment'",
    },
    {
      num: 5,
      title: "USS Abraham Lincoln sails past Singapore on way home from Middle East",
    },
  ];

  const talkersStories = [
    {
      id: "t1",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80",
      title: "Hope Florida reemerges as midterm issue with leaked grand jury report",
    },
    {
      id: "t2",
      image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=400&q=80",
      title: "'We are not a bunch of woke Marxist liberals...'",
    },
  ];

  return (
    <section className="w-full font-sans my-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 items-start">
        
        {/* Left Column (3 cols): Ad Banner, Politico Poll & Extra News */}
        <div className="lg:col-span-3 space-y-8 pr-0 lg:pr-3">
          {/* Ad Banner: POLITICO California Currents */}
          <div className="bg-[#f7f8f9] border border-gray-200 p-5 text-center space-y-3">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">
              Advertisement
            </span>
            <div>
              <span className="text-sm font-black text-[#d32f2f] uppercase tracking-wider block font-sans">
                POLITICO
              </span>
              <h4 className="font-serif text-xl font-extrabold text-gray-900 tracking-tight leading-tight">
                California Currents
              </h4>
            </div>
            <p className="text-xs text-gray-600 font-serif leading-relaxed px-1">
              How the politics of energy, the environment and transportation are shaping California's future
            </p>
            <a
              href="#"
              className="inline-block bg-[#10b981] hover:bg-[#059669] text-white font-extrabold text-[10px] tracking-wider uppercase px-4 py-2 rounded-full transition shadow-xs"
            >
              SUBSCRIBE NOW
            </a>
          </div>

          {/* THE POLITICO POLL Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-black">
              <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
              <h2 className="text-xs font-black tracking-widest text-[#111111] uppercase font-sans">
                THE POLITICO POLL
              </h2>
            </div>

            <article className="group cursor-pointer space-y-2.5">
              <a href="#" className="block">
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden mb-3 relative">
                  <img
                    src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80"
                    alt="Iran War Poll"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-lg font-extrabold leading-tight text-gray-900 group-hover:text-[#d32f2f] transition-colors font-sans">
                  'A politically impossible situation': New poll shows Trump voters losing patience with Iran war
                </h3>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider mt-1">
                  BY MEGAN MESSERLY
                </p>
              </a>
            </article>

            {/* Sub-Poll Article */}
            <article className="group cursor-pointer pt-4 border-t border-gray-200 space-y-2">
              <a href="#" className="block">
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden mb-3">
                  <img
                    src="https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=600&q=80"
                    alt="Data Centers"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="text-sm font-extrabold leading-snug text-gray-900 group-hover:text-[#d32f2f] transition-colors font-sans">
                  A growing political reckoning is coming for data centers, POLITICO Poll shows
                </h4>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider mt-1">
                  BY AARON MAK AND JESSIE BLAESER
                </p>
              </a>
            </article>
          </div>
        </div>

        {/* Middle Column (6 cols): CONGRESS Main Section */}
        <div className="lg:col-span-6 space-y-6 pt-6 lg:pt-0 lg:px-4">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-black">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
            <h2 className="text-xs font-black tracking-widest text-[#111111] uppercase font-sans">
              CONGRESS
            </h2>
          </div>

          {/* Main Hero Lead Story for Congress */}
          <article className="group cursor-pointer">
            <a href="#" className="block space-y-3">
              <div className="aspect-[16/9] bg-gray-100 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1000&q=80"
                  alt="Abdul El-Sayed speaking at MI DEMS podium"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight text-gray-900 group-hover:text-[#d32f2f] transition-colors tracking-tight font-sans">
                Trump pollster says Abdul El-Sayed's polling lead is a 'fake narrative'
              </h1>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider font-sans">
                BY MEREDITH LEE HILL
              </p>
            </a>
          </article>

          {/* 3 Stacked Horizontal Story Items */}
          <div className="divide-y divide-gray-200 pt-2">
            {congressSubStories.map((item) => (
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

        {/* Right Column (3 cols): Wuerker Cartoon, Most Read & Talkers */}
        <div className="lg:col-span-3 space-y-8 pt-6 lg:pt-0 pl-0 lg:pl-3">
          {/* WUERKER Cartoon Widget */}
          <div>
            <div className="flex items-center gap-2 pb-2 mb-3 border-b-2 border-black">
              <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
              <h2 className="text-xs font-black tracking-widest text-[#111111] uppercase font-sans">
                WUERKER
              </h2>
            </div>
            <div className="border border-gray-200 p-2 bg-white group cursor-pointer">
              <div className="aspect-[4/3] bg-gray-100 overflow-hidden mb-2">
                <img
                  src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80"
                  alt="Wuerker Political Cartoon"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>

          {/* MOST READ List */}
          <div>
            <div className="flex items-center gap-2 pb-2 mb-3 border-b-2 border-black">
              <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
              <h2 className="text-xs font-black tracking-widest text-[#111111] uppercase font-sans">
                MOST READ
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {mostReadStories.map((item) => (
                <article key={item.num} className="py-2.5 flex items-start space-x-3 group cursor-pointer">
                  <span className="text-sm font-black text-[#d32f2f] font-sans pt-0.5 min-w-[14px]">
                    {item.num}
                  </span>
                  <a href="#" className="flex-1">
                    <h3 className="text-xs sm:text-sm font-bold leading-tight text-gray-900 group-hover:text-[#d32f2f] transition-colors">
                      {item.title}
                    </h3>
                  </a>
                </article>
              ))}
            </div>
          </div>

          {/* TALKERS Section */}
          <div className="pt-2">
            <div className="flex items-center gap-2 pb-2 mb-3 border-b-2 border-black">
              <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
              <h2 className="text-xs font-black tracking-widest text-[#111111] uppercase font-sans">
                TALKERS
              </h2>
            </div>
            <div className="space-y-4">
              {talkersStories.map((item) => (
                <article key={item.id} className="group cursor-pointer">
                  <a href="#" className="flex items-start gap-3">
                    <div className="w-20 aspect-[4/3] bg-gray-100 shrink-0 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-xs font-bold leading-snug text-gray-900 group-hover:text-[#d32f2f] transition-colors font-sans flex-1">
                      {item.title}
                    </h3>
                  </a>
                </article>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
