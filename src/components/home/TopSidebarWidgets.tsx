import React from "react";
import { slugify } from "@/data/newsArticles";

export default function TopSidebarWidgets() {
  const leadHeadline = "Supreme Court allows Trump's ballroom construction, but Roberts says project is 'likely unlawful'";
  const stories = [
    {
      tag: "Exclusive",
      title: "White House bowing alley gets a $250K glow-up",
      author: "By Sophia Cai",
    },
    {
      tag: "",
      title: "Trump welcomes Russia back to the G20. Europe isn’t having it.",
      author: "By Michael Stratford and Rasmus Buchhave",
    },
    {
      tag: "",
      title: "Trade talks collapsed. Now Canada and the US are fighting over why.",
      author: "By Zi-Ann Lum",
    },
  ];

  return (
    <aside className="w-full font-sans pl-0 lg:pl-2">
      <div className="space-y-4 border-l border-gray-200 pl-4">
        <article className="group cursor-pointer">
          <a href={`/news/${slugify(leadHeadline)}`} className="block">
            <div className="overflow-hidden bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80"
                alt="Supreme Court headline"
                className="h-[260px] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </div>

            <h3 className="mt-3 text-[16px] font-bold leading-[1.02] tracking-[-0.02em] text-[#111111] group-hover:text-[#d32f2f] transition-colors">
              Supreme Court allows Trump&apos;s ballroom construction, but Roberts says project is &lsquo;likely unlawful&rsquo;
            </h3>

            <p className="mt-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#6b6b6b]">
              By Josh Gerstein
            </p>
          </a>
        </article>

        <div className="space-y-4 border-t border-[#e3e3e3] pt-4">
          {stories.map((story, index) => (
            <article key={index} className="group cursor-pointer border-b border-[#e3e3e3] pb-4 last:border-b-0 last:pb-0">
              <a href={`/news/${slugify(story.title)}`} className="block">
                {story.tag && (
                  <div className="mb-2 text-[9px] font-black uppercase tracking-[0.18em] text-[#111111]">
                    {story.tag}
                  </div>
                )}

                <h4 className="text-[14px] font-bold leading-[1.08] tracking-[-0.02em] text-[#111111] group-hover:text-[#d32f2f] transition-colors">
                  {story.title}
                </h4>

                <p className="mt-2 text-[9px] font-black uppercase tracking-[0.12em] text-[#6b6b6b]">
                  {story.author}
                </p>
              </a>
            </article>
          ))}
        </div>
      </div>
    </aside>
  );
}
