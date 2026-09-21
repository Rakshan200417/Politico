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

export default function LatestNewsList() {
  const latestNews: LatestNewsItem[] = [
    {
      id: "1",
      time: "15m",
      title: "Von der Leyen offers diagnosis but no cure on EU's ecological malaise",
      isRedTime: true,
    },
    {
      id: "2",
      title: "Democrats keep pressure on Hakeem Jeffries to punish rogue members",
    },
    {
      id: "3",
      title: "Left on brink of victory in Swedish election",
    },
    {
      id: "4",
      isSponsored: true,
      title: "A proven kidney treatment exists. It's time to expand US access",
      sponsor: "Fresenius Medical Care"
    },
    {
      id: "5",
      title: "Lee tells colleagues he's bullish on permitting deal",
    },
    {
      id: "6",
      title: "Paramount is looking for Nashville office space as it weighs leaving LA",
    },
    {
      id: "7",
      title: "Kamala Harris to join Abdul El-Sayed in Michigan next week",
    },
    {
      id: "8",
      title: "With hopes for crypto legislation dimming, Trump's regulators step into the fray",
    },
    {
      id: "9",
      title: "Susie Wiles says she is cancer-free 6 months after diagnosis",
    },
    {
      id: "10",
      title: "Key spy law could go dark if Congress doesn't act by November, Trump admin says",
    },
  ];

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
        {latestNews.map((item) => (
          <article key={item.id} className="group cursor-pointer">
            {item.isSponsored ? (
              <div className="py-4 block">
                <div className="text-[11px] font-extrabold text-[#00609d] uppercase tracking-[0.15em] mb-2 font-sans">
                  SPONSORED CONTENT
                </div>
                <h4 className="text-[15px] font-bold leading-[1.3] text-[#222222] mb-3 font-sans tracking-tight">
                  {item.title}
                </h4>
                <div className="text-[11px] text-[#767676] font-semibold font-sans">
                  Sponsored by {item.sponsor}
                </div>
              </div>
            ) : (
              <div className="py-3 block">
                <a href={`/news/${slugify(item.title)}`} className="flex items-start gap-4">
                  <span
                    className={`text-[11px] font-extrabold shrink-0 min-w-[24px] pt-1 ${item.isRedTime ? "text-[#d32f2f]" : "text-gray-500"}`}
                  >
                    {item.time || ""}
                  </span>
                  <h3 className="text-[15px] font-bold leading-[1.3] text-[#222222] font-sans">
                    {item.title}
                  </h3>
                </a>
              </div>
            )}
          </article>
        ))}
      </div>
    </aside>
  );
}
