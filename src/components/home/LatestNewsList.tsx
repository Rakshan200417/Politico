import React from "react";
import { slugify } from "@/data/newsArticles";

interface LatestNewsItem {
  id: string;
  title: string;
  time?: string;
  isRedTime?: boolean;
  isSponsored?: boolean;
  sponsor?: string;
}

import { getArticlesByPlacement, getLatestPublishedArticles } from "@/lib/articleService";
import { formatPublishDate } from "@/utils/dateFormatter";

export default async function LatestNewsList() {
  let articles = await getArticlesByPlacement("Home - Latest News", 10);
  
  if (!articles || articles.length === 0) {
    articles = await getLatestPublishedArticles(10, true);
  }

  // Generate some times for display purposes
  const getDisplayTime = (index: number) => {
    if (index === 0) return "15m";
    if (index === 1) return "1h";
    if (index === 2) return "2h";
    return "";
  };

  // Pad to 10 articles if needed
  const mockTitles = [
    "Senate Committee Approves New Cybersecurity Legislation",
    "Global Markets React to Unprecedented Tech Merger",
    "Climate Accord Reaches Critical Milestone at Geneva Summit",
    "A proven kidney treatment exists. It's time to expand US access",
    "Supreme Court Issues Ruling on Contentious State Boundary Dispute",
    "New Breakthrough in Quantum Computing Announced by Researchers",
    "Major Retailer Announces Closure of 500 Stores Nationwide",
    "Diplomatic Talks Resume Between Rival Nations After Decade Gap",
    "FDA Approves Innovative New Alzheimer's Treatment Protocol",
    "Voter Turnout Reaches Historic Highs in Early Voting Returns"
  ];

  let displayArticles = [...(articles || [])];
  let mockIndex = 0;
  while (displayArticles.length < 10 && mockIndex < mockTitles.length) {
    displayArticles.push({
      id: `mock-${mockIndex}`,
      title: mockTitles[mockIndex],
      slug: slugify(mockTitles[mockIndex]),
      is_sponsored: mockIndex === 3,
      tags: '[]',
      writer_name: mockIndex === 3 ? "Fresenius Medical Care" : "Politico Staff"
    } as any);
    mockIndex++;
  }

  return (
    <aside className="w-full pr-0 lg:pr-3 font-sans">
      {/* Section Header with Red Circle Indicator */}
      <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#d9d9d9]">
        <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
        <h2 className="text-[10px] font-extrabold tracking-[0.12em] text-[#222222] uppercase font-sans">
          LATEST NEWS
        </h2>
      </div>

      {/* News List */}
      <div className="divide-y divide-[#e5e5e5]">
        {displayArticles.map((item, index) => {
          const isSponsored = item.is_sponsored || (item as any).isSponsored || (item.tags && typeof item.tags === 'string' ? item.tags.includes("sponsored") : Array.isArray(item.tags) && item.tags.includes("sponsored"));
          return (
            <article key={item.id} className="group cursor-pointer">
              <div className="py-3 block relative">
                <a href={`/news/${item.slug || slugify(item.title)}`} className="flex items-start gap-4">
                  <span
                    className={`text-[11px] font-extrabold shrink-0 min-w-[24px] pt-1 ${index === 0 ? "text-[#d32f2f]" : "text-gray-500"}`}
                  >
                    {getDisplayTime(index)}
                  </span>
                  <div>
                    <h3 className="text-[15px] font-bold leading-[1.3] text-[#222222] font-sans group-hover:text-[#d32f2f] transition-colors">
                      {item.title}
                    </h3>
                    
                    {/* Default timestamp (hidden on hover if sponsored) */}
                    <p className={`text-[9px] font-bold uppercase tracking-widest text-gray-500 mt-2 font-sans ${isSponsored ? 'group-hover:hidden' : ''}`}>
                      {formatPublishDate(item.updated_at || item.created_at)}
                    </p>
                    
                    {/* Hover expanded state for sponsored */}
                    {isSponsored && (
                      <div className="hidden group-hover:block mt-3 bg-gray-50 p-3 rounded border border-gray-100 transition-all">
                        <div className="text-[10px] font-extrabold text-[#00609d] uppercase tracking-[0.15em] mb-1 font-sans">
                          SPONSORED CONTENT
                        </div>
                        <div className="text-[10px] text-[#767676] font-semibold font-sans">
                          Sponsored by {item.writer_name || "Partner"}
                        </div>
                      </div>
                    )}
                  </div>
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </aside>
  );
}

