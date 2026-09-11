"use client";

import React from "react";
import { slugify } from "@/data/newsArticles";

export default function StatesSection() {
  const statesSubStories = [
    {
      id: "1",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
      title:
        "California lawmakers move to shield the coast from Trump's oil agenda",
      byline: "BY NOAH BAUSTIN",
    },
    {
      id: "2",
      image:
        "https://images.unsplash.com/photo-1487611459768-bd414656ea10?auto=format&fit=crop&w=600&q=80",
      title:
        "Social media giants could face even stiffer penalties under California bill",
      byline: "BY TYLER KATZENBERGER",
    },
    {
      id: "3",
      image:
        "https://images.unsplash.com/photo-1494172961521-33799ddd43a5?auto=format&fit=crop&w=600&q=80",
      title: "Nithya Raman's LA mayoral bid tests her socialist ties",
      byline: "BY MELANIE MASON",
    },
  ];

  return (
    <section className="w-full font-sans my-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 items-start">

        {/* Left Column (3 cols): Empty spacer to align with other sections */}
        <div className="hidden lg:block lg:col-span-3 pr-3">
          {/* intentional empty column to match Legal section alignment */}
        </div>

        {/* Middle Column (6 cols): STATES Main Section */}
        <div className="lg:col-span-6 space-y-6 pt-6 lg:pt-0 lg:px-4">
          {/* Section Header */}
          <div className="flex items-center gap-2 pb-2 border-b-2 border-black">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block" />
            <h2 className="text-xs font-black tracking-widest text-[#111111] uppercase font-sans">
              STATES
            </h2>
          </div>

          {/* Hero Lead Story */}
          <article className="group cursor-pointer">
            <a href={`/news/${slugify("Waiting for Jon Voight, Hollywood's would-be savior")}`} className="block space-y-3">
              <div className="aspect-[16/9] bg-gray-100 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1000&q=80"
                  alt="Political rally with crowd"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight text-gray-900 group-hover:text-[#d32f2f] transition-colors tracking-tight font-sans">
                Waiting for Jon Voight, Hollywood's would-be savior
              </h1>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider font-sans">
                BY DANIEL MILLER
              </p>
            </a>
          </article>

          {/* 3 Stacked Horizontal Sub-Stories */}
          <div className="divide-y divide-gray-200 pt-2">
            {statesSubStories.map((item) => (
              <article
                key={item.id}
                className="py-4 first:pt-0 group cursor-pointer"
              >
                <a href={`/news/${slugify(item.title)}`} className="flex items-start gap-4">
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
