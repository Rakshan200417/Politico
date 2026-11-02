"use client";

import React, { useEffect, useRef, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import SaveShareButtons from "@/components/common/SaveShareButtons";
import { formatPublishDate } from "@/utils/dateFormatter";
import { 
  Search, 
  X, 
  Loader2, 
  User as UserIcon, 
  Clock, 
  ChevronLeft,
  ChevronRight,
  BookOpen
} from "lucide-react";

const ITEMS_PER_PAGE = 10;

function getAuthorSlug(name: string): string {
  if (!name) return "";
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  // const router = useRouter();

  const initialQ = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQ);
  const [activeQuery, setActiveQuery] = useState(initialQ);
  const [typeFilter, setTypeFilter] = useState<"all" | "articles" | "authors">("all");
  
  const [rawArticles, setRawArticles] = useState<any[]>([]);
  const [rawAuthors, setRawAuthors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync with searchParams on initial mount or URL navigation
  useEffect(() => {
    const qFromUrl = searchParams.get("q") || "";
    if (qFromUrl !== activeQuery) {
      setQuery(qFromUrl);
      setActiveQuery(qFromUrl);
    }
  }, [searchParams]);

  // Update URL parameter without reload
  const updateUrl = (newQuery: string) => {
    const params = new URLSearchParams();
    if (newQuery.trim()) params.set("q", newQuery.trim());
    const queryString = params.toString();
    const newPath = queryString ? `/search?${queryString}` : "/search";
    window.history.replaceState(null, "", newPath);
  };

  // Fetch articles whenever activeQuery changes
  useEffect(() => {
    let isCancelled = false;
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const endpoint = activeQuery.trim()
          ? `/api/articles?search=${encodeURIComponent(activeQuery.trim())}&status=published`
          : `/api/articles?status=published`;

        const res = await fetch(endpoint);
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled) {
            setRawArticles(data.articles || []);
            setCurrentPage(1);
          }
        }
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchArticles();
    return () => {
      isCancelled = true;
    };
  }, [activeQuery]);

  // Fetch authors from users API
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const res = await fetch("/api/users");
        if (res.ok) {
          const data = await res.json();
          if (data.users) {
            setRawAuthors(data.users);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch authors list:", err);
      }
    };
    fetchAuthors();
  }, []);

  // Handle typing debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== activeQuery) {
        setActiveQuery(query);
        updateUrl(query);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle explicit form submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveQuery(query);
    updateUrl(query);
  };

  const handleClear = () => {
    setQuery("");
    setActiveQuery("");
    updateUrl("");
    if (inputRef.current) inputRef.current.focus();
  };

  // Filter authors based on query
  const filteredAuthors = useMemo(() => {
    const q = activeQuery.toLowerCase().trim();
    if (!q) {
      return typeFilter === "authors" ? rawAuthors : [];
    }
    return rawAuthors.filter((author) => {
      return (
        author.name?.toLowerCase().includes(q) ||
        author.email?.toLowerCase().includes(q) ||
        author.bio?.toLowerCase().includes(q)
      );
    });
  }, [rawAuthors, activeQuery, typeFilter]);

  // Filter articles
  const filteredArticles = useMemo(() => {
    let list = [...rawArticles];

    if (activeQuery.trim()) {
      const q = activeQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.title?.toLowerCase().includes(q) ||
          a.deck?.toLowerCase().includes(q) ||
          a.writer_name?.toLowerCase().includes(q) ||
          (Array.isArray(a.tags) && a.tags.some((t: string) => t.toLowerCase().includes(q)))
      );
    }

    // Default newest first
    list.sort((a, b) => {
      return new Date(b.created_at || b.updated_at).getTime() - new Date(a.created_at || a.updated_at).getTime();
    });

    return list;
  }, [rawArticles, activeQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 mb-6">
          <a href="/" className="hover:text-[#ce1126] transition-colors">Home</a>
          <span>/</span>
          <span className="text-[#ce1126]">Search</span>
          {activeQuery && (
            <>
              <span>/</span>
              <span className="text-gray-900 truncate max-w-xs">&quot;{activeQuery}&quot;</span>
            </>
          )}
        </div>

        {/* Search Header Banner */}
        <div className="bg-white rounded-none shadow-sm border border-gray-200/80 p-6 sm:p-8 mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1e1e1e] tracking-tight uppercase mb-2">
            Search POLITICO
          </h1>
          <p className="text-sm text-gray-500 mb-6 font-medium">
            Find breaking political news, in-depth investigations, policy insights, and authors.
          </p>

          {/* Search Input Bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <div className="relative flex-1 flex items-center">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 pointer-events-none" strokeWidth={2.5} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles, topics, keywords, authors..."
                className="w-full pl-12 pr-12 py-3.5 sm:py-4 bg-gray-50 border border-gray-300 rounded-none text-base sm:text-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ce1126] focus:border-transparent transition-all shadow-inner"
              />
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3.5 p-1 text-gray-400 hover:text-gray-600 rounded-none hover:bg-gray-200 transition-colors"
                  aria-label="Clear search query"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="ml-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#ce1126] hover:bg-[#a00c1c] text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-none transition-colors shadow-sm flex items-center gap-2 flex-shrink-0 cursor-pointer"
            >
              <span>Search</span>
            </button>
          </form>

          {/* Top Tabs in place of Trending: All Results | Articles | Authors */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => setTypeFilter("all")}
              className={`px-4 py-2 rounded-none transition-all uppercase tracking-wider text-[11px] font-black cursor-pointer ${
                typeFilter === "all"
                  ? "bg-[#1e293b] text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Results
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter("articles")}
              className={`px-4 py-2 rounded-none transition-all uppercase tracking-wider text-[11px] font-black cursor-pointer ${
                typeFilter === "articles"
                  ? "bg-[#1e293b] text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Articles
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter("authors")}
              className={`px-4 py-2 rounded-none transition-all uppercase tracking-wider text-[11px] font-black cursor-pointer ${
                typeFilter === "authors"
                  ? "bg-[#1e293b] text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Authors
            </button>
          </div>
        </div>

        {/* Results Area */}
        {isLoading ? (
          <div className="bg-white rounded-none shadow-sm border border-gray-200/80 p-16 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-10 h-10 animate-spin text-[#ce1126] mb-4" />
            <p className="text-base font-bold text-gray-800 uppercase tracking-widest">Searching...</p>
            <p className="text-xs text-gray-400 mt-1">Fetching matching headlines, authors, and stories</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* 1. Authors Section (when typeFilter is "authors" or when "all" with search query and matching authors) */}
            {(typeFilter === "authors" || (typeFilter === "all" && activeQuery.trim() && filteredAuthors.length > 0)) && (
              <div className="bg-white rounded-none shadow-sm border border-gray-200/80 p-6">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wider">
                    <UserIcon size={16} className="text-[#ce1126]" />
                    <span>AUTHORS</span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {filteredAuthors.length} {filteredAuthors.length === 1 ? "result" : "results"}
                  </span>
                </div>

                {filteredAuthors.length === 0 ? (
                  <div className="py-8 text-center text-gray-500 text-sm">
                    No authors found matching &quot;{activeQuery}&quot;
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredAuthors.map((author) => {
                      const authorSlug = getAuthorSlug(author.name);
                      return (
                        <a
                          key={author.id || author.email}
                          href={`/author/${authorSlug}`}
                          className="flex items-start gap-4 p-4 hover:bg-gray-50/80 transition-colors block group"
                        >
                          <img
                            src={
                              author.avatar_url ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name || "Author")}&background=111111&color=fff&size=100`
                            }
                            alt={author.name}
                            className="w-12 h-12 rounded-full object-cover flex-shrink-0 bg-gray-200 shadow-xs"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h4 className="font-bold text-gray-900 text-base group-hover:text-[#ce1126] transition-colors">
                                {author.name}
                              </h4>
                              <span className="bg-[#002f6c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-none uppercase tracking-wider">
                                WRITER
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                              {author.bio ||
                                "A dedicated journalist delivering accurate, timely, and impactful news and political insights on POLITICO."}
                            </p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 2. Articles Section (when typeFilter is "articles" or "all") */}
            {typeFilter !== "authors" && (
              <div>
                {/* Results Count Header */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold text-gray-600">
                    {activeQuery.trim() ? (
                      <span>
                        Found <strong className="text-gray-900">{filteredArticles.length}</strong> {filteredArticles.length === 1 ? "article" : "articles"} for &quot;<span className="text-[#ce1126]">{activeQuery}</span>&quot;
                      </span>
                    ) : (
                      <span>
                        Showing latest <strong className="text-gray-900">{filteredArticles.length}</strong> published stories
                      </span>
                    )}
                  </p>

                  {totalPages > 1 && (
                    <span className="text-xs font-bold text-gray-400">
                      Page {currentPage} of {totalPages}
                    </span>
                  )}
                </div>

                {filteredArticles.length === 0 ? (
                  <div className="bg-white rounded-none shadow-sm border border-gray-200/80 p-16 text-center">
                    <p className="text-base font-bold text-gray-700 uppercase">No articles found</p>
                    <p className="text-xs text-gray-400 mt-1">Try adjusting your search keywords</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-white rounded-none shadow-sm border border-gray-200/80 divide-y divide-gray-100 overflow-hidden">
                      {paginatedArticles.map((article) => {
                        const articleUrl = `/news/${article.slug}`;
                        const writerDisplay = article.writer_name || article.writer_email?.split("@")[0] || "Staff Writer";
                        const dateDisplay = formatPublishDate(article.created_at || article.updated_at);

                        return (
                          <article 
                            key={article.id} 
                            className="p-5 sm:p-6 hover:bg-gray-50/70 transition-colors group flex flex-col sm:flex-row gap-5 items-start"
                          >
                            {/* Thumbnail Image */}
                            {article.image ? (
                              <a 
                                href={articleUrl} 
                                className="w-full sm:w-48 md:w-56 aspect-[16/10] sm:aspect-[4/3] rounded-none overflow-hidden bg-gray-100 flex-shrink-0 block shadow-sm"
                              >
                                <img 
                                  src={article.image} 
                                  alt={article.title} 
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                                  loading="lazy"
                                />
                              </a>
                            ) : (
                              <a 
                                href={articleUrl} 
                                className="w-full sm:w-48 md:w-56 aspect-[16/10] sm:aspect-[4/3] rounded-none bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-300 block"
                              >
                                <BookOpen className="w-10 h-10 stroke-[1.5]" />
                              </a>
                            )}

                            {/* Article Details */}
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                {/* Meta Category & Read Time */}
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                  {article.category && (
                                    <span className="text-[11px] font-black uppercase tracking-wider text-[#ce1126]">
                                      {article.category}
                                    </span>
                                  )}
                                  <span className="text-gray-300">•</span>
                                  <span className="text-[11px] font-medium text-gray-500">
                                    {article.read_time || "5 min read"}
                                  </span>
                                </div>

                                {/* Title */}
                                <a href={articleUrl} className="block">
                                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-[#ce1126] transition-colors leading-snug line-clamp-2">
                                    {article.title}
                                  </h2>
                                </a>

                                {/* Deck / Summary */}
                                {article.deck && (
                                  <p className="mt-2 text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                    {article.deck}
                                  </p>
                                )}
                              </div>

                              {/* Footer Byline, Date & Save/Share */}
                              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-4 flex-wrap">
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                  <span className="font-bold text-gray-800 flex items-center gap-1.5">
                                    <UserIcon className="w-3.5 h-3.5 text-gray-400" />
                                    {writerDisplay}
                                  </span>
                                  <span className="text-gray-300">•</span>
                                  <span className="flex items-center gap-1 text-[11px] font-semibold text-gray-400">
                                    <Clock className="w-3 h-3 text-gray-400" />
                                    {dateDisplay}
                                  </span>
                                </div>

                                <div className="shrink-0">
                                  <SaveShareButtons
                                    title={article.title}
                                    slug={article.slug}
                                    image={article.image}
                                    deck={article.deck}
                                    category={article.category}
                                    byline={writerDisplay}
                                    readTime={article.read_time}
                                    size="sm"
                                  />
                                </div>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 pt-6">
                        <button
                          type="button"
                          disabled={currentPage === 1}
                          onClick={() => {
                            setCurrentPage((p) => Math.max(1, p - 1));
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="px-3 py-2 rounded-none border border-gray-300 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Previous</span>
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                          if (
                            pageNum === 1 || 
                            pageNum === totalPages || 
                            (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                          ) {
                            return (
                              <button
                                key={pageNum}
                                type="button"
                                onClick={() => {
                                  setCurrentPage(pageNum);
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className={`w-9 h-9 rounded-none text-xs font-bold transition-colors cursor-pointer ${
                                  currentPage === pageNum
                                    ? "bg-[#ce1126] text-white shadow-sm"
                                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                          if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                            return (
                              <span key={pageNum} className="px-1 text-gray-400 text-xs">
                                ...
                              </span>
                            );
                          }
                          return null;
                        })}

                        <button
                          type="button"
                          disabled={currentPage === totalPages}
                          onClick={() => {
                            setCurrentPage((p) => Math.min(totalPages, p + 1));
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="px-3 py-2 rounded-none border border-gray-300 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                        >
                          <span>Next</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#ce1126]" />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
