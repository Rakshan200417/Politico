import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import CategoryPage from "@/components/category/CategoryPage";
import WorldCategoryPage from "@/components/category/WorldCategoryPage";
import { getPublishedArticlesByCategory } from "@/lib/articleService";
import type { CategoryPageData, CategoryStory } from "@/components/category/categoryData";

import { formatPublishDate } from "@/utils/dateFormatter";

// Note: Removed generateStaticParams so this page dynamically renders on every request
// or you can implement it to query all distinct categories from DB if needed.

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const formattedName = params.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    title: `${formattedName} News, Analysis and Updates - POLITICO`,
    description: `Latest news and updates about ${formattedName}.`,
  };
}

export default async function CategoryRoute({ params, searchParams }: { params: { slug: string }, searchParams: { page?: string } }) {
  if (params.slug.toLowerCase() === "world") {
    return <WorldCategoryPage />;
  }

  // Convert slug back to proper category string (e.g. 'technology' -> 'Technology')
  const categoryName = params.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  const currentPageParam = Number(searchParams?.page) || 1;
  let { articles, totalPages, currentPage } = await getPublishedArticlesByCategory(categoryName, 50, false, currentPageParam);

  if (!articles) {
    articles = [];
  }

  // Ensure we always have at least 15 articles for the new layout (1 lead + 2 side + 12 more)
  if (articles.length < 15) {
    const missingCount = 15 - articles.length;
    const mockArticles = Array.from({ length: missingCount }).map((_, i) => ({
      id: 9000 + articles.length + i,
      slug: `mock-${params.slug}-${articles.length + i}`,
      title: `${categoryName} Update: Major Developments By POLITICO Staff Part ${articles.length + i + 1}`,
      deck: `This is a comprehensive overview of the latest events in ${categoryName}, bringing you the details that matter most.`,
      writer_name: 'POLITICO STAFF',
      image: `https://picsum.photos/seed/${params.slug}${articles.length + i}/800/600`
    })) as any;
    articles = [...articles, ...mockArticles];
  }

  const mapToStory = (article: any): CategoryStory => ({
    title: article.title,
    deck: article.deck,
    byline: article.writer_name,
    image: article.image || `https://picsum.photos/seed/${article.id}/800/600`,
    slug: article.slug,
    date: formatPublishDate(article.updated_at || article.created_at),
  });

  const leadArticle = mapToStory(articles[0]);
  const sideStories = articles.slice(1, 4).map(mapToStory);
  const moreStories = articles.slice(4).map(mapToStory);

  const categoryData: CategoryPageData = {
    slug: params.slug,
    name: categoryName,
    description: `Latest news, analysis, and updates about ${categoryName}.`,
    lead: leadArticle,
    sideStories: sideStories,
    moreStories: moreStories,
    totalPages,
    currentPage,
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CategoryPage category={categoryData} />
      <Footer />
    </div>
  );
}
