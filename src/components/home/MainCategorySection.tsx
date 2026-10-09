import { getPublishedArticlesByCategory } from "@/lib/articleService";
import { formatPublishDate } from "@/utils/dateFormatter";

export default async function MainCategorySection({ category, count = 4 }: { category: string, count?: number }) {
  let { articles } = await getPublishedArticlesByCategory(category, count, true);

  if (!articles || articles.length === 0) {
    articles = [];
  }
  
  if (articles.length < count) {
    const fallbackArticles = Array.from({ length: count }).map((_, i) => ({
      id: 900 + i + 1,
      slug: `mock-${i + 1}`,
      title: `New developments in ${category} shake the industry ${i + 1}`,
      writer_name: 'Writer',
      image: `https://picsum.photos/seed/${category}${i + 1}/800/600`
    })) as any[];
    
    let fallbackIndex = 0;
    while (articles.length < count && fallbackIndex < fallbackArticles.length) {
      articles.push(fallbackArticles[fallbackIndex]);
      fallbackIndex++;
    }
  }

  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, count);

  return (
    <div className="w-full mb-10 border-t border-gray-200 pt-8 first:border-t-0 first:pt-0">
      <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#d9d9d9]">
        <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
        <h2 className="text-[10px] font-extrabold tracking-[0.12em] text-[#222222] uppercase font-sans">
          {category}
        </h2>
      </div>
      <a href={`/news/${mainArticle.slug}`} className="mb-6 group cursor-pointer border-b border-gray-200 pb-6 block">
        <div className="w-full aspect-[16/9] bg-gray-200 mb-4 overflow-hidden">
          <img src={mainArticle.image || `https://picsum.photos/seed/${mainArticle.id}/800/600`} alt={category} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
        </div>
        <h3 className="text-[26px] font-bold leading-[1.1] tracking-[-0.02em] text-[#111111] group-hover:text-[#d32f2f] transition-colors mb-2 font-sans">
          {mainArticle.title}
        </h3>
        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mt-2 font-sans">
          BY {mainArticle.writer_name} <span className="mx-1">|</span> {formatPublishDate(mainArticle.updated_at || mainArticle.created_at)}
        </p>
      </a>

      {sideArticles.length > 0 && (
        <div className="flex flex-col space-y-4 pb-4 border-b border-gray-200">
          {sideArticles.map(article => (
            <a key={article.id} href={`/news/${article.slug}`} className="group cursor-pointer flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="w-[140px] aspect-video bg-gray-200 shrink-0 overflow-hidden">
                <img src={article.image || `https://picsum.photos/seed/${article.id}/800/600`} alt="News" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
              </div>
              <div>
                <h3 className="text-[17px] font-bold leading-[1.2] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans mb-1">
                  {article.title}
                </h3>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mt-2 font-sans">
                  BY {article.writer_name} <span className="mx-1">|</span> {formatPublishDate(article.updated_at || article.created_at)}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

