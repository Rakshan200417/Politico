import React from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import CategoryPage from "@/components/category/CategoryPage";
import { getPublishedArticlesByCategory } from "@/lib/articleService";
import type { CategoryPageData, CategoryStory } from "@/components/category/categoryData";
import { formatPublishDate } from "@/utils/dateFormatter";
import { slugify } from "@/data/newsArticles";

const WORLD_REGIONS = [
  "Asia",
  "China",
  "United States",
  "Europe",
  "Britain",
  "Middle East",
  "Africa",
  "Americas",
  "Oceania",
  "Russia",
  "United Kingdom",
  "Global",
];

export function extractWorldTag(article: any): string {
  // 1. If article category is a specific region
  if (
    article.category &&
    WORLD_REGIONS.some((r) => r.toLowerCase() === article.category.toLowerCase())
  ) {
    const match = WORLD_REGIONS.find(
      (r) => r.toLowerCase() === article.category.toLowerCase()
    );
    return match || article.category;
  }

  // 2. Parse subcategories if available
  let subs: string[] = [];
  try {
    if (Array.isArray(article.subcategories)) {
      subs = article.subcategories;
    } else if (typeof article.subcategories === "string") {
      subs = article.subcategories.startsWith("[")
        ? JSON.parse(article.subcategories)
        : article.subcategories.split(",").map((s: string) => s.trim());
    }
  } catch {}

  for (const sub of subs) {
    const match = WORLD_REGIONS.find(
      (r) => r.toLowerCase() === sub.toLowerCase()
    );
    if (match) return match;
  }

  if (subs.length > 0 && subs[0]) {
    return subs[0];
  }

  // 3. Check tags
  let tagList: string[] = [];
  try {
    if (Array.isArray(article.tags)) {
      tagList = article.tags;
    } else if (typeof article.tags === "string") {
      tagList = article.tags.startsWith("[")
        ? JSON.parse(article.tags)
        : article.tags.split(",").map((s: string) => s.trim());
    }
  } catch {}

  for (const tag of tagList) {
    const match = WORLD_REGIONS.find(
      (r) => r.toLowerCase() === tag.toLowerCase()
    );
    if (match) return match;
  }

  // 4. If category is non-empty and not 'World'
  if (article.category && article.category.toLowerCase() !== "world") {
    return article.category;
  }

  return "Asia";
}

export default async function WorldCategoryPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const currentPageParam = Number(searchParams?.page) || 1;
  let { articles, totalPages, currentPage } = await getPublishedArticlesByCategory(
    "World",
    15,
    false,
    currentPageParam
  );

  if (!articles) {
    articles = [];
  }

  // If fewer than 3 articles in DB, supplement with realistic mock stories with world region tags
  const sampleRegions = ["Asia", "Europe", "United States", "China", "Middle East", "Britain", "Africa"];
  if (articles.length < 3) {
    const missingCount = 3 - articles.length;
    const mockArticles = Array.from({ length: missingCount }).map((_, i) => {
      const region = sampleRegions[i % sampleRegions.length];
      return {
        id: 8800 + articles.length + i,
        slug: `world-${region.toLowerCase().replace(/\s+/g, "-")}-update-${i + 1}`,
        title: `${region} Summit: Landmark Diplomatic & Economic Accord Finalized in Major Policy Shift`,
        deck: `Key leaders and trade officials from ${region} reach consensus on pivotal international trade, security cooperation, and technology standards.`,
        writer_name: "POLITICO STAFF",
        category: region,
        subcategories: [region],
        image: `https://picsum.photos/seed/world-${region.toLowerCase()}-${i}/800/600`,
        updated_at: new Date(Date.now() - (i + 1) * 3600000).toISOString(),
      } as any;
    });
    articles = [...articles, ...mockArticles];
  }

  const mapToStory = (article: any, index: number): CategoryStory => {
    const storySlug = article.slug || slugify(article.title);
    return {
      title: article.title,
      deck: article.deck,
      byline: article.writer_name || "POLITICO STAFF",
      image: article.image || `https://picsum.photos/seed/world-${article.id || index}/800/600`,
      slug: storySlug,
      date: formatPublishDate(article.updated_at || article.created_at),
      categoryTag: extractWorldTag(article),
      category: "World",
    };
  };

  const leadArticle = mapToStory(articles[0], 0);
  const sideStories = articles.slice(1, 3).map((a, i) => mapToStory(a, i + 1));
  const moreStories = articles.slice(3).map((a, i) => mapToStory(a, i + 3));

  const categoryData: CategoryPageData = {
    slug: "world",
    name: "World",
    description: "Latest international news, analysis, and geopolitical updates from around the globe.",
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
