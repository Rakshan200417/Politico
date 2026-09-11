import React from "react";
import { Play } from "lucide-react";
import { slugify } from "@/data/newsArticles";
import SaveShareButtons from "@/components/common/SaveShareButtons";

export default function WhiteHouseSection() {
  const whiteHouseSubStories = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=600&q=80",
      title: "Judge declares Rubio's speech-based student deportations violate the Constitution",
      byline: "BY GREGORY SVIRNOVSKIY AND BEN JOHANSEN",
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80",
      title: "Trump says US has a deal to take huge stake in Venezuela's oil reserves",
      byline: "BY MEGAN MESSERLY, BEN LEFEBVRE AND SCOTT WALDMAN",
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
      title: "Trump looks to ease beef processing regulations",
      byline: "BY GRACE YARROW",
    },
  ];

  const leftColumnStories = [
    {
      id: "l1",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
      title: "Data centers have a politics problem — and industry knows it",
      byline: "BY AARON MAK AND JESSIE BLAESER",
    },
    {
      id: "l2",
      image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80",
      title: "'A politically impossible situation': New poll shows Trump voters losing patience with Iran war",
      byline: "BY MEGAN MESSERLY",
    },
    {
      id: "l3",
      image: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=600&q=80",
      title: "A growing political reckoning is coming for data centers, POLITICO Poll shows",
      byline: "BY KATHERINE LONG AND JESSIE BLAESER",
    },
    {
      id: "l4",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80",
      title: "Poll: Republicans and Democrats agree on 1 big election issue",
      byline: "BY ANNA WIEDERKEHR",
    },
  ];

  const rightFeatureStories = [
    {
      id: "rf1",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      title: "He's a Former General and a Grieving Father. And He Could Defeat Netanyahu.",
    },
    {
      id: "rf2",
      image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
      title: "Manufactured housing's affordability problem",
    },
    {
      id: "rf3",
      image: "https://images.unsplash.com/photo-1575517111478-7f6afd0973db?auto=format&fit=crop&w=400&q=80",
      title: "RFK Jr.'s Health Department leads Trump's push to add politicals to the federal workforce",
    },
  ];

  const videoStories = [
    {
      id: "v1",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80",
      title: "Abdul El-Sayed on AIPAC spending, 'Defund the Police' and why he's not a socialist",
    },
    {
      id: "v2",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=400&q=80",
      title: "How the Supreme Court Is Reshaping America's AI Boom",
    },
    {
      id: "v3",
      image: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=400&q=80",
      title: "Are Weather Forecasts Getting Worse Under Trump?",
    },
    {
      id: "v4",
      image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=400&q=80",
      title: "How Governor Kathy Hochul Is Shaping New York's Energy Future",
    },
    {
      id: "v5",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=400&q=80",
      title: "North Dakota leaders talk Trump & Teddy Roosevelt over bison burgers",
    },
  ];

  return (
    <section className="w-full font-sans my-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 items-start">
        
        {/* Left Column (3 cols): Story Stack */}
        <div className="lg:col-span-3 space-y-6 pr-0 lg:pr-3">
          {leftColumnStories.map((item, index) => (
            <article
              key={item.id}
              className={`group cursor-pointer space-y-2 ${
                index > 0 ? "pt-4 border-t border-gray-200" : ""
              }`}
            >
              <a href={`/news/${slugify(item.title)}`} className="block">
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden mb-2">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-sm font-extrabold leading-snug text-gray-900 group-hover:text-[#d32f2f] transition-colors font-sans">
                  {item.title}
                </h3>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider mt-1 font-sans">
                  {item.byline}
                </p>
              </a>
            </article>
          ))}
        </div>

        {/* Middle Column (6 cols): WHITE HOUSE Main Section */}
        <div className="lg:col-span-6 space-y-6 pt-6 lg:pt-0 lg:px-4">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-black">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
            <h2 className="text-xs font-black tracking-widest text-[#111111] uppercase font-sans">
              WHITE HOUSE
            </h2>
          </div>

          {/* Main Hero Lead Story for White House */}
          <article className="group cursor-pointer">
            <a href={`/news/${slugify("Like something out of Saturday Night Live: Ontario premier laughs off Lake America executive order")}`} className="block space-y-3">
              <div className="aspect-[16/9] bg-gray-100 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1575517111478-7f6afd0973db?auto=format&fit=crop&w=1000&q=80"
                  alt="Ontario premier Doug Ford"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight text-gray-900 group-hover:text-[#d32f2f] transition-colors tracking-tight font-sans">
                'Like something out of 'Saturday Night Live': Ontario premier laughs off 'Lake America' executive order
              </h1>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider font-sans">
                  BY CHEYANNE M. DANIELS
                </p>
                <SaveShareButtons title="Like something out of Saturday Night Live: Ontario premier laughs off Lake America executive order" size="sm" />
              </div>
            </a>
          </article>

          {/* 3 Stacked Horizontal Story Items */}
          <div className="divide-y divide-gray-200 pt-2">
            {whiteHouseSubStories.map((item) => (
              <article key={item.id} className="py-4 first:pt-0 group cursor-pointer">
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

        {/* Right Column (3 cols): Features, Video List & News Tip Box */}
        <div className="lg:col-span-3 space-y-8 pt-6 lg:pt-0 pl-0 lg:pl-3">
          {/* Top Feature Articles */}
          <div className="space-y-4">
            {rightFeatureStories.map((item, idx) => (
              <article
                key={item.id}
                className={`group cursor-pointer ${
                  idx > 0 ? "pt-3 border-t border-gray-200" : ""
                }`}
              >
                <a href={`/news/${slugify(item.title)}`} className="flex items-start gap-3">
                  <div className="w-16 aspect-[4/3] bg-gray-100 shrink-0 overflow-hidden">
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

          {/* VIDEO Section */}
          <div>
            <div className="flex items-center gap-2 pb-2 mb-3 border-b-2 border-black">
              <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
              <h2 className="text-xs font-black tracking-widest text-[#111111] uppercase font-sans">
                VIDEO
              </h2>
            </div>
            <div className="space-y-3">
              {videoStories.map((item) => (
                <article key={item.id} className="group cursor-pointer">
                  <a href={`/news/${slugify(item.title)}`} className="flex items-start gap-3">
                    <div className="w-20 aspect-[4/3] bg-gray-100 shrink-0 overflow-hidden relative group">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full bg-[#d32f2f] text-white flex items-center justify-center shadow-xs">
                          <Play size={10} className="ml-0.5 fill-white" />
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xs font-bold leading-snug text-gray-900 group-hover:text-[#d32f2f] transition-colors font-sans flex-1">
                      {item.title}
                    </h3>
                  </a>
                </article>
              ))}
            </div>
          </div>

          {/* Have a News Tip Box */}
          <div className="border border-gray-200 p-4 bg-[#fcfcfc] space-y-1.5 font-sans">
            <h4 className="text-sm font-extrabold text-gray-900 font-sans">
              Have a news tip?
            </h4>
            <p className="text-xs text-gray-600 font-serif leading-snug">
              Contact POLITICO reporters and provide materials in an anonymous and secure way.{" "}
              <a href="#" className="font-bold text-black hover:underline">
                Learn more »
              </a>
            </p>
          </div>

          {/* POLITICO Pro Banner */}
          <div className="border border-gray-200 p-4 bg-white space-y-1 font-sans">
            <span className="text-lg font-black text-[#d32f2f] block uppercase tracking-tight font-sans">
              POLITICO<span className="text-gray-900">PRO</span>
            </span>
            <p className="text-xs text-gray-600 font-serif leading-snug">
              Exclusive news, intelligence and tools for professionals on the front lines of policy.{" "}
              <a href="#" className="font-bold text-black hover:underline">
                Learn more »
              </a>
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
