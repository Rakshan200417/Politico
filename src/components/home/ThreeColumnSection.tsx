import React from "react";
import { slugify } from "@/data/newsArticles";

export default function ThreeColumnSection() {
  return (
    <div className="w-full">
      <h2 className="text-[12px] font-black tracking-widest text-[#ce1126] uppercase mb-4 border-b border-gray-300 pb-1 text-center">
        FEATURED NEWS
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)_320px] gap-6 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
        
        {/* Left Column */}
        <div className="pt-4 lg:pt-0 lg:pr-6 flex flex-col gap-6">
          <article className="group cursor-pointer">
            <a href={`/news/${slugify("New advancements in AI shake up the industry")}`} className="block">
              <div className="text-[12px] font-bold text-[#ce1126] mb-1">TECH</div>
              <h3 className="text-xl font-bold leading-tight group-hover:text-[#ce1126] transition-colors mb-2">
                New advancements in AI shake up the industry
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Experts predict significant changes in how companies operate over the next decade.
              </p>
              <div className="text-xs text-gray-500 uppercase font-bold">By Staff • 2h ago</div>
            </a>
          </article>
          <article className="group cursor-pointer">
            <a href={`/news/${slugify("Global markets react to recent economic policies")}`} className="block">
              <div className="text-[12px] font-bold text-[#ce1126] mb-1">MARKETS</div>
              <h3 className="text-lg font-bold leading-tight group-hover:text-[#ce1126] transition-colors mb-2">
                Global markets react to recent economic policies
              </h3>
              <div className="text-xs text-gray-500 uppercase font-bold">By Finance Team • 4h ago</div>
            </a>
          </article>
          <article className="group cursor-pointer">
            <a href={`/news/${slugify("Funding rounds reach new highs this quarter")}`} className="block">
              <div className="text-[12px] font-bold text-[#ce1126] mb-1">STARTUPS</div>
              <h3 className="text-lg font-bold leading-tight group-hover:text-[#ce1126] transition-colors mb-2">
                Funding rounds reach new highs this quarter
              </h3>
              <div className="text-xs text-gray-500 uppercase font-bold">By Tech Desk • 6h ago</div>
            </a>
          </article>
        </div>

        {/* Center Column */}
        <div className="pt-4 lg:pt-0 lg:px-6 flex flex-col">
          <article className="group cursor-pointer">
            <a href={`/news/${slugify("Major corporations shift focus to sustainable practices")}`} className="block">
              <div className="relative w-full h-[300px] mb-4 bg-gray-100 overflow-hidden">
                <img
                  src="https://loremflickr.com/900/600/business"
                  alt="Business meeting"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="text-[12px] font-bold text-[#ce1126] mb-2">COMPANIES</div>
              <h3 className="text-3xl font-bold leading-tight group-hover:text-[#ce1126] transition-colors mb-3">
                Major corporations shift focus to sustainable practices
              </h3>
              <p className="text-base text-gray-700 mb-4 line-clamp-3">
                In a surprising move, several Fortune 500 companies have announced a joint initiative to reduce carbon footprints and invest heavily in renewable energy sources by 2030.
              </p>
              <div className="text-xs text-gray-500 uppercase font-bold">By Business Editor • 1h ago</div>
            </a>
          </article>
        </div>

        {/* Right Column */}
        <div className="pt-4 lg:pt-0 lg:pl-6 flex flex-col gap-6">
          <article className="group cursor-pointer">
            <a href={`/news/${slugify("Inflation rates show unexpected signs of cooling")}`} className="block">
              <div className="relative w-full h-[180px] mb-3 bg-gray-100 overflow-hidden">
                <img
                  src="https://loremflickr.com/600/400/economy"
                  alt="Finance graph"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="text-[12px] font-bold text-[#ce1126] mb-1">ECONOMY</div>
              <h3 className="text-lg font-bold leading-tight group-hover:text-[#ce1126] transition-colors mb-2">
                Inflation rates show unexpected signs of cooling
              </h3>
              <div className="text-xs text-gray-500 uppercase font-bold">By Economy Team • 3h ago</div>
            </a>
          </article>
          <article className="group cursor-pointer">
            <a href={`/news/${slugify("Interview: The CEO changing the retail landscape")}`} className="block">
              <div className="text-[12px] font-bold text-[#ce1126] mb-1">LEADERS</div>
              <h3 className="text-md font-bold leading-tight group-hover:text-[#ce1126] transition-colors mb-2">
                Interview: The CEO changing the retail landscape
              </h3>
              <div className="text-xs text-gray-500 uppercase font-bold">By Staff • 5h ago</div>
            </a>
          </article>
        </div>

      </div>
    </div>
  );
}
