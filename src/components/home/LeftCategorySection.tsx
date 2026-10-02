import { getPublishedArticlesByCategory } from "@/lib/articleService";

export default async function LeftCategorySection({ category }: { category: string }) {
  const articles = await getPublishedArticlesByCategory(category, 3);

  if (!articles || articles.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#d9d9d9]">
        <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
        <h2 className="text-[10px] font-extrabold tracking-[0.12em] text-[#222222] uppercase font-sans">
          {category}
        </h2>
      </div>
      <ul className="space-y-6 border-b border-gray-200 pb-6 mb-6">
        {articles.map((article) => (
          <li key={article.id} className="group cursor-pointer">
            <a href={`/news/${article.slug}`} className="block">
              <div className="w-full aspect-[4/3] bg-gray-200 mb-2 overflow-hidden">
                <img src={article.image || `https://picsum.photos/seed/${article.id}/800/600`} alt="News" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
              </div>
              <h3 className="text-[16px] font-bold leading-[1.2] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans mb-1">
                {article.title}
              </h3>
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mt-2 font-sans">BY {article.writer_name}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
