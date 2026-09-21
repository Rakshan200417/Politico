import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BackButton from "@/components/common/BackButton";
import SaveShareButtons from "@/components/common/SaveShareButtons";
import AdvertisementSlot from "@/components/common/AdvertisementSlot";
import { getNewsArticle, featuredNewsArticles, slugify } from "@/data/newsArticles";
import {
  Clock,
  Calendar,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import CommentsSection from "@/components/news/CommentsSection";

export function generateStaticParams() {
  return Object.keys(featuredNewsArticles).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = getNewsArticle(params.slug);
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

export default function NewsArticlePage({ params }: { params: { slug: string } }) {
  const article = getNewsArticle(params.slug);

  const relatedStories = [
    {
      title: "Capitol Agenda: Johnson faces pressure to cut out early ahead of recess",
      byline: "BY ANTHONY ADRAGNA",
      time: "1h ago",
      image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Supreme Court agrees to hear landmark executive power dispute",
      byline: "BY JOSH GERSTEIN",
      time: "2h ago",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "White House clarifies tariff guidelines amid northern border concerns",
      byline: "BY DOUG PALMER",
      time: "3h ago",
      image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "New bipartisan crypto bill aims to establish regulatory framework",
      byline: "BY ELEANOR MUELLER",
      time: "4h ago",
      image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const moreNews = [
    {
      title: "Germany's far right eyes eastern state as springboard to national power",
      deck: "Regional polling points to historic gains as traditional parties scramble for coalition partners.",
      byline: "BY HANS VON DER BURCHARD",
      image: "https://images.unsplash.com/photo-1560523160-754a9e25c68f?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "China will stop Russia from going nuclear, Finland's Stubb says",
      deck: "The Finnish president highlighted Beijing's critical economic leverage over Moscow during a Helsinki security forum.",
      byline: "BY STUART LAU",
      image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Trump: Communities that reject data centers will end up 'backwards and poor'",
      deck: "The remarks came during an economic address in Ohio pushing for massive artificial intelligence infrastructure expansion.",
      byline: "BY GAVIN BADE",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    },
  ];

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
            <Link
              href={`/category/${article.categorySlug}`}
              className="text-[12px] font-black uppercase tracking-[0.1em] text-[#1a202c] hover:underline"
            >
              {article.category}
            </Link>
          </div>

          <h1 className="text-[36px] sm:text-[46px] lg:text-[54px] font-bold font-serif leading-[1.1] tracking-[-0.02em] text-[#111]">
            {article.title}
          </h1>

          <p className="mt-4 mb-8 max-w-[840px] font-sans text-[18px] sm:text-[20px] leading-[1.5] text-[#4a5568]">
            {article.deck}
          </p>

          {/* New Author Template (with top/bottom borders) */}
          <div className="border-t border-b border-[#e3e3e3] py-5 flex items-center gap-4">
            <Link
              href={`/author/${slugify(article.byline)}`}
              className="flex items-center gap-4 group"
            >
              {article.byline && (
                 <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(article.byline)}&background=111111&color=fff`} className="w-12 h-12 rounded-full object-cover shadow-sm" alt="Author" />
              )}
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-bold text-[#111] group-hover:text-[#d71920] transition-colors">
                    By {article.byline}
                  </span>
                  {article.authorLinkedin && (
                    <a href={article.authorLinkedin} target="_blank" rel="noopener noreferrer" className="text-[#0077b5] hover:opacity-80 ml-1">
                      <svg className="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    </a>
                  )}
                </div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide font-sans">
                  Published {article.publishedAt.toUpperCase()}
                </span>
              </div>
            </Link>
          </div>
        </header>

        {/* Main Article 2-Column Content Grid */}
        <section className="grid gap-8 pt-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          {/* Main Editorial Column */}
          <article className="min-w-0">
            {/* Hero Image */}
            <div className="aspect-[16/9] w-full overflow-hidden bg-[#f2f2f2] rounded-sm">
              <img
                src={article.image}
                alt={article.title}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="mt-2 text-[11px] text-gray-500 italic leading-relaxed">
              {article.imageCaption}
            </p>

            {/* Key Takeaways Box */}
            {article.keyTakeaways && article.keyTakeaways.length > 0 && (
              <div className="my-8 rounded-lg border-l-4 border-[#d71920] bg-[#f9f9f9] p-5">
                <h3 className="text-xs font-black uppercase tracking-[0.18em] text-[#d71920] mb-2">
                  KEY TAKEAWAYS
                </h3>
                <ul className="space-y-2 text-sm text-gray-800 font-medium">
                  {article.keyTakeaways.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-[#d71920] font-black">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Article Body Paragraphs with in-article Advertisement space matching Image 3 */}
            <div className="space-y-6 pt-4 font-sans text-[17px] sm:text-[18px] leading-[1.65] text-[#292929]">
              {article.paragraphs.map((p, idx) => (
                <React.Fragment key={idx}>
                  <p
                    className={idx === 0 ? "first-letter:text-5xl first-letter:font-black first-letter:float-left first-letter:mr-3 first-letter:text-[#111]" : ""}
                  >
                    {p}
                  </p>
                  {/* In-Article Advertisement Removed per user request */}
                </React.Fragment>
              ))}
            </div>

            {/* Pull Quote */}
            <div className="my-8 border-l-4 border-[#111] pl-6 py-2">
              <blockquote className="text-xl sm:text-2xl font-serif italic text-gray-900 leading-snug">
                “This is a pivotal moment that will shape both the regulatory environment and public sentiment over the coming months.”
              </blockquote>
            </div>

            {/* Tags Row */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mr-2">
                  FILED UNDER:
                </span>
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Removed Bottom Share and Author Block */}
            
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
                      <a href={`/news/${slugify(story.title)}`} className="group block">
                        <div className="aspect-[16/10] overflow-hidden bg-gray-100 rounded-sm mb-2">
                          <img
                            src={story.image}
                            alt=""
                            className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                          />
                        </div>
                        <h4 className="text-[15px] font-bold leading-tight text-[#111] group-hover:text-[#d71920] transition-colors">
                          {story.title}
                        </h4>
                        <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#666]">
                          {story.byline} • {story.time}
                        </p>
                      </a>
                    </article>
                  ))}
                </div>
              </div>

              {/* Sticky Container for Last 2 Stories + Ad */}
              <div className="space-y-6 w-full lg:sticky lg:top-[120px] self-start pb-8">
                <div className="space-y-4">
                  {relatedStories.slice(2).map((story) => (
                    <article key={story.title} className="border-b border-[#e1e1e1] pb-4 last:border-b-0">
                      <a href={`/news/${slugify(story.title)}`} className="group block">
                        <div className="aspect-[16/10] overflow-hidden bg-gray-100 rounded-sm mb-2">
                          <img
                            src={story.image}
                            alt=""
                            className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                          />
                        </div>
                        <h4 className="text-[15px] font-bold leading-tight text-[#111] group-hover:text-[#d71920] transition-colors">
                          {story.title}
                        </h4>
                        <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#666]">
                          {story.byline} • {story.time}
                        </p>
                      </a>
                    </article>
                  ))}
                </div>

                {/* Long Ad Removed per user request */}
              </div>
            </div>
          </aside>
        </section>

        {/* Banner Advertisement Space Removed */}

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
                  href={`/news/${slugify(story.title)}`}
                  className="grid grid-cols-[140px_minmax(0,1fr)] sm:grid-cols-[200px_minmax(0,1fr)] gap-5 group"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-[#f2f2f2] rounded-sm">
                    <img
                      src={story.image}
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
                      {story.byline}
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
