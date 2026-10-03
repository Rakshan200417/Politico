import React from "react";
import { getPublishedArticlesByCategory } from "@/lib/articleService";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const WORLD_REGIONS = [
  "China",
  "United States",
  "Europe",
  "Britain",
  "Middle East",
  "Africa",
  "Asia"
];

async function RegionSection({ region }: { region: string }) {
  let articles = await getPublishedArticlesByCategory(region, 4);

  if (!articles || articles.length === 0) {
    // Generate beautiful mock fallback data for empty regions
    const mockArticles = Array.from({ length: 4 }).map((_, i) => ({
      id: 900 + i,
      slug: `mock-${region.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      title: `${region} Update: Major Developments By Lucas Thompson Part ${i + 1}`,
      writer_name: 'LUCAS THOMPSON',
      image: `https://picsum.photos/seed/${region.replace(/\s+/g, '')}${i}/800/600`
    })) as any;
    articles = mockArticles;
  }

  return (
    <div className="w-full mb-12 border-t border-gray-200 pt-8 first:border-t-0 first:pt-0">
      <div className="flex items-center gap-2 pb-2 mb-6 border-b border-[#d9d9d9]">
        <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
        <h2 className="text-[12px] font-extrabold tracking-[0.12em] text-[#222222] uppercase font-sans">
          {region}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.map((article: any) => (
          <a key={article.id} href={`/news/${article.slug}`} className="group cursor-pointer block flex flex-col">
            <div className="w-full aspect-[4/3] bg-gray-200 mb-3 overflow-hidden">
              <img 
                src={article.image || `https://picsum.photos/seed/${article.id}/800/600`} 
                alt={`${region} News`} 
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
      </div>
    </div>
  );
}

export default function WorldCategoryPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />
      <main className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-8">
        <h1 className="text-[40px] font-sans text-[#111] sm:text-[48px] mb-2 text-center font-bold">
          World News
        </h1>
        <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
          Latest international news, analysis, and updates from around the globe.
        </p>
        
        {WORLD_REGIONS.map(region => (
          <RegionSection key={region} region={region} />
        ))}
      </main>
      <Footer />
    </div>
  );
}
