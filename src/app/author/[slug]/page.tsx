import React from "react";
import type { Metadata } from "next";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Link from "next/link";
import BackButton from "@/components/common/BackButton";
import { getArticlesByAuthorSlug, getAuthorProfile, getAuthorProfileByName } from "@/lib/articleService";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const authorName = params.slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return {
    title: `${authorName} - POLITICO`,
    description: `Articles by ${authorName} on POLITICO`,
  };
}

export default async function AuthorProfilePage({ params, searchParams }: { params: { slug: string }, searchParams: { page?: string } }) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const currentPageParam = Number(searchParams.page) || 1;
  const { articles, totalPages, currentPage } = await getArticlesByAuthorSlug(params.slug, 20, currentPageParam);

  let authorName = params.slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  let authorRole = "WRITER";
  let authorBio = "A dedicated journalist with a passion for delivering accurate, timely, and impactful news. Committed to ethical reporting and in-depth storytelling, she covers a wide range of topics with professionalism, integrity, and a focus on informing audiences through credible journalism.";
  let authorAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=111111&color=fff&size=200`;

  // Always try to fetch profile by name first (even if 0 articles)
  const profile = await getAuthorProfileByName(authorName);
  if (profile) {
    authorBio = profile.bio || authorBio;
    authorAvatarUrl = profile.avatar_url || authorAvatarUrl;
  }

  if (articles && articles.length > 0) {
    authorName = articles[0].writer_name;
    // If by name failed, try by email from the first article
    if (!profile && articles[0].writer_email) {
      const profileByEmail = await getAuthorProfile(articles[0].writer_email);
      if (profileByEmail) {
        authorBio = profileByEmail.bio || authorBio;
        authorAvatarUrl = profileByEmail.avatar_url || authorAvatarUrl;
      }
    }
  }

  const mostRead = [
    { title: "New Exclusive Decoration Design & Fit Out LLC – Structural Acrylic Pioneers in the UAE", views: "70 views" },
    { title: "Trump Declares Iran Ceasefire 'Over,' Raising Questions About the Next Phase of the Conflict", views: "46 views" },
    { title: "Lakhan Gandhi", views: "42 views" },
    { title: "Phillip Johnston: The Entrepreneur Building the Future of AI in Space", views: "18 views" },
    { title: "Trump's Hormuz Retreat Highlights Struggles to End Iran Conflict", views: "17 views" }
  ];

  const generatePageLinks = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#111] flex flex-col">
      <Header />

      <main className="mx-auto w-full max-w-[1080px] px-4 py-8 lg:py-12 font-sans sm:px-6 flex-1">
        
        {/* Go Back Button */}
        <div className="mb-8">
          <BackButton />
        </div>

        {/* Author Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-[#e1e1e1] pb-10 mb-10">
          <div className="w-24 h-24 sm:w-[100px] sm:h-[100px] shrink-0 overflow-hidden rounded-full border border-gray-200">
            <img 
              src={authorAvatarUrl} 
              alt={authorName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-[32px] sm:text-[38px] font-serif font-bold text-[#1a202c] mb-1 leading-tight">
              {authorName}
            </h1>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#d71920] mb-4">
              {authorRole}
            </p>
            <p className="text-[14px] sm:text-[15px] text-[#555] leading-relaxed max-w-[800px]">
              {authorBio}
            </p>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-12">
          
          {/* Main Feed */}
          <div>
            <h2 className="text-[15px] font-serif font-bold uppercase tracking-wider text-[#111] border-b-2 border-[#111] pb-2 mb-6">
              MORE FROM {authorName.toUpperCase()}
            </h2>

            <div className="space-y-8">
              {articles.length === 0 ? (
                <p className="text-gray-500">No published articles found for this author yet.</p>
              ) : (
                articles.map((article: any) => (
                  <article key={article.slug} className="border-b border-[#e1e1e1] pb-8 last:border-b-0">
                    <a href={`/news/${article.slug}`} className="group grid grid-cols-1 sm:grid-cols-[240px_minmax(0,1fr)] gap-6 items-start">
                      <div className="aspect-[16/10] overflow-hidden bg-gray-100 w-full rounded-sm">
                        <img 
                          src={article.image || `https://picsum.photos/seed/${article.id}/800/600`} 
                          alt={article.title} 
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" 
                        />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#2c5282] mb-2 block">
                          {article.category}
                        </span>
                        <h3 className="text-[22px] sm:text-[24px] font-serif font-bold leading-[1.2] text-[#1a202c] group-hover:text-[#d71920] transition-colors mb-3">
                          {article.title}
                        </h3>
                        <p className="text-[15px] leading-[1.4] text-[#4a5568] font-sans mb-3 line-clamp-3">
                          {article.deck}
                        </p>
                        <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#718096]">
                          BY {article.writer_name} • {new Date(article.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()}
                        </div>
                      </div>
                    </a>
                  </article>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 pt-8 flex items-center justify-center gap-1.5 sm:gap-2">
                <Link
                  href={currentPage > 1 ? `/author/${params.slug}?page=${currentPage - 1}` : '#'}
                  className={`px-3 sm:px-4 py-2 text-[11px] font-bold tracking-wider rounded transition-colors ${currentPage > 1 ? 'text-[#111] border border-gray-300 hover:bg-gray-50' : 'text-gray-400 border border-gray-200 cursor-not-allowed'}`}
                  aria-disabled={currentPage <= 1}
                >
                  PREV
                </Link>
                
                {generatePageLinks().map((pageNum, idx) => {
                  if (pageNum === '...') {
                    return <span key={`dots-${idx}`} className="text-gray-400 font-bold px-1">...</span>;
                  }
                  const isCurrent = pageNum === currentPage;
                  return (
                    <Link
                      key={pageNum}
                      href={`/author/${params.slug}?page=${pageNum}`}
                      className={`w-8 h-8 flex items-center justify-center text-[12px] font-bold rounded transition-colors ${isCurrent ? 'bg-[#820000] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}

                <Link
                  href={currentPage < totalPages ? `/author/${params.slug}?page=${currentPage + 1}` : '#'}
                  className={`px-3 sm:px-4 py-2 text-[11px] font-bold tracking-wider rounded transition-colors ${currentPage < totalPages ? 'text-[#111] border border-gray-300 hover:bg-gray-50' : 'text-gray-400 border border-gray-200 cursor-not-allowed'}`}
                  aria-disabled={currentPage >= totalPages}
                >
                  NEXT
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="border-t lg:border-t-0 lg:border-l border-[#e1e1e1] pt-8 lg:pt-0 lg:pl-8">
            <div className="w-full lg:sticky lg:top-[120px] self-start space-y-10 pb-8">
              
              {/* Most Read Section */}
              <div>
                <div className="flex items-center gap-2 pb-2 mb-6 border-b border-[#e1e1e1]">
                  <svg className="w-4 h-4 text-[#2c5282]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/></svg>
                  <h3 className="text-[13px] font-serif font-bold uppercase tracking-widest text-[#111]">
                    MOST READ
                  </h3>
                </div>
                
                <div className="space-y-6">
                  {mostRead.map((item, index) => (
                    <article key={index} className="flex gap-4 group cursor-pointer border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                      <span className="text-[32px] font-serif font-black text-[#e2e8f0] leading-none shrink-0 group-hover:text-[#cbd5e0] transition-colors">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="text-[13px] sm:text-[14px] font-bold text-[#1a202c] leading-snug group-hover:text-[#d71920] transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-[10px] text-gray-400 mt-2 font-medium">
                          {item.views}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Advertisement Image */}
              <div className="w-full">
                <div className="w-full aspect-[3/4] bg-gray-100 overflow-hidden rounded shadow-sm">
                  <img 
                    src="https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?auto=format&fit=crop&w=600&q=80" 
                    alt="Advertisement" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
            </div>
          </aside>

        </div>
      </main>

      <Footer />
    </div>
  );
}