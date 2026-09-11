import React from "react";
import type { Metadata } from "next";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import SaveShareButtons from "@/components/common/SaveShareButtons";
import AdvertisementSlot from "@/components/common/AdvertisementSlot";
import { getNewsArticle, featuredNewsArticles, slugify } from "@/data/newsArticles";
import {
  Clock,
  Calendar,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

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
    <div className="min-h-screen bg-white font-sans text-[#111]">
      <Header />

      <main className="mx-auto w-full max-w-[1080px] px-4 pb-16 font-sans sm:px-6">
        {/* Top Banner identical to Category Pages */}
        <div className="flex h-[130px] sm:h-[160px] items-center justify-center border-b border-[#ededed]">
          <div className="w-full max-w-[650px] bg-[#f2f2f2] px-5 py-4 text-center rounded-sm">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#d71920]">
              POLITICO
            </span>
            <p className="mt-1 text-[15px] sm:text-[18px] font-bold text-[#222]">
              Your first read on politics and policy
            </p>
            <button className="mt-2 rounded-full bg-[#d71920] px-5 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white hover:bg-[#a00c1c] transition-colors">
              Subscribe now
            </button>
          </div>
        </div>

        {/* Article Breadcrumb / Category Tag */}
        <div className="pt-6 pb-2">
          <a
            href={`/category/${article.categorySlug}`}
            className="text-[11px] font-black uppercase tracking-[0.2em] text-[#d71920] hover:underline"
          >
            {article.category}
          </a>
        </div>

        {/* Headline Header */}
        <header className="border-b border-[#e3e3e3] pb-6">
          <h1 className="text-[32px] sm:text-[44px] lg:text-[50px] font-bold leading-[1.02] tracking-[-0.03em] text-[#111]">
            {article.title}
          </h1>

          <p className="mt-3 max-w-[840px] font-serif text-[18px] sm:text-[21px] leading-[1.25] text-[#555]">
            {article.deck}
          </p>

          {/* Byline & Metadata Bar */}
          <div className="mt-6 pt-4 border-t border-[#f0f0f0] flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-black tracking-[0.16em] uppercase text-[#666]">
                BY {article.byline}
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1 text-gray-500 font-mono text-[11px]">
                <Calendar size={13} />
                {article.publishedAt}
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1 text-gray-500 font-mono text-[11px]">
                <Clock size={13} />
                {article.readTime}
              </span>
            </div>

            {/* Save & Share Buttons matching user Image 2 */}
            <SaveShareButtons
              slug={article.slug}
              title={article.title}
              image={article.image}
              category={article.category}
              byline={article.byline}
              deck={article.deck}
              readTime={article.readTime}
            />
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
            <div className="space-y-6 pt-4 font-serif text-[17px] sm:text-[18px] leading-[1.65] text-[#292929]">
              {article.paragraphs.map((p, idx) => (
                <React.Fragment key={idx}>
                  <p
                    className={idx === 0 ? "first-letter:text-5xl first-letter:font-black first-letter:float-left first-letter:mr-3 first-letter:text-[#111]" : ""}
                  >
                    {p}
                  </p>
                  {/* Advertisement Space like 3rd image between paragraphs 2 and 3 */}
                  {idx === 1 && (
                    <AdvertisementSlot variant="in-article" />
                  )}
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

            {/* Bottom Save & Share Bar */}
            <div className="mt-8 flex items-center justify-between border-y border-gray-200 py-3 font-sans">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Share or save this story
              </span>
              <SaveShareButtons
                slug={article.slug}
                title={article.title}
                image={article.image}
                category={article.category}
                byline={article.byline}
                deck={article.deck}
                readTime={article.readTime}
              />
            </div>

            {/* Author Bio Card matching Profile Settings */}
            <div className="mt-8 p-6 bg-[#fafafa] rounded-xl border border-gray-200 flex flex-col sm:flex-row items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#b01753] text-white font-black text-2xl flex items-center justify-center select-none shadow-sm flex-shrink-0">
                {article.byline[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-900 text-base">{article.byline}</h4>
                  {article.authorLinkedin && (
                    <a
                      href={article.authorLinkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0077b5] hover:underline"
                    >
                      <span className="w-3.5 h-3.5 bg-[#0077b5] text-white rounded text-[9px] font-black flex items-center justify-center">
                        in
                      </span>
                      Connect
                    </a>
                  )}
                </div>
                <p className="text-xs text-[#ce1126] font-bold uppercase tracking-wider mt-0.5">
                  {article.authorRole}
                </p>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  {article.authorBio}
                </p>
              </div>
            </div>
          </article>

          {/* Sidebar Column identical to Category Pages */}
          <aside className="border-l border-[#e1e1e1] pl-0 lg:pl-6 space-y-8">
            {/* Newsletter Signup Widget */}
            <div className="border border-gray-200 bg-[#f9f9f9] p-5 rounded-lg">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d71920]">
                INSIDE POLITICO
              </span>
              <h3 className="mt-1 text-base font-bold text-gray-900">
                Get the Daily Briefing
              </h3>
              <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                The most important political stories delivered to your inbox every weekday morning.
              </p>
              <div className="mt-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#d71920]"
                />
                <button className="mt-2 w-full bg-[#d71920] hover:bg-[#a00c1c] text-white font-bold text-xs uppercase tracking-wider py-2 rounded transition-colors">
                  SIGN UP FREE
                </button>
              </div>
            </div>

            {/* Sidebar Advertisement Slot */}
            <AdvertisementSlot variant="sidebar" />

            {/* Related Stories */}
            <div>
              <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#d9d9d9]">
                <span className="w-2 h-2 rounded-full bg-[#d71920]" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#222]">
                  RELATED STORIES
                </h3>
              </div>

              <div className="space-y-4">
                {relatedStories.map((story) => (
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
          </aside>
        </section>

        {/* Banner Advertisement Space between article and bottom stories */}
        <AdvertisementSlot variant="banner" />

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
                    <p className="mt-2 font-serif text-[14px] sm:text-[16px] leading-[1.25] text-[#666]">
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
