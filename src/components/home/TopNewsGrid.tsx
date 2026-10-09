import React from "react";
import { slugify } from "@/data/newsArticles";
import SaveShareButtons from "@/components/common/SaveShareButtons";
import { getArticlesByPlacement } from "@/lib/articleService";
import { formatPublishDate } from "@/utils/dateFormatter";

export default async function TopNewsGrid() {
  let dbArticles = await getArticlesByPlacement("Home - A+ Section", 4);

  const fallbackArticles = [
      { id: 991, title: "‘Don’t take this one for granted’: New Hampshire Democrats brace for a tough Senate race", slug: "dont-take-this-one-for-granted", writer_name: "LISA KASHINSKY", category: "Congress", image: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1400&q=80" },
      { id: 992, title: "Susan Collins says the White House has ‘underestimated’ impact of Canada tariffs", slug: "susan-collins-tariffs", writer_name: "WRITER", category: "Congress", image: "https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?auto=format&fit=crop&w=1200&q=80" },
      { id: 993, title: "Trump hits back at Canada with import bans, more tariff hikes", slug: "trump-canada-bans", writer_name: "WRITER", category: "Economy", image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80" },
      { id: 994, title: "‘Very Hard to See How This Ends’", slug: "hard-to-see-how-this-ends", writer_name: "WRITER", category: "World", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80" }
  ] as any[];

  let articles = [...(dbArticles || [])];
  
  let fallbackIndex = 0;
  while (articles.length < 4 && fallbackIndex < fallbackArticles.length) {
    articles.push(fallbackArticles[fallbackIndex]);
    fallbackIndex++;
  }

  const mainStory = articles[0];
  const smallStories = articles.slice(1, 4);

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
        {mainStory && (
          <article className="group cursor-pointer">
            <a href={`/news/${mainStory.slug || slugify(mainStory.title)}`} className="block">
              <h1 className="text-[44px] sm:text-[52px] lg:text-[60px] font-bold leading-[0.95] tracking-[-0.03em] text-[#111111] group-hover:text-[#333333] transition-colors duration-150 mb-3 font-sans">
                {mainStory.title}
              </h1>

              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.18em] font-sans">
                  BY {mainStory.writer_name} <span className="mx-1">|</span> {formatPublishDate(mainStory.updated_at || mainStory.created_at)}
                </p>
                <SaveShareButtons
                  title={mainStory.title}
                  slug={mainStory.slug || slugify(mainStory.title)}
                  image={mainStory.image || `https://picsum.photos/seed/${mainStory.id}/1400/800`}
                  category={mainStory.category || "News"}
                  byline={mainStory.writer_name}
                  size="sm"
                />
              </div>

              <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100 mb-4">
                <img
                  src={mainStory.image || `https://picsum.photos/seed/${mainStory.id}/1400/800`}
                  alt="Main story"
                  className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
            </a>
          </article>
        )}

        {/* Three smaller stories side-by-side */}
        {smallStories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#e3e3e3] pt-4 mt-2">
            {smallStories.map((story) => (
              <article key={story.id} className="group cursor-pointer">
                <a href={`/news/${story.slug || slugify(story.title)}`} className="block space-y-2">
                  <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                    <img
                      src={story.image || `https://picsum.photos/seed/${story.id}/800/600`}
                      alt={story.title}
                      className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-[14px] lg:text-[15px] font-bold leading-[1.1] tracking-[-0.01em] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans">
                    {story.title}
                  </h3>
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

