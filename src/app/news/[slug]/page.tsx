import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BackButton from "@/components/common/BackButton";
import SaveShareButtons from "@/components/common/SaveShareButtons";
import AdvertisementSlot from "@/components/common/AdvertisementSlot";
import { getArticleBySlug, getLatestPublishedArticles } from "@/lib/articleService";
import {
  Clock,
  Calendar,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import CommentsSection from "@/components/news/CommentsSection";
import { slugify } from "@/data/newsArticles";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: "Article Not Found - POLITICO" };
  
  return {
    title: `${article.title} - POLITICO`,
    description: article.deck,
    openGraph: {
      title: `${article.title} - POLITICO`,
      description: article.deck,
      images: [article.image],
    },
  };
}

export default async function NewsArticlePage({ params }: { params: { slug: string } }) {
  // Simulate network delay to ensure the loading skeleton is visible
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const article = await getArticleBySlug(params.slug);
  if (!article) return notFound();

  // Fetch some dynamic latest stories for related/more news
  const allLatest = await getLatestPublishedArticles(10);
  const relatedStories = allLatest.filter(a => a.id !== article.id).slice(0, 4);
  const moreNews = allLatest.filter(a => a.id !== article.id).slice(4, 7);

  const tagsArray = article.tags ? article.tags.split(',').map(t => t.trim()) : [];
  
  const formattedDate = new Date(article.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  return (
    <div className="min-h-screen bg-white font-sans text-[#111] flex flex-col">
      <Header />

      {/* ── Top Banner Advertisement (In the Beige Gap) ── */}
      <div className="w-full bg-[#f3eadd] py-6 border-b border-gray-200">
        <div className="w-full max-w-[970px] mx-auto hidden lg:block">
          <div className="w-full font-sans text-center">
            <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-2">
              Advertisement
            </span>
            <div className="w-full min-h-[110px] sm:min-h-[140px] bg-[#f9fafb] border border-[#e5e7eb] flex flex-col items-center justify-center p-6 relative overflow-hidden">
              <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase border border-gray-300 px-2.5 py-0.5 rounded mb-1">
                AD
              </span>
              <span className="text-[11px] font-sans font-medium text-gray-400">
                POLITICO Commercial Network
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-[1080px] px-4 pb-16 font-sans sm:px-6">

        {/* Back to Newsfeed */}
        <div className="pt-6 pb-4 border-b border-[#e3e3e3] mb-8">
          <BackButton text="BACK TO NEWSFEED" />
        </div>

        {/* Headline Header */}
        <header className="pb-8">
          {/* Category Tag */}
          <div className="mb-4">
            <a
              href={`/category/${article.category.toLowerCase()}`}
              className="text-[12px] font-black uppercase tracking-[0.1em] text-[#1a202c] hover:underline"
            >
              {article.category}
            </a>
          </div>

          <h1 className="text-[36px] sm:text-[46px] lg:text-[54px] font-bold font-serif leading-[1.1] tracking-[-0.02em] text-[#111]">
            {article.title}
          </h1>

          <p className="mt-4 mb-4 max-w-[840px] font-sans text-[18px] sm:text-[20px] leading-[1.5] text-[#4a5568]">
            {article.deck}
          </p>

          {/* Tags Row */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mr-2">
                FILED UNDER:
              </span>
              {tagsArray.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* New Author Template (with top/bottom borders) */}
          <div className="border-t border-b border-[#e3e3e3] py-5 flex items-center gap-4">
            <div className="flex items-center gap-4">
              <a href={`/author/${slugify(article.writer_name)}`} className="group">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(article.writer_name)}&background=111111&color=fff`} className="w-12 h-12 rounded-full object-cover shadow-sm group-hover:opacity-90 transition-opacity" alt="Author" />
              </a>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <a href={`/author/${slugify(article.writer_name)}`} className="text-[15px] font-bold text-[#111] hover:text-[#d71920] transition-colors">
                    By {article.writer_name}
                  </a>
                </div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide font-sans">
                  Published {formattedDate.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Article 2-Column Content Grid */}
        <section className="grid gap-8 pt-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          {/* Main Editorial Column */}
          <article className="min-w-0">
            {/* Hero Image */}
            <div className="aspect-[16/9] w-full overflow-hidden bg-[#f2f2f2] rounded-sm">
              <img
                src={article.image || `https://picsum.photos/seed/${article.id}/800/600`}
                alt={article.title}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="mt-2 text-[11px] text-gray-500 italic leading-relaxed">
              {article.image_caption || 'A representative photo'}
            </p>

            {/* Article Body Paragraphs */}
            <div 
              className="space-y-6 pt-8 font-sans text-[17px] sm:text-[18px] leading-[1.65] text-[#292929] article-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Comments Section */}
            <CommentsSection articleSlug={article.slug} />
          </article>

          {/* Sidebar Column identical to Category Pages */}
          <aside className="border-l border-[#e1e1e1] pl-0 lg:pl-6">
            <div className="flex flex-col h-full">
              {/* Small Ad block (like Ad 01) */}
              <div className="w-full max-w-[280px] mx-auto mb-8 aspect-square bg-[#e5e7eb] flex items-center justify-center border border-gray-300 relative z-10">
                <span className="text-[#111111] font-bold text-[32px] tracking-tight">Ad</span>
              </div>

              {/* Related Stories (First 2) */}
              <div>
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#d9d9d9]">
                  <span className="w-2 h-2 rounded-full bg-[#d71920]" />
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#222]">
                    RELATED STORIES
                  </h3>
                </div>

                <div className="space-y-4 mb-8">
                  {relatedStories.slice(0, 2).map((story) => (
                    <article key={story.title} className="border-b border-[#e1e1e1] pb-4">
                      <a href={`/news/${story.slug}`} className="group block">
                        <div className="aspect-[16/10] overflow-hidden bg-gray-100 rounded-sm mb-2">
                          <img
                            src={story.image || `https://picsum.photos/seed/${story.id}/800/600`}
                            alt=""
                            className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                          />
                        </div>
                        <h4 className="text-[15px] font-bold leading-tight text-[#111] group-hover:text-[#d71920] transition-colors">
                          {story.title}
                        </h4>
                        <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#666]">
                          BY {story.writer_name}
                        </p>
                      </a>
                    </article>
                  ))}
                </div>
              </div>

              {/* Sticky Container for Last 2 Stories */}
              <div className="space-y-6 w-full lg:sticky lg:top-[120px] self-start pb-8">
                <div className="space-y-4">
                  {relatedStories.slice(2, 4).map((story) => (
                    <article key={story.title} className="border-b border-[#e1e1e1] pb-4 last:border-b-0">
                      <a href={`/news/${story.slug}`} className="group block">
                        <div className="aspect-[16/10] overflow-hidden bg-gray-100 rounded-sm mb-2">
                          <img
                            src={story.image || `https://picsum.photos/seed/${story.id}/800/600`}
                            alt=""
                            className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                          />
                        </div>
                        <h4 className="text-[15px] font-bold leading-tight text-[#111] group-hover:text-[#d71920] transition-colors">
                          {story.title}
                        </h4>
                        <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#666]">
                          BY {story.writer_name}
                        </p>
                      </a>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </section>

        {/* Bottom Section: More News Rows matching CategoryPage */}
        <section className="mt-10 border-t border-[#e1e1e1] pt-8">
          <div className="mb-6 flex items-center gap-2 border-b border-[#d9d9d9] pb-2">
            <span className="h-2 w-2 rounded-full border border-[#d71920]" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#222]">
              MORE POLITICO STORIES
            </h2>
          </div>

          <div className="max-w-[760px] space-y-6">
            {moreNews.map((story) => (
              <article key={story.title} className="border-b border-[#e1e1e1] pb-6 last:border-b-0">
                <a
                  href={`/news/${story.slug}`}
                  className="grid grid-cols-[140px_minmax(0,1fr)] sm:grid-cols-[200px_minmax(0,1fr)] gap-5 group"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-[#f2f2f2] rounded-sm">
                    <img
                      src={story.image || `https://picsum.photos/seed/${story.id}/800/600`}
                      alt=""
                      className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h3 className="text-[18px] sm:text-[21px] font-bold leading-[1.1] tracking-[-0.02em] text-[#111] group-hover:text-[#d71920] transition-colors">
                      {story.title}
                    </h3>
                    <p className="mt-2 font-sans text-[14px] sm:text-[16px] leading-[1.25] text-[#666]">
                      {story.deck}
                    </p>
                    <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.14em] text-[#666]">
                      BY {story.writer_name}
                    </p>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
