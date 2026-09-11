import React from "react";
import { slugify } from "@/data/newsArticles";
import SaveShareButtons from "@/components/common/SaveShareButtons";

export default function TopNewsGrid() {
  const story1 = "‘Don’t take this one for granted’: New Hampshire Democrats brace for a tough Senate race";
  const story2 = "Susan Collins says the White House has ‘underestimated’ impact of Canada tariffs";
  const story3 = "Trump hits back at Canada with import bans, more tariff hikes";
  const story4 = "‘Very Hard to See How This Ends’";

  return (
    <div className="w-full font-sans">
      <div className="flex items-center gap-2 pb-2 mb-4 border-b border-[#d9d9d9]">
        <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block" />
        <h2 className="text-[9px] font-bold tracking-[0.12em] text-[#222222] uppercase font-sans">
          TOP NEWS
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        {/* Main Article */}
        <article className="group cursor-pointer">
          <a href={`/news/${slugify(story1)}`} className="block">
            <h1 className="text-[44px] sm:text-[52px] lg:text-[60px] font-bold leading-[0.95] tracking-[-0.03em] text-[#111111] group-hover:text-[#333333] transition-colors duration-150 mb-3 font-sans">
              {story1}
            </h1>
            
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.18em] font-sans">
                BY LISA KASHINSKY
              </p>
              <SaveShareButtons
                title={story1}
                slug={slugify(story1)}
                image="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1400&q=80"
                category="Congress"
                byline="LISA KASHINSKY"
                size="sm"
              />
            </div>

            <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100 mb-4">
              <img
                src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1400&q=80"
                alt="Main story"
                className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          </a>
        </article>

        {/* Medium headline */}
        <article className="group cursor-pointer border-t border-[#e3e3e3] pt-4 mb-2">
          <a href={`/news/${slugify(story2)}`} className="block">
            <h3 className="text-[22px] lg:text-[24px] font-bold leading-[1.05] tracking-[-0.02em] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans mb-1">
              {story2}
            </h3>
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.18em] font-sans">
                BY JESSICA PIPER
              </p>
              <SaveShareButtons
                title={story2}
                slug={slugify(story2)}
                category="Markets"
                byline="JESSICA PIPER"
                size="sm"
              />
            </div>
          </a>
        </article>

        {/* Two smaller stories side-by-side */}
        <div className="grid grid-cols-2 gap-4 border-t border-[#e3e3e3] pt-4">
          <article className="group cursor-pointer">
            <a href={`/news/${slugify(story3)}`} className="block space-y-2">
              <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80"
                  alt="Story 1"
                  className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                />
              </div>
              <h3 className="text-[14px] lg:text-[15px] font-bold leading-[1.1] tracking-[-0.01em] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans">
                {story3}
              </h3>
            </a>
          </article>

          <article className="group cursor-pointer">
            <a href={`/news/${slugify(story4)}`} className="block space-y-2">
              <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80"
                  alt="Story 2"
                  className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                />
              </div>
              <h3 className="text-[14px] lg:text-[15px] font-bold leading-[1.1] tracking-[-0.01em] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans">
                {story4}
              </h3>
            </a>
          </article>
        </div>

      </div>
    </div>
  );
}
