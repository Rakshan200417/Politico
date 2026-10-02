"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search, X, Loader2, ArrowRight } from "lucide-react";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(`/api/articles?search=${encodeURIComponent(query)}&status=published`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.articles || []);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  if (!isOpen) return null;

  const trendingCategories = [
    "World", "Companies", "Startups", "Markets", 
    "Economy", "Finance", "Technology", "Industries", 
    "Leaders"
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4 overflow-y-auto">
      {/* Background click listener */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
        {/* Top Search Input Area */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <Search className="w-5 h-5 text-[#24427c]" strokeWidth={2.5} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, authors, topics..."
            className="flex-1 text-lg text-gray-800 placeholder-gray-400 bg-transparent border-none focus:outline-none focus:ring-0"
          />
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Area */}
        <div className="px-6 py-4 flex flex-wrap items-center gap-6 border-b border-gray-100 flex-shrink-0">
          {/* Type Filters */}
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-xs font-bold bg-[#1e293b] text-white rounded-full">All</button>
            <button className="px-3 py-1 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-full transition-colors">Articles</button>
            <button className="px-3 py-1 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-full transition-colors">Authors</button>
          </div>
          
          {/* Time Filters */}
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-xs font-bold bg-[#1e293b] text-white rounded-full">All Time</button>
            <button className="px-3 py-1 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-full transition-colors">Today</button>
            <button className="px-3 py-1 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-full transition-colors">This Week</button>
            <button className="px-3 py-1 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-full transition-colors">This Month</button>
          </div>
        </div>

        {/* Results / Default Content */}
        <div className="overflow-y-auto flex-1 bg-gray-50/30">
          {query.trim() === "" ? (
            <div className="px-6 pt-5 pb-8">
              <div className="flex items-center gap-1.5 text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                <TrendingUpIcon className="w-3.5 h-3.5" />
                <span>Trending Categories</span>
              </div>
              
              <div className="flex flex-wrap gap-2.5">
                {trendingCategories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setQuery(cat)}
                    className="px-4 py-1.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-full hover:border-[#24427c] hover:text-[#24427c] transition-colors shadow-sm hover:shadow"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          ) : isLoading ? (
            <div className="px-6 py-12 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#ce1126]" />
              <span className="text-sm font-bold uppercase tracking-widest">Searching...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col">
              {results.map((article) => (
                <a 
                  key={article.id} 
                  href={`/news/${article.slug}`} 
                  onClick={onClose}
                  className="px-6 py-4 border-b border-gray-100 hover:bg-gray-50 flex items-start gap-4 transition-colors group"
                >
                  {article.image && (
                    <div className="w-20 h-14 rounded overflow-hidden flex-shrink-0 bg-gray-200 hidden sm:block">
                      <img src={article.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#ce1126] transition-colors truncate">
                      {article.title}
                    </h4>
                    {article.deck && (
                      <p className="text-xs text-gray-500 mt-1 truncate">{article.deck}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <span className="text-[#ce1126]">{article.category}</span>
                      <span>•</span>
                      <span>{article.writer_name || article.writer_email?.split('@')[0] || 'Unknown'}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#ce1126] mt-2 flex-shrink-0 transition-colors" />
                </a>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 flex flex-col items-center justify-center text-gray-400">
              <Search className="w-12 h-12 mb-4 text-gray-200" />
              <p className="text-sm font-bold text-gray-500">No results found for "{query}"</p>
              <p className="text-xs mt-1">Try searching for a different topic, author, or keyword.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 flex items-center justify-between border-t border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
            <span className="flex items-center gap-1"><kbd className="bg-white border border-gray-200 rounded px-1.5 py-0.5 text-[10px] font-sans shadow-sm text-gray-600">Enter</kbd> to search</span>
            <span className="flex items-center gap-1"><kbd className="bg-white border border-gray-200 rounded px-1.5 py-0.5 text-[10px] font-sans shadow-sm text-gray-600">Esc</kbd> to close</span>
          </div>
          <div className="text-xs font-black text-[#24427c]">
            POLITICO
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple internal icon for the trending part
function TrendingUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  );
}
