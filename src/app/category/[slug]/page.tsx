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

const categorySlugMap: Record<string, string> = {
  // Main Sections
  "world": "World",
  "companies": "Companies",
  "startups": "Startups",
  "markets": "Markets",
  "economy": "Economy",
  "finance": "Finance",
  "leaders": "Leaders",
  "industries": "Industries",
  "technology": "Technology",
  "interview": "Interview",
  "business": "Business",

  // World Regions
  "asia": "Asia",
  "middle-east": "Middle East",
  "europe": "Europe",
  "britain": "Britain",
  "africa": "Africa",
  "china": "China",
  "united-states": "United States",

  // Companies Subcategories
  "corporate-announcements": "Corporate Announcements",
  "mergers-acquisitions": "Mergers & Acquisitions",
  "leadership-changes": "Leadership Changes",

  // Startups Subcategories
  "funding-investment": "Funding & Investment",
  "founder-stories": "Founder Stories",
  "venture-capital": "Venture Capital",
  "startup-failures": "Startup Failures",

  // Markets Subcategories
  "stock-market": "Stock Market",
  "bonds": "Bonds",
  "mutual-funds": "Mutual Funds",

  // Economy Subcategories
  "gdp-economic-growth": "GDP & Economic Growth",
  "employment": "Employment",
  "government-economic-policies": "Government Economic Policies",

  // Finance Subcategories
  "digital-banking": "Digital Banking",
  "fintech": "FinTech",
  "banking-industry": "Banking Industry",
  "loans-lending": "Loans & Lending",

  // Technology Subcategories
  "artificial-intelligence": "Artificial Intelligence",
  "cybersecurity": "Cybersecurity",
  "gadgets-devices": "Gadgets & Devices",
  "software": "Software",

  // Industries Subcategories
  "manufacturing": "Manufacturing",
  "energy": "Energy",
  "pharmaceuticals": "Pharmaceuticals",
  "automobile": "Automobile",
  "agriculture-business": "Agriculture Business",
  "construction": "Construction",
  "design": "Design",
  "textiles": "Textiles",
  "entertainment": "Entertainment",

  // Leaders Subcategories
  "business-leaders": "Business Leaders",
  "ceo-interviews": "CEO Interviews",
  "executive-appointments": "Executive Appointments",
  "leadership-strategies": "Leadership Strategies",
};

function resolveCategoryName(slug: string): string {
  const normalized = slug.toLowerCase().trim();
  if (categorySlugMap[normalized]) {
    return categorySlugMap[normalized];
  }
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const formattedName = resolveCategoryName(params.slug);
  return {
    title: `${formattedName} News, Analysis and Updates - POLITICO`,
    description: `Latest news and updates about ${formattedName}.`,
  };
}

export default async function CategoryRoute({ params, searchParams }: { params: { slug: string }, searchParams: { page?: string } }) {
  if (params.slug.toLowerCase() === "world") {
    return <WorldCategoryPage searchParams={searchParams} />;
  }

  // Convert slug back to proper category string
  const categoryName = resolveCategoryName(params.slug);
  
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

  let moreArticlesList = moreArticlesRaw || [];
  if (moreArticlesList.length === 0) {
    const mockMoreTitles = [
      `Policy shifts in ${categoryName}: How regulators are adjusting frameworks for 2026`,
      `Inside the boardroom: Leading executives discuss trends transforming ${categoryName}`,
      `Market reaction: Key financial indicators and investor sentiment in ${categoryName}`,
      `Analysis: What bipartisan negotiations mean for future ${categoryName} investments`,
      `Exclusive survey: Industry stakeholders weigh in on emerging ${categoryName} challenges`,
      `The global perspective: How international partners view new US ${categoryName} strategies`,
      `Behind closed doors: Lawmakers debate critical reforms affecting ${categoryName}`
    ];

    moreArticlesList = mockMoreTitles.map((t, idx) => ({
      id: 9100 + idx,
      slug: `mock-${params.slug}-more-${idx + 1}`,
      title: t,
      deck: `Detailed reporting and exclusive industry perspectives on key developments in ${categoryName}.`,
      writer_name: 'POLITICO STAFF',
      image: `https://picsum.photos/seed/${params.slug}-more-${idx}/800/600`,
      created_at: new Date(Date.now() - (idx + 1) * 7200000).toISOString()
    })) as any;
  }

  // Remaining articles for the "More News" section after the top 3
  const totalMoreNewsCount = Math.max(moreArticlesList.length, totalArticles - 3);
  const totalMorePages = Math.max(1, Math.ceil(totalMoreNewsCount / MORE_PAGE_SIZE));

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
  const moreStories = moreArticlesList.map(mapToStory);

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
