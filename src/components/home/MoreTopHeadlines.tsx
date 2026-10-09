import React from "react";
import { slugify } from "@/data/newsArticles";
import { formatPublishDate } from "@/utils/dateFormatter";
import SaveShareButtons from "@/components/common/SaveShareButtons";
import { getArticlesByPlacement } from "@/lib/articleService";

export default async function MoreTopHeadlines() {
  let dbArticles = await getArticlesByPlacement("Home - More Top Headlines", 5);

  const fallbackArticles = [
    {
      id: 851,
      title: "Treasury offers Chalmers an AI productivity prize — with strings attached",
      writer_name: "RYAN HEATH",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
      category: "Economy"
    },
    {
      id: 852,
      title: "Bessent's G20 pitch collides with anxieties over US debt and Iran war",
      writer_name: "MICHAEL STRATFORD",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
      category: "Finance"
    },
    {
      id: 853,
      title: "MAHA has arrived in Iowa — and Big Ag is reeling",
      writer_name: "ELLIE BORST",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
      category: "Agriculture"
    },
    {
      id: 854,
      title: "California Dems hand Newsom rare defeat on wildfires",
      writer_name: "NOAH BAUSTIN",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
      category: "Politics"
    },
    {
      id: 855,
      title: "The House is back in session. Many Republicans hope it won’t be for long.",
      writer_name: "MIA MCCARTHY",
      image: "https://images.unsplash.com/photo-1521790797524-b2497295b8a0?auto=format&fit=crop&w=1200&q=80",
      category: "Politics"
    }
  ] as any[];

  let articles = [...(dbArticles || [])];
  let fallbackIndex = 0;
  while (articles.length < 5 && fallbackIndex < fallbackArticles.length) {
    articles.push(fallbackArticles[fallbackIndex]);
    fallbackIndex++;
  }

  const top1 = articles[0];
  const top2 = articles[1];
  const secondaryStories = articles.slice(2, 5);

  return (
    <div className="w-full font-sans border-t border-[#d9d9d9] pt-4">
      <div className="flex items-center gap-2 pb-2 mb-4 border-b border-[#d9d9d9]">
        <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block" />
        <h2 className="text-[9px] font-bold tracking-[0.12em] text-[#222222] uppercase font-sans">
          MORE TOP HEADLINES
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {top1 && (
          <article className="group cursor-pointer">
            <a href={`/news/${slugify(top1.title)}`} className="block space-y-2.5">
              <div className="aspect-[16/10] bg-gray-100 overflow-hidden">
                <img
                  src={top1.image}
                  alt={top1.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-[16px] lg:text-[18px] font-bold leading-[1.05] text-[#222222] group-hover:text-[#d32f2f] transition-colors tracking-tight font-sans">
                {top1.title}
              </h3>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider font-sans">
                  BY {top1.writer_name} <span className="mx-1">|</span> {formatPublishDate(top1.updated_at || top1.created_at)}
                </p>
                <SaveShareButtons
                  title={top1.title}
                  slug={slugify(top1.title)}
                  image={top1.image}
                  category={top1.category || "News"}
                  byline={top1.writer_name}
                  size="sm"
                />
              </div>
            </a>
          </article>
        )}

        {top2 && (
          <article className="group cursor-pointer">
            <a href={`/news/${slugify(top2.title)}`} className="block space-y-2.5">
              <div className="aspect-[16/10] bg-gray-100 overflow-hidden">
                <img
                  src={top2.image}
                  alt={top2.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-[16px] lg:text-[18px] font-bold leading-[1.05] text-[#222222] group-hover:text-[#333333] transition-colors tracking-tight font-sans">
                {top2.title}
              </h3>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider font-sans">
                  BY {top2.writer_name} <span className="mx-1">|</span> {formatPublishDate(top2.updated_at || top2.created_at)}
                </p>
                <SaveShareButtons
                  title={top2.title}
                  slug={slugify(top2.title)}
                  image={top2.image}
                  category={top2.category || "News"}
                  byline={top2.writer_name}
                  size="sm"
                />
              </div>
            </a>
          </article>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 pb-2">
        {secondaryStories.map((story, index) => (
          <article key={index} className="group cursor-pointer border-t border-gray-200 pt-4">
            <a href={`/news/${slugify(story.title)}`} className="block space-y-2.5">
              <div className="aspect-[16/10] bg-gray-100 overflow-hidden">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-[18px] lg:text-[20px] font-extrabold leading-snug text-gray-900 group-hover:text-[#d32f2f] transition-colors tracking-tight font-sans">
                {story.title}
              </h3>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider font-sans">
                BY {story.writer_name}
              </p>
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
