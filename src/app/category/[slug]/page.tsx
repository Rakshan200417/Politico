export const dynamic = 'force-dynamic';

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
    return <WorldCategoryPage searchParams={searchParams} />;
  }

  // Convert slug back to proper category string (e.g. 'technology' -> 'Technology')
  const categoryName = params.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  const currentPageParam = Math.max(1, Number(searchParams?.page) || 1);
  const MORE_PAGE_SIZE = 10;

  // 1. Fetch top 3 featured articles (Lead + 2 side stories) - always fixed on every page
  const { articles: topArticles } = await getPublishedArticlesByCategory(
    categoryName,
    3,
    false,
    1,
    false,
    0
  );

  let initialArticles = topArticles || [];

  // If there are no articles at all in this category, fill with mock stories so page doesn't look empty
  if (initialArticles.length === 0) {
    const mockArticles = Array.from({ length: 3 }).map((_, i) => ({
      id: 9000 + i,
      slug: `mock-${params.slug}-${i}`,
      title: `${categoryName} Update: Major Developments By POLITICO Staff Part ${i + 1}`,
      deck: `This is a comprehensive overview of the latest events in ${categoryName}, bringing you the details that matter most.`,
      writer_name: 'POLITICO STAFF',
      image: `https://picsum.photos/seed/${params.slug}${i}/800/600`
    })) as any;
    initialArticles = mockArticles;
  }

  // 2. Fetch the paginated "More News" stories (10 per page, offset by top 3)
  const moreOffset = 3 + (currentPageParam - 1) * MORE_PAGE_SIZE;
  const { articles: moreArticlesRaw, totalArticles = 0 } = await getPublishedArticlesByCategory(
    categoryName,
    MORE_PAGE_SIZE,
    false,
    currentPageParam,
    false,
    moreOffset
  );

  // Remaining articles for the "More News" section after the top 3
  const totalMoreNewsCount = Math.max(0, totalArticles - 3);
  const totalMorePages = Math.ceil(totalMoreNewsCount / MORE_PAGE_SIZE);

  const mapToStory = (article: any): CategoryStory => {
    return {
      title: article.title,
      deck: article.deck,
      byline: article.writer_name || 'POLITICO STAFF',
      image: article.image || `https://picsum.photos/seed/${article.id}/800/600`,
      slug: article.slug,
      date: formatPublishDate(article.updated_at || article.created_at),
      categoryTag: undefined, // Only World category displays #region tag
      category: categoryName,
    };
  };

  const leadArticle = mapToStory(initialArticles[0]);
  const sideStories = initialArticles.slice(1, 3).map(mapToStory);
  const moreStories = (moreArticlesRaw || []).map(mapToStory);

  const categoryData: CategoryPageData = {
    slug: params.slug,
    name: categoryName,
    description: `Latest news, analysis, and updates about ${categoryName}.`,
    lead: leadArticle,
    sideStories: sideStories,
    moreStories: moreStories,
    totalPages: totalMorePages,
    currentPage: currentPageParam,
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CategoryPage category={categoryData} />
      <Footer />
    </div>
  );
}
