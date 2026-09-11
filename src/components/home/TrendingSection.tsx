"use client";

import React, { useState } from "react";
import { Play, Pause } from "lucide-react";
import { slugify } from "@/data/newsArticles";

export default function TrendingSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  const topStories = [
    {
      id: "1",
      num: 1,
      title: "The Republican Party's Midterm Nightmare Is Taking Shape",
    },
    {
      id: "2",
      num: 2,
      title:
        "Judge declares Rubio's speech-based student deportations violate the Constitution",
    },
    {
      id: "3",
      num: 3,
      title:
        "Trump won the heart of Michigan's Arab American community. They're moving away from Mike Rogers.",
    },
    {
      id: "4",
      num: 4,
      title:
        "Trump calls for NBC's Kristen Welker to face 'rebuke or punishment'",
    },
    {
      id: "5",
      num: 5,
      title:
        "Lawsuit alleges Freedom Fuel gas stations touted by Trump are selling stolen fuel",
    },
  ];

  const pollTitle = "'We better not blow it': Both parties are fighting to win over working class voters";
  const energyTitle = "Is electricity dimming oil's political power?";

  return (
    <aside className="w-full space-y-8 font-sans pl-0 lg:pl-4">
      {/* Featured Politico Poll Card */}
      <article className="group cursor-pointer border-b border-gray-200 pb-6">
        <a href={`/news/${slugify(pollTitle)}`}>
          <div className="aspect-[4/3] bg-gray-100 overflow-hidden mb-3 relative">
            <img
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80"
              alt="The Politico Poll"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <span className="text-[10px] font-black uppercase text-[#d32f2f] tracking-wider block mb-1">
            THE POLITICO POLL
          </span>
          <h3 className="text-xl font-extrabold leading-tight text-gray-900 group-hover:text-[#d32f2f] transition-colors mb-2">
            'We better not blow it': Both parties are fighting to win over working class voters
          </h3>
          <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">
            BY ERIN DOHERTY AND ANNA WIEDERKEHR
          </p>
        </a>
      </article>

      {/* Energy & Plugs Feature */}
      <article className="group cursor-pointer border-b border-gray-200 pb-6">
        <a href={`/news/${slugify(energyTitle)}`}>
          <div className="aspect-[4/3] bg-gray-100 overflow-hidden mb-3">
            <img
              src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80"
              alt="Power Grids & Electricity Plugs"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h3 className="text-lg font-extrabold leading-snug text-gray-900 group-hover:text-[#d32f2f] transition-colors mb-2">
            Is electricity dimming oil's political power?
          </h3>
          <p className="text-xs text-gray-600 font-serif leading-relaxed mb-2">
            Surging power demand is turning electricity prices into a political flashpoint across the U.S. and Europe.
          </p>
          <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">
            BY BENJAMIN STORROW
          </p>
        </a>
      </article>

      {/* Playbook Email Newsletter Signup Form Widget */}
      <div className="bg-white border border-gray-200 p-6 shadow-xs font-sans">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Playbook
          </h2>
          <div className="w-9 h-9 rounded-full bg-blue-900 flex items-center justify-center text-white text-[10px] font-black border-2 border-yellow-500 shadow-xs">
            ★ US ★
          </div>
        </div>
        <p className="text-xs text-gray-600 mb-5 leading-snug font-medium">
          The unofficial guide to official Washington, every morning and weekday afternoons.
        </p>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="text-[10px] font-extrabold uppercase text-gray-700 tracking-wider block mb-1">
              EMAIL
            </label>
            <input
              type="email"
              placeholder="Your Email"
              className="w-full bg-white border-b border-gray-900 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#d32f2f]"
            />
          </div>

          <div>
            <label className="text-[10px] font-extrabold uppercase text-gray-700 tracking-wider block mb-1">
              EMPLOYER
            </label>
            <input
              type="text"
              placeholder="Employer"
              className="w-full bg-white border-b border-gray-900 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#d32f2f]"
            />
          </div>

          <div>
            <label className="text-[10px] font-extrabold uppercase text-gray-700 tracking-wider block mb-1">
              JOB TITLE
            </label>
            <input
              type="text"
              placeholder="Job Title"
              className="w-full bg-white border-b border-gray-900 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#d32f2f]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#525866] hover:bg-[#3d4350] text-white font-extrabold text-xs tracking-widest uppercase py-2.5 rounded transition"
          >
            SIGN UP
          </button>
        </form>

        <p className="text-[9px] text-gray-400 mt-4 leading-tight">
          By signing up, you acknowledge and agree to our Privacy Policy and Terms of Service. You may unsubscribe at any time.
        </p>
      </div>

      {/* Florida Playbook Promo Ad Banner */}
      <div className="bg-[#101c34] text-white p-6 text-center space-y-3 font-sans">
        <span className="text-[10px] font-extrabold tracking-widest uppercase text-gray-400 block">
          Advertisement
        </span>
        <span className="text-xs font-black uppercase text-[#d32f2f] tracking-widest block">
          POLITICO
        </span>
        <h3 className="font-serif text-2xl font-bold tracking-tight">
          Florida Playbook
        </h3>
        <p className="text-xs text-gray-300 font-serif leading-relaxed">
          The power player's guide to Sunshine State politics
        </p>
        <a
          href="#"
          className="inline-block bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold text-xs uppercase px-5 py-2 rounded-full tracking-wider transition"
        >
          SUBSCRIBE NOW
        </a>
      </div>

      {/* Numbered Top 5 / Most Read List */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b-2 border-black">
          <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
          <h2 className="text-xs font-black tracking-widest text-[#111111] uppercase font-sans">
            MOST READ
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {topStories.map((item) => (
            <article key={item.id} className="py-3 flex items-start space-x-3 group cursor-pointer">
              <span className="text-sm font-black text-[#d32f2f] font-sans pt-0.5">
                {item.num}
              </span>
              <a href={`/news/${slugify(item.title)}`} className="flex-1">
                <h3 className="text-sm font-bold leading-tight text-gray-900 group-hover:text-[#d32f2f] transition-colors">
                  {item.title}
                </h3>
              </a>
            </article>
          ))}
        </div>
      </div>

      {/* O PODCASTS Widget */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b-2 border-black">
          <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
          <h2 className="text-xs font-black tracking-widest text-[#111111] uppercase font-sans">
            PODCASTS
          </h2>
        </div>

        <div className="bg-gray-50 border border-gray-200 p-5 font-sans space-y-4">
          <span className="text-[11px] font-bold text-gray-500 block text-center">
            Aug. 31, 2026
          </span>
          <h3 className="text-sm font-extrabold text-center text-gray-900 leading-snug uppercase">
            CAN AMERICA'S OIL AND GAS INDUSTRY ACTUALLY POWER AI?
          </h3>

          <div className="flex items-center space-x-3 bg-white p-3 border border-gray-200 rounded">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-[#6366f1] hover:bg-[#4f46e5] text-white flex items-center justify-center transition shadow"
              aria-label="Play podcast episode"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </button>
            <div className="flex-1">
              <span className="text-[10px] font-extrabold text-gray-500 block">
                POLITICO Energy
              </span>
              <div className="flex items-center space-x-1 my-1">
                <div className="h-3 w-1 bg-gray-400"></div>
                <div className="h-5 w-1 bg-[#6366f1]"></div>
                <div className="h-2 w-1 bg-gray-400"></div>
                <div className="h-4 w-1 bg-gray-400"></div>
                <div className="h-6 w-1 bg-[#6366f1]"></div>
                <div className="h-3 w-1 bg-gray-400"></div>
                <div className="h-5 w-1 bg-gray-400"></div>
              </div>
            </div>
            <span className="text-[10px] font-mono text-gray-500">00:00:00</span>
          </div>

          <div className="text-center">
            <span className="text-[10px] font-serif text-gray-600 block mb-2">
              Subscribe to POLITICO Energy. The latest in energy politics and policy.
            </span>
            <div className="flex items-center justify-center space-x-2">
              <span className="bg-black text-white text-[9px] font-bold px-2 py-1 rounded">
                Apple Podcasts
              </span>
              <span className="bg-[#1ed760] text-black text-[9px] font-bold px-2 py-1 rounded">
                Spotify
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* O WUERKER Editorial Cartoon Widget */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b-2 border-black">
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
          <p className="text-[11px] font-serif text-gray-700 italic leading-tight text-center">
            "They're horribly and hopelessly addicted..."
          </p>
        </div>
      </div>

      {/* POLITICO Pro Promo Box */}
      <div className="border border-gray-200 p-5 bg-white space-y-2">
        <span className="text-xl font-extrabold text-[#d32f2f] block uppercase tracking-tight">
          POLITICO<span className="text-gray-900">PRO</span>
        </span>
        <p className="text-xs text-gray-600 font-serif leading-snug">
          Exclusive news, intelligence and tools for professionals on the front lines of policy.{" "}
          <a href="#" className="font-bold text-black hover:underline">
            Learn more »
          </a>
        </p>
      </div>

      {/* App Promo Banner */}
      <div className="border border-gray-300 p-6 bg-gray-50 text-center space-y-3">
        <span className="text-[#d32f2f] font-black text-2xl tracking-tighter uppercase block">
          P POLITICO
        </span>
        <h4 className="text-sm font-black uppercase text-gray-900 leading-tight">
          THE APP YOU RELY ON FOR THE NEWS YOU NEED
        </h4>
        <p className="text-xs text-gray-500 font-medium">Download Latest Version</p>
        <div className="flex items-center justify-center space-x-2 pt-1">
          <button className="bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded">
            App Store
          </button>
          <button className="bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded">
            Google Play
          </button>
        </div>
      </div>
    </aside>
  );
}
