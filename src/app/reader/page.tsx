"use client";

import React, { useState, useEffect, useCallback } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { BookOpen, Trash2, ArrowUpRight, Clock, Bookmark } from "lucide-react";

interface SavedArticle {
  id?: number;
  slug: string;
  title: string;
  deck?: string;
  image?: string;
  category?: string;
  byline?: string;
  read_time?: string;
  created_at?: string;
}

export default function ReaderDashboard() {
  const [user, setUser] = useState<any>(null);
  const [articles, setArticles] = useState<SavedArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const loadSavedArticles = useCallback(async (userEmail: string) => {
    // 1. Fast load from local storage cache
    const cacheKey = `politico_saved_${userEmail}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          setArticles(parsed);
          setIsLoading(false);
        }
      }
    } catch {}

    // 2. Fetch from DB
    try {
      const res = await fetch(`/api/saved-articles?email=${encodeURIComponent(userEmail)}`);
      const data = await res.json();
      if (data && Array.isArray(data.articles)) {
        setArticles(data.articles);
        try {
          localStorage.setItem(cacheKey, JSON.stringify(data.articles));
        } catch {}
      }
    } catch (err) {
      console.warn("Could not fetch saved articles from server:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        if (parsed.email) {
          loadSavedArticles(parsed.email);
        } else {
          setIsLoading(false);
        }
      } catch {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }

    const handleArticlesUpdate = () => {
      const uStr = localStorage.getItem("user");
      if (uStr) {
        try {
          const u = JSON.parse(uStr);
          if (u.email) loadSavedArticles(u.email);
        } catch {}
      }
    };

    window.addEventListener("savedArticlesUpdated", handleArticlesUpdate);
    window.addEventListener("userProfileUpdated", handleArticlesUpdate);
    window.addEventListener("storage", handleArticlesUpdate);

    return () => {
      window.removeEventListener("savedArticlesUpdated", handleArticlesUpdate);
      window.removeEventListener("userProfileUpdated", handleArticlesUpdate);
      window.removeEventListener("storage", handleArticlesUpdate);
    };
  }, [loadSavedArticles]);

  const handleDelete = async (e: React.MouseEvent, article: SavedArticle) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || !user.email) return;

    // Optimistic UI update: remove from local state immediately
    const updated = articles.filter((a) => a.slug !== article.slug);
    setArticles(updated);
    showToast("Article removed from saved list");

    // Update local cache
    try {
      localStorage.setItem(`politico_saved_${user.email}`, JSON.stringify(updated));
    } catch {}

    // Call DELETE API to remove from MySQL database
    try {
      await fetch(
        `/api/saved-articles?email=${encodeURIComponent(user.email)}&slug=${encodeURIComponent(article.slug)}`,
        { method: "DELETE" }
      );
    } catch (err) {
      console.warn("Could not delete from database:", err);
    }

    // Broadcast to update any active Save button on open pages
    window.dispatchEvent(
      new CustomEvent("savedArticlesUpdated", {
        detail: { slug: article.slug, isSaved: false },
      })
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#fbfbfc]">
      {/* Dashboard Top Navigation */}
      <DashboardHeader title="READERS DASHBOARD" />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 md:py-10">
        {/* Sub-Header Row */}
        <div className="flex items-center justify-between mb-6 border-b border-gray-200/80 pb-4">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-[#ce1126]" strokeWidth={2.5} />
            <h2 className="text-xs md:text-sm font-black text-gray-900 uppercase tracking-wider">
              SAVED ARTICLES
            </h2>
          </div>

          <span className="text-[11px] font-bold text-gray-500 border border-gray-200 rounded-full px-3 py-0.5 tracking-wider uppercase bg-white select-none shadow-2xs">
            {articles.length} {articles.length === 1 ? "ARTICLE" : "ARTICLES"}
          </span>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 h-64 p-3 space-y-3">
                <div className="bg-gray-100 aspect-[16/10] rounded-lg w-full" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State Card when no saved articles */}
        {!isLoading && articles.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200/70 p-12 md:p-20 flex flex-col items-center justify-center text-center shadow-[0_2px_12px_rgba(0,0,0,0.02)] min-h-[380px]">
            <div className="w-16 h-16 rounded-full bg-red-50/60 flex items-center justify-center mb-4 border border-red-100/80">
              <Bookmark className="w-7 h-7 text-[#ce1126]" strokeWidth={1.75} />
            </div>

            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1.5">
              No Saved Articles Yet
            </h3>

            <p className="text-xs md:text-sm text-gray-400 max-w-sm leading-relaxed mb-6">
              When you find a story you want to revisit, click the bookmark icon on any article to save it to your reading list.
            </p>

            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-[#ce1126] hover:bg-[#a00c1c] text-white px-5 py-2.5 rounded-full transition-colors shadow-xs"
            >
              Explore Top Stories
              <ArrowUpRight size={14} />
            </a>
          </div>
        )}

        {/* Saved Articles - Small Boxes Grid */}
        {!isLoading && articles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {articles.map((item) => (
              <div
                key={item.slug}
                className="relative group bg-white rounded-xl border border-gray-200/90 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-200 flex flex-col h-full"
              >
                {/* Delete Button in Top Corner - Appears when cursor moves on article box */}
                <button
                  type="button"
                  onClick={(e) => handleDelete(e, item)}
                  title="Remove from saved articles"
                  aria-label="Delete saved article"
                  className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-white/95 text-gray-400 hover:text-[#ce1126] hover:bg-red-50 shadow-md border border-gray-200/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-150 cursor-pointer"
                >
                  <Trash2 size={13} strokeWidth={2.2} />
                </button>

                {/* Clickable Article Box */}
                <a href={`/news/${item.slug}`} className="flex flex-col flex-1">
                  {/* Thumbnail Image */}
                  <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                    <img
                      src={
                        item.image ||
                        "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.category && (
                      <span className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-3.5 flex flex-col flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#ce1126] transition-colors line-clamp-2 leading-snug mb-2 font-sans">
                      {item.title}
                    </h4>

                    {item.deck && (
                      <p className="text-[11px] text-gray-500 font-serif line-clamp-2 leading-relaxed mb-3">
                        {item.deck}
                      </p>
                    )}

                    {/* Bottom Metadata Row */}
                    <div className="mt-auto pt-2.5 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-medium font-sans">
                      <span className="truncate max-w-[130px] uppercase font-bold text-gray-500">
                        {item.byline || "POLITICO"}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-gray-400">
                        <Clock size={11} />
                        {item.read_time || "3 min read"}
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-[#111111] px-4 py-2.5 text-xs font-sans font-bold text-white shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}
      </main>
    </div>
  );
}
