import React from 'react';
import { slugify } from '@/data/newsArticles';
import { getArticlesByPlacement } from "@/lib/articleService";
import { formatPublishDate } from "@/utils/dateFormatter";

export default async function HomeBottomPanel() {
  let dbArticles = await getArticlesByPlacement("Home - Bottom Panel", 2);

  const fallbackArticles = [
      { id: 995, title: "Rand Paul kills Kennedy's AI 'kill switch' bill", writer_name: "JORDAIN CARNEY", image: "https://images.unsplash.com/photo-1620825937374-87fc7d6aaf63?auto=format&fit=crop&w=800&q=80" },
      { id: 996, title: "Rand Paul kills Kennedy's AI 'kill switch' bill", writer_name: "JORDAIN CARNEY", image: "https://images.unsplash.com/photo-1620825937374-87fc7d6aaf63?auto=format&fit=crop&w=800&q=80" }
  ] as any[];

  let articles = [...(dbArticles || [])];
  
  let fallbackIndex = 0;
  while (articles.length < 2 && fallbackIndex < fallbackArticles.length) {
    articles.push(fallbackArticles[fallbackIndex]);
    fallbackIndex++;
  }

  return (
    <div className="mt-6 border-t border-gray-200 pt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article, idx) => (
          <article key={idx} className="group cursor-pointer">
            <a href={`/news/${slugify(article.title)}`} className="block space-y-2">
              <div className="aspect-[16/10] overflow-hidden bg-gray-100 mb-3">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                />
              </div>
              <h3 className="text-[17px] lg:text-[19px] font-bold leading-[1.1] tracking-[-0.01em] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans">
                {article.title}
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500 mt-2 font-sans">
                BY {article.writer_name} <span className="mx-1">|</span> {formatPublishDate(article.updated_at || article.created_at)}
              </p>
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
