import React from "react";
import { getPublishedArticlesByCategory } from "@/lib/articleService";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import AdvertisementSlot from "@/components/common/AdvertisementSlot";

const WORLD_REGIONS = [
  "World",
  "China",
  "United States",
  "Europe",
  "Britain",
  "Middle East",
  "Africa",
  "Asia"
];

async function MoreWorldNews() {
  let { articles } = await getPublishedArticlesByCategory("World", 12, true, 2);

  if (!articles || articles.length === 0) {
    const mockArticles = Array.from({ length: 4 }).map((_, i) => ({
      id: 800 + i,
      slug: `mock-world-news-${i}`,
      title: `Global Update: Important International Development Part ${i + 1}`,
      writer_name: 'POLITICO STAFF',
      image: `https://picsum.photos/seed/moreworld${i}/800/600`,
    })) as any;
    articles = mockArticles;
  }

  return (
    <>
      {articles.map((article: any) => (
        <a key={article.id} href={`/news/${article.slug}`} className="group cursor-pointer block flex flex-col">
          <div className="w-full aspect-[4/3] bg-gray-200 mb-3 overflow-hidden">
            <img 
              src={article.image || `https://picsum.photos/seed/${article.id}/800/600`} 
              alt="More World News" 
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" 
            />
          </div>
          <h3 className="text-[16px] font-bold leading-[1.2] tracking-[-0.01em] text-[#111111] group-hover:text-[#d32f2f] transition-colors mb-2 font-sans flex-1">
            {article.title}
          </h3>
          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 font-sans mt-auto">
            BY {article.writer_name}
          </p>
        </a>
      ))}
    </>
  );
}

async function RegionSection({ region }: { region: string }) {
  let { articles } = await getPublishedArticlesByCategory(region, 4);

  if (!articles || articles.length === 0) {
    const mockArticles = Array.from({ length: 4 }).map((_, i) => ({
      id: 900 + i,
      slug: `mock-${region.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      title: `${region} Update: Major Developments By Lucas Thompson Part ${i + 1}`,
      deck: `This is a simulated deck describing the latest developments in ${region} affecting global markets and policies.`,
      writer_name: 'LUCAS THOMPSON',
      image: `https://picsum.photos/seed/${region.replace(/\s+/g, '')}${i}/800/600`,
      updated_at: new Date().toISOString()
    })) as any;
    articles = mockArticles;
  }

  const leadArticle = articles[0];
  const sideArticles = articles.slice(1, 4);

  return (
    <div className="w-full mb-16 border-t border-gray-200 pt-8 first:border-t-0 first:pt-0">
      <div className="flex items-center gap-2 pb-2 mb-6 border-b border-[#d9d9d9]">
        <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
        <h2 className="text-[14px] font-extrabold tracking-[0.12em] text-[#222222] uppercase font-sans">
          {region}
        </h2>
      </div>

      <section className="grid gap-8 lg:grid-cols-[5fr_4fr] lg:gap-12">
        {/* Left: Lead Article */}
        {leadArticle && (
          <article>
            <a href={`/news/${leadArticle.slug}`} className="block group">
              <h2 className="text-[34px] font-sans font-bold leading-[1.05] tracking-[-0.01em] text-[#111] group-hover:text-[#d71920] sm:text-[42px]">
                {leadArticle.title}
              </h2>
              <p className="mt-4 font-serif text-[18px] leading-[1.4] text-[#555] sm:text-[20px]">{leadArticle.deck || ''}</p>
              <div className="mt-4 mb-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#666]">
                  BY {leadArticle.writer_name}
                </p>
              </div>
              <div className="aspect-[4/3] sm:aspect-[16/9] w-full overflow-hidden bg-[#f2f2f2]">
                <img src={leadArticle.image || `https://picsum.photos/seed/${leadArticle.id}/800/600`} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
              </div>
            </a>
          </article>
        )}

        {/* Right: Side Stories */}
        <aside className="flex flex-col gap-8 lg:pl-2 lg:pt-[20px]">
          {sideArticles.map((story: any) => (
            <article key={story.id} className="border-b border-[#e1e1e1] pb-8 last:border-0 last:pb-0">
              <a href={`/news/${story.slug}`} className="grid grid-cols-[48%_minmax(0,1fr)] gap-6 group">
                <div className="aspect-[3/2] overflow-hidden bg-[#f2f2f2]">
                  <img src={story.image || `https://picsum.photos/seed/${story.id}/800/600`} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
                </div>
                <div>
                  <h3 className="text-[20px] font-sans font-bold leading-[1.1] text-[#111] group-hover:text-[#d71920] sm:text-[24px]">
                    {story.title}
                  </h3>
                  <div className="mt-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#666]">
                      BY {story.writer_name}
                    </p>
                  </div>
                </div>
              </a>
            </article>
          ))}
        </aside>
      </section>
    </div>
  );
}

export default function WorldCategoryPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />
      <main className="mx-auto w-full max-w-[1080px] px-4 py-8 sm:px-6">
        {/* Top Banner Advertisement */}
        <div className="pt-6 pb-6 border-b border-[#ededed] mb-8">
          <AdvertisementSlot />
        </div>
        <h1 className="text-[40px] font-sans text-[#111] sm:text-[48px] mb-2 text-center font-bold">
          World News
        </h1>
        <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
          Latest international news, analysis, and updates from around the globe.
        </p>
        
        {WORLD_REGIONS.map(region => (
          <RegionSection key={region} region={region} />
        ))}

        <div className="mt-16 w-full mb-12 border-t border-gray-200 pt-8">
          <div className="flex items-center gap-2 pb-2 mb-6 border-b border-[#d9d9d9]">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
            <h2 className="text-[14px] font-extrabold tracking-[0.12em] text-[#222222] uppercase font-sans">
              MORE WORLD NEWS
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <MoreWorldNews />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
