"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Bookmark, Share2, Check } from "lucide-react";
import { slugify } from "@/data/newsArticles";

export interface SaveShareArticleData {
  title?: string;
  slug?: string;
  url?: string;
  image?: string;
  category?: string;
  byline?: string;
  deck?: string;
  readTime?: string;
  className?: string;
  size?: "sm" | "md";
}

export default function SaveShareButtons({
  title = "",
  slug,
  url,
  image,
  category,
  byline,
  deck,
  readTime,
  className = "",
  size = "md",
}: SaveShareArticleData) {
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Compute canonical slug for the article
  const articleSlug = slug || slugify(title || "article");

  // Check login state from localStorage
  const checkUser = useCallback(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (
          parsed &&
          (parsed.role === "reader" ||
            parsed.role === "writer" ||
            parsed.role === "admin" ||
            Boolean(parsed.email))
        ) {
          setUser(parsed);
          return parsed;
        }
      }
      setUser(null);
      return null;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  // Check if this article is saved by the current user
  const checkSavedStatus = useCallback((activeUser: any) => {
    if (!activeUser || !articleSlug) {
      setIsSaved(false);
      return;
    }

    // Fast check local storage cache first
    try {
      const cacheKey = `politico_saved_${activeUser.email}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const list = JSON.parse(cached);
        if (Array.isArray(list) && list.some((item: any) => item.slug === articleSlug)) {
          setIsSaved(true);
        }
      }
    } catch {}

    // Verify with database API
    fetch(`/api/saved-articles?email=${encodeURIComponent(activeUser.email)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && Array.isArray(data.articles)) {
          const found = data.articles.some((a: any) => a.slug === articleSlug);
          setIsSaved(found);
          try {
            localStorage.setItem(`politico_saved_${activeUser.email}`, JSON.stringify(data.articles));
          } catch {}
        }
      })
      .catch(() => {});
  }, [articleSlug]);

  useEffect(() => {
    setMounted(true);
    const active = checkUser();
    if (active) {
      checkSavedStatus(active);
    }

    const handleUserUpdate = () => {
      const u = checkUser();
      if (u) checkSavedStatus(u);
    };

    const handleArticlesUpdate = (e: any) => {
      const activeUser = checkUser();
      if (e?.detail && e.detail.slug === articleSlug && typeof e.detail.isSaved === "boolean") {
        setIsSaved(e.detail.isSaved);
      } else if (activeUser) {
        checkSavedStatus(activeUser);
      }
    };

    window.addEventListener("userProfileUpdated", handleUserUpdate);
    window.addEventListener("storage", handleUserUpdate);
    window.addEventListener("savedArticlesUpdated", handleArticlesUpdate);

    return () => {
      window.removeEventListener("userProfileUpdated", handleUserUpdate);
      window.removeEventListener("storage", handleUserUpdate);
      window.removeEventListener("savedArticlesUpdated", handleArticlesUpdate);
    };
  }, [checkUser, checkSavedStatus, articleSlug]);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => {
      setShowToast(null);
    }, 2200);
  };

  // ONLY render if user is logged in as reader, writer, or admin
  if (!mounted || !user) {
    return null;
  }

  const dimClass = size === "sm" ? "w-7 h-7" : "w-8 h-8";
  const iconSize = size === "sm" ? 13 : 15;

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || !user.email) return;

    const nextSaved = !isSaved;
    setIsSaved(nextSaved);

    if (nextSaved) {
      triggerToast("Saved to Reading List");
      try {
        await fetch("/api/saved-articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_email: user.email,
            slug: articleSlug,
            title: title || articleSlug.replace(/-/g, " "),
            deck: deck || "",
            image: image || "",
            category: category || "News",
            byline: byline || "POLITICO",
            read_time: readTime || "3 min read",
          }),
        });

        // Update local cache
        const cacheKey = `politico_saved_${user.email}`;
        const existing = JSON.parse(localStorage.getItem(cacheKey) || "[]");
        const filtered = existing.filter((item: any) => item.slug !== articleSlug);
        filtered.unshift({
          slug: articleSlug,
          title: title || articleSlug.replace(/-/g, " "),
          deck: deck || "",
          image: image || "",
          category: category || "News",
          byline: byline || "POLITICO",
          read_time: readTime || "3 min read",
          created_at: new Date().toISOString(),
        });
        localStorage.setItem(cacheKey, JSON.stringify(filtered));
      } catch (err) {
        console.warn("Could not sync save to server:", err);
      }
    } else {
      triggerToast("Removed from Saved");
      try {
        await fetch(
          `/api/saved-articles?email=${encodeURIComponent(user.email)}&slug=${encodeURIComponent(articleSlug)}`,
          { method: "DELETE" }
        );

        // Update local cache
        const cacheKey = `politico_saved_${user.email}`;
        const existing = JSON.parse(localStorage.getItem(cacheKey) || "[]");
        const filtered = existing.filter((item: any) => item.slug !== articleSlug);
        localStorage.setItem(cacheKey, JSON.stringify(filtered));
      } catch (err) {
        console.warn("Could not sync delete to server:", err);
      }
    }

    // Broadcast update so Reader Dashboard and other components refresh immediately
    window.dispatchEvent(
      new CustomEvent("savedArticlesUpdated", {
        detail: { slug: articleSlug, isSaved: nextSaved },
      })
    );
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl =
      url ||
      (typeof window !== "undefined"
        ? `${window.location.origin}/news/${articleSlug}`
        : "");
    const shareTitle = title || (typeof document !== "undefined" ? document.title : "POLITICO");

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          url: shareUrl,
        });
        triggerToast("Story shared!");
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        triggerToast("Link copied to clipboard!");
      } catch {
        triggerToast("Could not copy link");
      }
    } else {
      triggerToast("Link ready to share");
    }
  };

  return (
    <div className={`relative inline-flex items-center gap-2 ${className}`}>
      {/* Save Button (Bookmark) - Left Side */}
      <button
        type="button"
        onClick={handleSave}
        title={isSaved ? "Remove from reading list" : "Save to reading list"}
        aria-label="Save story"
        className={`${dimClass} rounded-full border transition-all duration-200 flex items-center justify-center cursor-pointer shadow-2xs ${
          isSaved
            ? "border-[#ce1126] bg-red-50 text-[#ce1126]"
            : "border-gray-300 hover:border-gray-500 hover:bg-gray-50 text-[#4b5563]"
        }`}
      >
        <Bookmark
          size={iconSize}
          className={`transition-transform duration-150 ${
            isSaved ? "fill-[#ce1126] scale-110 text-[#ce1126]" : "scale-100"
          }`}
        />
      </button>

      {/* Share Button (Share2) - Right Side */}
      <button
        type="button"
        onClick={handleShare}
        title="Share story"
        aria-label="Share story"
        className={`${dimClass} rounded-full border border-gray-300 hover:border-gray-500 hover:bg-gray-50 text-[#4b5563] transition-all duration-200 flex items-center justify-center cursor-pointer shadow-2xs`}
      >
        <Share2 size={iconSize} />
      </button>

      {/* Toast Notification */}
      {showToast && (
        <div className="absolute -bottom-8 right-0 z-50 whitespace-nowrap rounded-md bg-[#111111] px-2.5 py-1 text-[11px] font-sans font-semibold text-white shadow-lg flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
          <Check size={12} className="text-emerald-400 flex-shrink-0" />
          <span>{showToast}</span>
        </div>
      )}
    </div>
  );
}
