import { getPublishedArticlesByCategory } from "@/lib/articleService";

export default async function WorldHomeSection() {
  let { articles } = await getPublishedArticlesByCategory("World", 12);

  if (!articles || articles.length === 0) {
    const regions = ["Asia", "Middle East", "Europe", "Britain", "Africa", "China", "United States"];
    // Generate beautiful mock fallback data for empty World category
    const mockArticles = Array.from({ length: 12 }).map((_, i) => {
      const region = regions[i % regions.length];
      return {
        id: 900 + i,
        slug: `mock-${region.toLowerCase().replace(/\\s+/g, '-')}-${i}`,
        title: `Global Update: Major Developments By Lucas Thompson Part ${i + 1}`,
        writer_name: 'LUCAS THOMPSON',
        image: `https://picsum.photos/seed/world${i}/800/600`
      };
    }) as any;
    articles = mockArticles;
  }

  return (
    <div className="w-full mb-10 border-t border-gray-200 pt-8 first:border-t-0 first:pt-0">
      <div className="flex items-center gap-2 pb-2 mb-4 border-b border-[#d9d9d9]">
        <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
        <h2 className="text-[10px] font-extrabold tracking-[0.12em] text-[#222222] uppercase font-sans">
          WORLD
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {articles.map((article: any) => (
          <a key={article.id} href={`/news/${article.slug}`} className="group cursor-pointer block">
            <div className="w-full aspect-[4/3] bg-gray-200 mb-3 overflow-hidden">
              <img 
                src={article.image || `https://picsum.photos/seed/${article.id}/800/600`} 
                alt="World News" 
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" 
              />
            </div>
            <h3 className="text-[16px] sm:text-[18px] font-bold leading-[1.2] tracking-[-0.01em] text-[#111111] group-hover:text-[#d32f2f] transition-colors mb-2 font-sans">
              {article.title}
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 font-sans">
              BY {article.writer_name}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
