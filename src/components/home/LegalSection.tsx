"use client";

import React from "react";
import { slugify } from "@/data/newsArticles";

export default function LegalSection() {

  return (
    <section className="w-full font-sans my-8">
      <div className="grid grid-cols-1 lg:grid-cols-9 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 mx-auto">
        
        {/* Left Column (3 cols): Extra Feed */}
        <div className="hidden lg:flex lg:col-span-3 pr-4 flex-col gap-6">
          <article className="group cursor-pointer">
            <a href={`/news/${slugify("A growing political reckoning is coming for data centers, POLITICO Poll shows")}`} className="block space-y-2" target="_blank">
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src="https://loremflickr.com/600/400/law,protest"
                  alt="Protesters"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-[14px] font-bold leading-[1.2] tracking-[-0.01em] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans">
                A growing political reckoning is coming for data centers, POLITICO Poll shows
              </h3>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider font-sans">
                BY KATHERINE LONG AND JESSIE BLASER
              </p>
            </a>
          </article>
          
          <article className="group cursor-pointer border-t border-[#e3e3e3] pt-4 mt-4">
            <a href={`/news/${slugify("Poll: Republicans and Democrats agree on 1 big election issue")}`} className="block space-y-2" target="_blank">
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src="https://loremflickr.com/600/400/election"
                  alt="Polls"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-[14px] font-bold leading-[1.2] tracking-[-0.01em] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans">
                Poll: Republicans and Democrats agree on 1 big election issue
              </h3>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider font-sans">
                BY ANNA WIEDERKEHR
              </p>
            </a>
          </article>
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
            <a href={`/news/${slugify("Trump again turns to SCOTUS to revive mail-in ballot restrictions")}`} className="block space-y-3" target="_blank">
              <div className="aspect-[16/9] bg-gray-100 overflow-hidden relative">
                <img
                  src="https://loremflickr.com/1000/600/courthouse"
                  alt="Supreme Court"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight text-gray-900 group-hover:text-[#d32f2f] transition-colors tracking-tight font-serif">
                Trump again turns to SCOTUS to revive mail-in ballot restrictions
              </h1>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider font-sans">
                BY JOSH GERSTEIN
              </p>
            </a>
          </article>

          {/* Stacked Horizontal Story Items */}
          <div className="divide-y divide-gray-200 pt-2">
            <article className="py-4 first:pt-0 group cursor-pointer">
              <a href={`/news/${slugify("Missouri AG asks the Supreme Court to block map ruling that would likely stop Republicans from gaining a seat")}`} className="flex items-start gap-4" target="_blank">
                <div className="w-28 sm:w-36 aspect-[4/3] bg-gray-100 shrink-0 overflow-hidden">
                  <img
                    src="https://loremflickr.com/600/400/judge"
                    alt="Court ruling"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 space-y-1.5 min-w-0">
                  <h3 className="text-base font-extrabold leading-snug text-gray-900 group-hover:text-[#d32f2f] transition-colors font-serif">
                    Missouri AG asks the Supreme Court to block map ruling that would likely stop Republicans from gaining a seat
                  </h3>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider font-sans">
                    BY GREGORY SVIRNOVSKIY
                  </p>
                </div>
              </a>
            </article>
            <article className="py-4 first:pt-0 group cursor-pointer">
              <a href={`/news/${slugify("Judge refuses to block Pentagon from deleting military records")}`} className="flex items-start gap-4" target="_blank">
                <div className="w-28 sm:w-36 aspect-[4/3] bg-gray-100 shrink-0 overflow-hidden">
                  <img
                    src="https://loremflickr.com/600/400/military"
                    alt="Pentagon block"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 space-y-1.5 min-w-0">
                  <h3 className="text-base font-extrabold leading-snug text-gray-900 group-hover:text-[#d32f2f] transition-colors font-serif">
                    Judge refuses to block Pentagon from deleting military records
                  </h3>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider font-sans">
                    BY HASSAN ALI KANU
                  </p>
                </div>
              </a>
            </article>
          </div>
        </div>

      </div>
    </section>
  );
}
