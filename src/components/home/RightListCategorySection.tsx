import { getPublishedArticlesByCategory, getLatestPublishedArticles } from "@/lib/articleService";
import { slugify } from "@/data/newsArticles";

export default async function RightListCategorySection({ category, isMostRead = false }: { category: string, isMostRead?: boolean }) {
  let articles;
  
  if (isMostRead) {
    articles = await getLatestPublishedArticles(4);
  } else {
    articles = await getPublishedArticlesByCategory(category, 4);
  }

  if (!articles || articles.length === 0) {
    // Mock fallback
    articles = [
      { id: 801, title: `Mock article 1 for ${category}`, slug: 'mock-1', image: `https://picsum.photos/seed/${category}1/800/600` },
      { id: 802, title: `Mock article 2 for ${category}`, slug: 'mock-2', image: `https://picsum.photos/seed/${category}2/800/600` },
      { id: 803, title: `Mock article 3 for ${category}`, slug: 'mock-3', image: `https://picsum.photos/seed/${category}3/800/600` },
      { id: 804, title: `Mock article 4 for ${category}`, slug: 'mock-4', image: `https://picsum.photos/seed/${category}4/800/600` },
    ] as any;
  }

  return (
    <div className="w-full border-t border-gray-200 pt-6">
      <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#d9d9d9]">
        <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
        <h2 className="text-[10px] font-extrabold tracking-[0.12em] text-[#222222] uppercase font-sans">
          {isMostRead ? "MOST READ" : category}
        </h2>
      </div>
      
      {isMostRead && articles.length > 0 && (
        <a href={`/news/${articles[0].slug || slugify(articles[0].title)}`} className="group cursor-pointer mb-6 block border-b border-gray-200 pb-4">
          <div className="w-full aspect-video bg-gray-200 mb-3 overflow-hidden">
            <img src={articles[0].image || `https://picsum.photos/seed/${articles[0].id}/800/600`} alt={articles[0].title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
          </div>
        </a>
      )}

      <ul className="space-y-4">
        {articles.map((article: any, index: number) => {
          if (isMostRead && index === 0) return null; // Skip first item for most read as it is featured above

          return (
            <li key={article.id} className={`flex gap-4 group cursor-pointer items-start border-b border-gray-100 pb-4 ${!isMostRead ? "pt-4 border-t first:border-0 first:pt-0 pb-0 border-b-0" : ""}`}>
              {isMostRead ? (
                <span className="text-[#d32f2f] font-bold text-[14px] mt-0.5">{index}</span>
              ) : (
                <div className="w-[80px] h-[55px] bg-gray-200 shrink-0 overflow-hidden relative">
                   <img src={article.image || `https://picsum.photos/seed/${article.id}/800/600`} alt={article.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                </div>
              )}
              <h3 className="text-[14px] font-bold leading-[1.2] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans mt-1">
                <a href={`/news/${article.slug || slugify(article.title)}`} className="block">
                  {article.title}
                </a>
              </h3>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
