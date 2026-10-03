import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import CategoryPage from "@/components/category/CategoryPage";
import WorldCategoryPage from "@/components/category/WorldCategoryPage";
import { getPublishedArticlesByCategory } from "@/lib/articleService";
import type { CategoryPageData, CategoryStory } from "@/components/category/categoryData";

// Note: Removed generateStaticParams so this page dynamically renders on every request
// or you can implement it to query all distinct categories from DB if needed.

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const formattedName = params.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    title: `${formattedName} News, Analysis and Updates - POLITICO`,
    description: `Latest news and updates about ${formattedName}.`,
  };
}

export default async function CategoryRoute({ params }: { params: { slug: string } }) {
  if (params.slug.toLowerCase() === "world") {
    return <WorldCategoryPage />;
  }

  // Convert slug back to proper category string (e.g. 'technology' -> 'Technology')
  const categoryName = params.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  let articles = await getPublishedArticlesByCategory(categoryName, 50);

  if (!articles || articles.length === 0) {
    // Generate beautiful mock fallback data for empty categories
    const mockArticles = Array.from({ length: 7 }).map((_, i) => ({
      id: 9000 + i,
      slug: `mock-${params.slug}-${i}`,
      title: `${categoryName} Update: Major Developments By POLITICO Staff Part ${i + 1}`,
      deck: `This is a comprehensive overview of the latest events in ${categoryName}, bringing you the details that matter most.`,
      writer_name: 'POLITICO STAFF',
      image: `https://picsum.photos/seed/${params.slug}${i}/800/600`
    })) as any;
    articles = mockArticles;
  }

  const mapToStory = (article: any): CategoryStory => ({
    title: article.title,
    deck: article.deck,
    byline: article.writer_name,
    image: article.image || `https://picsum.photos/seed/${article.id}/800/600`,
    slug: article.slug,
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
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CategoryPage category={categoryData} />
      <Footer />
    </div>
  );
}
