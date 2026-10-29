"use client";

import React, { useEffect, useRef, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import SaveShareButtons from "@/components/common/SaveShareButtons";
import { formatPublishDate } from "@/utils/dateFormatter";
import { 
  Search, 
  X, 
  Loader2, 
  TrendingUp, 
  Calendar, 
  User as UserIcon, 
  Clock, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  BookOpen
} from "lucide-react";

const TRENDING_CATEGORIES = [
  "World", "Companies", "Startups", "Markets", 
  "Economy", "Finance", "Technology", "Industries", 
  "Leaders"
];

const ITEMS_PER_PAGE = 10;

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQ = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "all";

  const [query, setQuery] = useState(initialQ);
  const [activeQuery, setActiveQuery] = useState(initialQ);
  const [typeFilter, setTypeFilter] = useState<"all" | "articles" | "authors">("all");
  const [timeFilter, setTimeFilter] = useState<"all" | "today" | "week" | "month">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "relevance">("newest");
  
  const [rawArticles, setRawArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync with searchParams on initial mount or URL navigation
  useEffect(() => {
    const qFromUrl = searchParams.get("q") || "";
    const catFromUrl = searchParams.get("category") || "all";
    if (qFromUrl !== activeQuery) {
      setQuery(qFromUrl);
      setActiveQuery(qFromUrl);
    }
    if (catFromUrl !== categoryFilter) {
      setCategoryFilter(catFromUrl);
    }
  }, [searchParams]);

  // Update URL parameter without reload
  const updateUrl = (newQuery: string, newCat: string = categoryFilter) => {
    const params = new URLSearchParams();
    if (newQuery.trim()) params.set("q", newQuery.trim());
    if (newCat && newCat !== "all") params.set("category", newCat);
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

  // Handle typing debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== activeQuery) {
        setActiveQuery(query);
        updateUrl(query, categoryFilter);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle explicit form submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveQuery(query);
    updateUrl(query, categoryFilter);
  };

  const handleClear = () => {
    setQuery("");
    setActiveQuery("");
    updateUrl("", categoryFilter);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleCategorySelect = (cat: string) => {
    const newCat = categoryFilter === cat ? "all" : cat;
    setCategoryFilter(newCat);
    updateUrl(activeQuery, newCat);
  };

  const handleTrendingClick = (cat: string) => {
    setQuery(cat);
    setActiveQuery(cat);
    setCategoryFilter("all");
    updateUrl(cat, "all");
  };

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    let list = [...rawArticles];

    // Category filter
    if (categoryFilter !== "all") {
      list = list.filter(
        (a) => a.category?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Type filter
    if (typeFilter === "articles" && activeQuery.trim()) {
      const q = activeQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.title?.toLowerCase().includes(q) ||
          a.deck?.toLowerCase().includes(q) ||
          (Array.isArray(a.tags) && a.tags.some((t: string) => t.toLowerCase().includes(q)))
      );
    } else if (typeFilter === "authors" && activeQuery.trim()) {
      const q = activeQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.writer_name?.toLowerCase().includes(q) ||
          a.writer_email?.toLowerCase().includes(q)
      );
    }

    // Time filter
    if (timeFilter !== "all") {
      const now = new Date().getTime();
      let cutoff = 0;
      if (timeFilter === "today") cutoff = 24 * 60 * 60 * 1000;
      else if (timeFilter === "week") cutoff = 7 * 24 * 60 * 60 * 1000;
      else if (timeFilter === "month") cutoff = 30 * 24 * 60 * 60 * 1000;

      list = list.filter((a) => {
        const articleDate = new Date(a.created_at || a.updated_at).getTime();
        return now - articleDate <= cutoff;
      });
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === "oldest") {
        return new Date(a.created_at || a.updated_at).getTime() - new Date(b.created_at || b.updated_at).getTime();
      }
      if (sortBy === "relevance" && activeQuery.trim()) {
        const q = activeQuery.toLowerCase();
        const aTitleMatch = a.title?.toLowerCase().includes(q) ? 2 : 0;
        const bTitleMatch = b.title?.toLowerCase().includes(q) ? 2 : 0;
        return bTitleMatch - aTitleMatch;
      }
      // default: newest
      return new Date(b.created_at || b.updated_at).getTime() - new Date(a.created_at || a.updated_at).getTime();
    });

    return list;
  }, [rawArticles, activeQuery, categoryFilter, typeFilter, timeFilter, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  const activeFiltersCount = 
    (typeFilter !== "all" ? 1 : 0) + 
    (timeFilter !== "all" ? 1 : 0) + 
    (categoryFilter !== "all" ? 1 : 0);

  const resetAllFilters = () => {
    setTypeFilter("all");
    setTimeFilter("all");
    setCategoryFilter("all");
    setSortBy("newest");
    updateUrl(activeQuery, "all");
  };

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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6 sm:p-8 mb-8">
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
                className="w-full pl-12 pr-12 py-3.5 sm:py-4 bg-gray-50 border border-gray-300 rounded-xl text-base sm:text-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ce1126] focus:border-transparent transition-all shadow-inner"
              />
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3.5 p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  aria-label="Clear search query"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="ml-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#ce1126] hover:bg-[#a00c1c] text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-colors shadow-sm flex items-center gap-2 flex-shrink-0"
            >
              <span>Search</span>
            </button>
          </form>

          {/* Trending Categories Tags */}
          <div className="mt-5 flex items-center flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-gray-500 font-bold uppercase tracking-wider mr-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#ce1126]" />
              <span>Trending:</span>
            </div>
            {TRENDING_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleTrendingClick(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                  activeQuery.toLowerCase() === cat.toLowerCase()
                    ? "bg-[#1e293b] text-white border-[#1e293b]"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:border-[#ce1126] hover:text-[#ce1126]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-4 mb-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
            {/* Type Filters */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setTypeFilter("all")}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  typeFilter === "all" ? "bg-[#1e293b] text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                All Results
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter("articles")}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  typeFilter === "articles" ? "bg-[#1e293b] text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Articles
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter("authors")}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  typeFilter === "authors" ? "bg-[#1e293b] text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Authors
              </button>
            </div>

            {/* Time Filter */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setTimeFilter("all")}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  timeFilter === "all" ? "bg-[#1e293b] text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                All Time
              </button>
              <button
                type="button"
                onClick={() => setTimeFilter("today")}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  timeFilter === "today" ? "bg-[#1e293b] text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setTimeFilter("week")}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  timeFilter === "week" ? "bg-[#1e293b] text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                This Week
              </button>
              <button
                type="button"
                onClick={() => setTimeFilter("month")}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  timeFilter === "month" ? "bg-[#1e293b] text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                This Month
              </button>
            </div>

            {/* Category Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="catSelect" className="text-gray-500 font-semibold text-xs">Category:</label>
              <select
                id="catSelect"
                value={categoryFilter}
                onChange={(e) => handleCategorySelect(e.target.value)}
                className="bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#ce1126]"
              >
                <option value="all">All Categories</option>
                {TRENDING_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Sort & Reset */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end text-xs font-semibold">
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-[#ce1126] hover:underline"
              >
                Reset Filters ({activeFiltersCount})
              </button>
            )}

            <div className="flex items-center gap-2">
              <span className="text-gray-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#ce1126]"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="relevance">Most Relevant</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count Header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-gray-600">
            {isLoading ? (
              <span>Searching articles...</span>
            ) : activeQuery.trim() ? (
              <span>
                Found <strong className="text-gray-900">{filteredArticles.length}</strong> {filteredArticles.length === 1 ? "result" : "results"} for &quot;<span className="text-[#ce1126]">{activeQuery}</span>&quot;
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

        {/* Results Area */}
        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-16 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-10 h-10 animate-spin text-[#ce1126] mb-4" />
            <p className="text-base font-bold text-gray-800 uppercase tracking-widest">Searching articles...</p>
            <p className="text-xs text-gray-400 mt-1">Fetching matching headlines, summaries, and bylines</p>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 divide-y divide-gray-100 overflow-hidden">
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
                        className="w-full sm:w-48 md:w-56 aspect-[16/10] sm:aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 block shadow-sm"
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
                        className="w-full sm:w-48 md:w-56 aspect-[16/10] sm:aspect-[4/3] rounded-lg bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-300 block"
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
                            <button
                              type="button"
                              onClick={() => handleCategorySelect(article.category)}
                              className="text-[11px] font-black uppercase tracking-wider text-[#ce1126] hover:underline cursor-pointer"
                            >
                              {article.category}
                            </button>
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
                  className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  // Only display nearby page numbers
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
                        className={`w-9 h-9 rounded-lg text-xs font-bold transition-colors ${
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
                      <span key={pageNum} className="text-gray-400 px-1 font-bold">...</span>
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
                  className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Empty Search State */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-12 sm:p-16 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-red-50 text-[#ce1126] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {activeQuery.trim() ? `No results found for "${activeQuery}"` : "No articles found"}
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              {activeFiltersCount > 0 
                ? "Try adjusting or clearing your filters to see more results."
                : "Check your spelling, try more general terms, or explore one of the trending categories below."}
            </p>

            {activeFiltersCount > 0 ? (
              <button
                type="button"
                onClick={resetAllFilters}
                className="px-5 py-2.5 bg-[#ce1126] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#a00c1c] transition-colors"
              >
                Clear All Filters
              </button>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-2">
                {TRENDING_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleTrendingClick(cat)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-red-50 hover:text-[#ce1126] rounded-full transition-colors"
                  >
                    {cat}
                  </button>
                ))}
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
        <div className="min-h-screen bg-white flex flex-col font-sans">
          <Header />
          <div className="flex-1 flex flex-col items-center justify-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-[#ce1126] mb-3" />
            <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Loading Search...</p>
          </div>
          <Footer />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}

