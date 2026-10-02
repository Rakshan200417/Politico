import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import CategoryPage from "@/components/category/CategoryPage";
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
  // Convert slug back to proper category string (e.g. 'technology' -> 'Technology')
  const categoryName = params.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  const articles = await getPublishedArticlesByCategory(categoryName, 50);

  if (!articles || articles.length === 0) {
    // We could either notFound() or just show an empty category page
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="mx-auto w-full max-w-[1080px] px-4 py-16 font-sans sm:px-6">
          <h1 className="text-[40px] font-sans text-[#111] sm:text-[48px] mb-4 text-center">
            {categoryName}
          </h1>
          <p className="text-center text-gray-500">No articles found for this category yet.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const mapToStory = (article: any): CategoryStory => ({
    title: article.title,
    deck: article.deck,
    byline: article.writer_name,
    image: article.image || `https://picsum.photos/seed/${article.id}/800/600`,
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
