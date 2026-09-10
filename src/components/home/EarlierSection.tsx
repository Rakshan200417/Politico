"use client";

import React from "react";

const stories = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    title: "Tom Homan defends deportations to Haiti amid travel warnings",
    byline: "BY CHEYANNE M. DANIELS",
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80",
    title:
      "USDA cyclospora research projects shelved amid funding cuts and relocations",
    byline: "BY MARCIA BROWN AND RACHEL SHIN",
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80",
    title:
      "USS Abraham Lincoln sails past Singapore on way home from Middle East",
    byline: "BY ASSOCIATED PRESS",
  },
  {
    id: "4",
    image:
      "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=600&q=80",
    title:
      "Russia preparing 'massive strikes against Ukraine's energy facilities'",
    byline: "BY VICTOR GOURY-LAFFONT",
  },
  {
    id: "5",
    image:
      "https://loremflickr.com/600/400/germany",
    title:
      "Germany plans to blame Russia for Leipzig attack as tensions with Putin escalate",
    byline: "BY ALEXANDER DINGER AND HANS VON DER BURCHARD",
  },
  {
    id: "6",
    image:
      "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80",
    title: "Progressives are learning the hard way how to survive Fox News",
    byline: "BY EMILIO PEREZ IBARGUEN",
  },
  {
    id: "7",
    image:
      "https://images.unsplash.com/photo-1516912481808-3406841bd33c?auto=format&fit=crop&w=600&q=80",
    title: "Russia plans new ground attack on Kyiv, Ukraine warns",
    byline: "BY SAM CLARK",
  },
  {
    id: "8",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80",
    title: "The fixer at the center of FIFA's meltdown",
    byline: "BY ALI WALKER, GREGORIO SORGI AND GIULIA POLONI",
  },
  {
    id: "9",
    image:
      "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80",
    title: "How Trump took control of Venezuela's democratic transition",
    byline: "BY EVA HARTOG AND ERIC BAZAIL-EIMIL",
  },
  {
    id: "10",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80",
    title:
      "Lawsuit alleges Freedom Fuel gas stations touted by Trump are selling stolen fuel",
    byline: "BY KATHY GILSINAN",
  },
  {
    id: "11",
    image:
      "https://images.unsplash.com/photo-1575517111478-7f6afd0973db?auto=format&fit=crop&w=600&q=80",
    title:
      "Judge again rejects Trump's bid to move criminal hush money case to federal court",
    byline: "BY JOSH GERSTEIN AND KYLE CHENEY",
  },
  {
    id: "12",
    image:
      "https://images.unsplash.com/photo-1494172961521-33799ddd43a5?auto=format&fit=crop&w=600&q=80",
    title:
      "Federal grand jury indicts woman accused of damaging World War II Memorial",
    byline: "BY GREGORY SVIRNOVSKIT",
  },
];

export default function EarlierSection() {
  return (
    <section className="w-full font-sans my-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 items-start max-w-[1400px] mx-auto">

        {/* Left Column (3 cols): Empty spacer */}
        <div className="hidden lg:block lg:col-span-3 pr-3" />

        {/* Middle Column (6 cols): EARLIER list */}
        <div className="lg:col-span-6 space-y-0 pt-6 lg:pt-0 lg:px-4">

          {/* Section Header */}
          <div className="flex items-center gap-2 pb-2 border-b-2 border-black mb-2">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block" />
            <h2 className="text-xs font-black tracking-widest text-[#111111] uppercase font-sans">
              EARLIER
            </h2>
          </div>

          {/* Story List */}
          <div className="divide-y divide-gray-200">
            {stories.map((item) => (
              <article key={item.id} className="py-4 group cursor-pointer">
                <a href="#" className="flex items-start gap-4">
                  <div className="w-32 sm:w-40 aspect-[4/3] bg-gray-100 shrink-0 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
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
