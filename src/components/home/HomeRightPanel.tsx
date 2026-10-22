import React from "react";
import { slugify } from "@/data/newsArticles";
import { getArticlesByPlacement } from "@/lib/articleService";
import { formatPublishDate } from "@/utils/dateFormatter";
import AdvertisementSlot from "@/components/common/AdvertisementSlot";

export default async function HomeRightPanel() {
  let dbArticles = await getArticlesByPlacement("Home - Right Panel", 4);

  const fallbackArticles = [
      { id: 997, title: "Trump threatens to impose 'serious tariffs' on Europe if Canada joins EU as associate member", slug: "trump-threatens-tariffs", writer_name: "JALEN BECKFORD", image: "https://picsum.photos/seed/6/800/600" },
      { id: 998, title: "House passes Russia sanctions bill, handing Trump more leverage against Moscow", slug: "house-passes-russia-sanctions", writer_name: "WRITER" },
      { id: 999, title: "House passes Russia sanctions bill, handing Trump more leverage against Moscow 2", slug: "house-passes-russia-sanctions-2", writer_name: "GISELLE RUBIYYIH EWING", deck: "The vote ends a nearly two-year pause in Ukraine assistance from Congress." },
      { id: 1000, title: "House overwhelmingly passes bill to shield ratepayers from data centers", slug: "house-overwhelmingly-passes-bill", writer_name: "MICO PORTUONDO AND AMELIA DAVIDSON" }
  ] as any[];

  let articles = [...(dbArticles || [])];
  
  let fallbackIndex = 0;
  while (articles.length < 4 && fallbackIndex < fallbackArticles.length) {
    articles.push(fallbackArticles[fallbackIndex]);
    fallbackIndex++;
  }

  const mainStory = articles[0];
  const story2 = articles[1];
  const story3 = articles[2];
  const story4 = articles[3];

  return (
    <div className="space-y-4 xl:sticky xl:top-[80px] xl:self-start">
      {/* Article 1: Sticky along with whole panel on desktop (xl:), scrolls naturally on laptop (lg:max-xl:) */}
      {mainStory && (
        <a href={`/news/${mainStory.slug || slugify(mainStory.title)}`} className="group cursor-pointer mb-6 border-b border-gray-200 pb-4 block">
          <div className="w-full aspect-video bg-gray-200 mb-3 overflow-hidden">
            <img src={mainStory.image || `https://picsum.photos/seed/${mainStory.id}/800/600`} alt={mainStory.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
          </div>
          <h3 className="text-[17px] font-bold leading-[1.1] tracking-[-0.02em] text-[#111111] group-hover:text-[#d32f2f] transition-colors mb-2 font-sans line-clamp-2 overflow-hidden text-ellipsis break-words [word-break:break-word]">
            {mainStory.title}
          </h3>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-sans">
            BY {mainStory.writer_name} <span className="mx-1">|</span> {formatPublishDate(mainStory.updated_at || mainStory.created_at)}
          </div>
        </a>
      )}

      {/* Article 2: Sticky along with whole panel on desktop (xl:), scrolls naturally on laptop (lg:max-xl:) */}
      {story2 && (
        <a href={`/news/${story2.slug || slugify(story2.title)}`} className="group cursor-pointer border-b border-gray-200 pb-4 block">
          <h3 className="text-[17px] font-bold leading-[1.2] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans line-clamp-2 overflow-hidden text-ellipsis break-words [word-break:break-word]">
            {story2.title}
          </h3>
        </a>
      )}
      
      {/* Last 2 Articles + Ad 01: Sticky on laptop mode (lg:max-xl:sticky lg:max-xl:top-[80px]) and part of full sticky on desktop mode */}
      <div className="lg:max-xl:sticky lg:max-xl:top-[80px] lg:max-xl:self-start lg:max-xl:z-10 bg-white space-y-4 pt-1">
        {story3 && (
          <a href={`/news/${story3.slug || slugify(story3.title)}`} className="group cursor-pointer border-b border-gray-100 pb-4 block">
            <h3 className="text-[17px] font-bold leading-[1.2] text-[#111111] group-hover:text-[#d32f2f] transition-colors mb-2 font-sans line-clamp-2 overflow-hidden text-ellipsis break-words [word-break:break-word]">
              {story3.title}
            </h3>
            {story3.deck && (
              <p className="text-[13px] leading-[1.3] text-[#333333] font-sans mb-2 line-clamp-2 overflow-hidden text-ellipsis break-words">
                {story3.deck}
              </p>
            )}
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-sans">
              BY {story3.writer_name} <span className="mx-1">|</span> {formatPublishDate(story3.updated_at || story3.created_at)}
            </div>
          </a>
        )}

        {story4 && (
          <a href={`/news/${story4.slug || slugify(story4.title)}`} className="group cursor-pointer border-b border-gray-100 pb-4 block last:border-0">
            <h3 className="text-[17px] font-bold leading-[1.2] text-[#111111] group-hover:text-[#d32f2f] transition-colors mb-2 font-sans line-clamp-2 overflow-hidden text-ellipsis break-words [word-break:break-word]">
              {story4.title}
            </h3>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-sans">
              BY {story4.writer_name} <span className="mx-1">|</span> {formatPublishDate(story4.updated_at || story4.created_at)}
            </div>
          </a>
        )}

        {/* Ad 01 pinned right below the last 2 articles */}
        <div className="w-full border-t border-gray-200 pt-4 flex justify-center">
          <AdvertisementSlot variant="square" dimensions="300 x 250" label="Ad 01" className="!my-0" />
        </div>
      </div>
    </div>
  );
}
