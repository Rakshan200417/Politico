"use client";

import React, { useState, useEffect, useMemo } from "react";
import DashboardShell, { NavItem } from "@/components/dashboard/DashboardShell";
import {
  BarChart3,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Trash2,
  PlusCircle,
  Sparkles,
  Search,
  Plus,
  Loader2,
} from "lucide-react";
import WriterEditor, { ArticleData } from "@/components/writer/WriterEditor";
import WriterPostCard from "@/components/writer/WriterPostCard";

type TabType = "overview" | "published" | "drafts" | "pending" | "rejected" | "trash";

export default function WriterDashboard() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleData | null>(null);

  // User session
  const [user, setUser] = useState<{
    id?: number | string;
    name?: string;
    role: string;
    email: string;
    avatar_url?: string;
  } | null>(null);

  // Articles state
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load User Data
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch (e) {
        console.error("Error parsing user:", e);
      }
    } else {
      const fallbackUser = {
        name: "Rakshan Writer",
        email: "writer@politico.com",
        role: "writer",
      };
      setUser(fallbackUser);
    }
  }, []);

  // Fetch articles from DB (with fallback to localStorage)
  const loadArticles = async () => {
    setIsLoading(true);
    const email = user?.email || "writer@politico.com";

    try {
      const res = await fetch(`/api/articles?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.articles && data.articles.length > 0) {
          setArticles(data.articles);
          localStorage.setItem("writer_articles", JSON.stringify(data.articles));
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Could not fetch articles from DB, checking local storage:", err);
    }

    // Fallback to localStorage
    const local = localStorage.getItem("writer_articles");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (parsed.length > 0) {
          setArticles(parsed);
          setIsLoading(false);
          return;
        }
      } catch (e) {
        console.error("Failed to parse local articles:", e);
      }
    }

    // Default mock seed article
    const initialSeed: ArticleData[] = [
      {
        id: 1,
        title: "Federal Reserve Signals Shift in Upcoming Interest Rate Meeting",
        deck: "Policymakers weigh new labor market indicators before committing to quantitative adjustments in Washington.",
        content: "<p>Federal Reserve officials are preparing for what could be their most critical policy meeting of the fiscal year...</p>",
        category: "Economy",
        subcategories: ["Government Economic Policies", "GDP & Economic Growth"],
        tags: ["Fed", "InterestRates", "Economy"],
        read_time: "4 min read",
        status: "draft",
        card_summary: "Federal Reserve officials analyze labor market data before their policy meeting.",
        focus_keyword: "Federal Reserve Interest Rates",
        meta_description: "Discover how the latest Federal Reserve meeting is set to shape policy and interest rate trends across national markets.",
        slug: "federal-reserve-signals-shift-in-interest-rate-meeting",
      },
    ];

    setArticles(initialSeed);
    localStorage.setItem("writer_articles", JSON.stringify(initialSeed));
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      loadArticles();
    }
  }, [user?.email]);

  // Tab counts
  const publishedArticles = useMemo(
    () => articles.filter((a) => a.status === "published"),
    [articles]
  );
  const draftArticles = useMemo(
    () => articles.filter((a) => a.status === "draft"),
    [articles]
  );
  const pendingArticles = useMemo(
    () => articles.filter((a) => a.status === "pending"),
    [articles]
  );
  const rejectedArticles = useMemo(
    () => articles.filter((a) => a.status === "rejected"),
    [articles]
  );
  const trashArticles = useMemo(
    () => articles.filter((a) => a.status === "trash"),
    [articles]
  );

  // Filtered by current tab and search query
  const displayedArticles = useMemo(() => {
    let list: ArticleData[] = [];
    if (activeTab === "published") list = publishedArticles;
    else if (activeTab === "drafts") list = draftArticles;
    else if (activeTab === "pending") list = pendingArticles;
    else if (activeTab === "rejected") list = rejectedArticles;
    else if (activeTab === "trash") list = trashArticles;

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        (a.deck && a.deck.toLowerCase().includes(q)) ||
        (a.category && a.category.toLowerCase().includes(q)) ||
        (a.tags && a.tags.some((t) => t.toLowerCase().includes(q)))
    );
  }, [
    activeTab,
    searchQuery,
    publishedArticles,
    draftArticles,
    pendingArticles,
    rejectedArticles,
    trashArticles,
  ]);

  // Sidebar Nav Items (Removed Categories and Write Story as requested!)
  const writerNavItems: NavItem[] = [
    { id: "overview", label: "Dashboard", icon: BarChart3 },
    {
      id: "published",
      label: "My Articles",
      icon: CheckCircle2,
      badge: publishedArticles.length,
    },
    {
      id: "drafts",
      label: "Saved Drafts",
      icon: Clock,
      badge: draftArticles.length,
    },
    {
      id: "pending",
      label: "Pending Review",
      icon: FileText,
      badge: pendingArticles.length,
    },
    {
      id: "rejected",
      label: "Rejected",
      icon: XCircle,
      badge: rejectedArticles.length,
    },
    {
      id: "trash",
      label: "Trash",
      icon: Trash2,
      badge: trashArticles.length,
    },
  ];

  // Handler: Start creating new post
  const handleCreateNewPost = () => {
    setEditingArticle(null);
    setIsEditing(true);
  };

  // Handler: Edit existing article (from drafts, pending review, rejected, or published)
  const handleEditArticle = (article: ArticleData) => {
    setEditingArticle(article);
    setIsEditing(true);
  };

  // Handler: Delete article -> Move to Trash
  const handleDeleteArticle = async (article: ArticleData) => {
    if (!article.id) return;

    // 1. Optimistic UI update
    const updated = articles.map((a) =>
      a.id === article.id ? { ...a, status: "trash" as const } : a
    );
    setArticles(updated);
    localStorage.setItem("writer_articles", JSON.stringify(updated));

    // 2. Persist to DB
    try {
      await fetch(`/api/articles?id=${article.id}&email=${encodeURIComponent(user?.email || "")}&action=trash`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to move article to trash in DB:", err);
    }
  };

  // Handler: Restore article from Trash back to Draft
  const handleRestoreArticle = async (article: ArticleData) => {
    if (!article.id) return;

    // 1. Optimistic UI update
    const updated = articles.map((a) =>
      a.id === article.id ? { ...a, status: "draft" as const } : a
    );
    setArticles(updated);
    localStorage.setItem("writer_articles", JSON.stringify(updated));

    // 2. Persist to DB
    try {
      await fetch("/api/articles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: article.id,
          status: "draft",
          writer_email: user?.email,
        }),
      });
    } catch (err) {
      console.error("Failed to restore article in DB:", err);
    }
  };

  // Handler: Delete permanently from Trash
  const handlePermanentDelete = async (article: ArticleData) => {
    if (!article.id) return;
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this article? This cannot be undone."
      )
    ) {
      return;
    }

    // 1. Optimistic UI update
    const updated = articles.filter((a) => a.id !== article.id);
    setArticles(updated);
    localStorage.setItem("writer_articles", JSON.stringify(updated));

    // 2. Persist to DB
    try {
      await fetch(`/api/articles?id=${article.id}&email=${encodeURIComponent(user?.email || "")}&action=permanent`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to permanent delete from DB:", err);
    }
  };

  // Handler: Save success from WriterEditor
  const handleSaveSuccess = (savedArticle: ArticleData, action: "draft" | "pending") => {
    setArticles((prev) => {
      const idx = prev.findIndex((a) => a.id === savedArticle.id);
      let updated: ArticleData[];
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = savedArticle;
      } else {
        updated = [savedArticle, ...prev];
      }
      localStorage.setItem("writer_articles", JSON.stringify(updated));
      return updated;
    });

    setIsEditing(false);
    setEditingArticle(null);
    if (action === "pending") {
      setActiveTab("pending");
    } else {
      setActiveTab("drafts");
    }
  };

  const displayName = user?.name || user?.email?.split("@")[0] || "Writer";

  // If in editor view, render full-canvas WriterEditor
  if (isEditing) {
    return (
      <WriterEditor
        initialArticle={editingArticle}
        onCancel={() => {
          setIsEditing(false);
          setEditingArticle(null);
        }}
        onSaveSuccess={handleSaveSuccess}
        userEmail={user?.email || "writer@politico.com"}
        userName={displayName}
      />
    );
  }

  const getSectionTitle = () => {
    switch (activeTab) {
      case "published":
        return "My Articles (Published)";
      case "drafts":
        return "Saved Drafts";
      case "pending":
        return "Pending Review";
      case "rejected":
        return "Rejected Articles";
      case "trash":
        return "Trash";
      default:
        return "Writer Dashboard";
    }
  };

  return (
    <DashboardShell
      portalTitle="Writer Workspace"
      portalBadge="Writer"
      role="writer"
      navItems={writerNavItems}
      activeTab={activeTab}
      onTabChange={(tab) => setActiveTab(tab as TabType)}
    >
      {/* Top Banner (when in overview) */}
      {activeTab === "overview" && (
        <>
          <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-800 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-gray-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-xs font-semibold text-white/90 mb-3 border border-white/10">
                <Sparkles size={13} className="text-[#ce1126]" /> Editorial Contributor Portal
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Welcome back, {displayName}
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm mt-1 max-w-xl">
                Draft, edit, and submit stories across POLITICO categories. Manage review queues and published work.
              </p>
            </div>

            <button
              onClick={handleCreateNewPost}
              className="bg-[#ce1126] hover:bg-[#b00d1f] text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <PlusCircle size={16} /> + Create New Post
            </button>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
            {/* Published */}
            <div
              onClick={() => setActiveTab("published")}
              className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:border-[#2563eb] cursor-pointer transition-all"
            >
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Published
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">
                {publishedArticles.length}
              </div>
              <div className="text-[11px] text-gray-400 mt-1">Live on POLITICO</div>
            </div>

            {/* Saved Drafts */}
            <div
              onClick={() => setActiveTab("drafts")}
              className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:border-[#2563eb] cursor-pointer transition-all"
            >
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Saved Drafts
              </div>
              <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
                {draftArticles.length}
              </div>
              <div className="text-[11px] text-gray-400 mt-1">In progress</div>
            </div>

            {/* Pending Review */}
            <div
              onClick={() => setActiveTab("pending")}
              className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:border-[#2563eb] cursor-pointer transition-all"
            >
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Pending Review
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-2">
                {pendingArticles.length}
              </div>
              <div className="text-[11px] text-gray-400 mt-1">Awaiting approval</div>
            </div>

            {/* Rejected */}
            <div
              onClick={() => setActiveTab("rejected")}
              className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:border-[#2563eb] cursor-pointer transition-all"
            >
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Rejected
              </div>
              <div className="text-2xl sm:text-3xl font-black text-rose-600 mt-2">
                {rejectedArticles.length}
              </div>
              <div className="text-[11px] text-gray-400 mt-1">Requires revision</div>
            </div>
          </div>
        </>
      )}

      {/* Section Header with Single "+ Create New Post" button (No duplicate button) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
            {getSectionTitle()}
          </h2>
          {activeTab !== "overview" && (
            <p className="text-xs text-gray-500 mt-1">
              Manage and track your articles in this section.
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Search bar */}
          {activeTab !== "overview" && (
            <div className="relative w-full sm:w-64">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 shadow-2xs transition"
              />
            </div>
          )}

          {/* Single + Create New Post button (rendered on specific section tabs; overview has the prominent banner button) */}
          {activeTab !== "overview" && (
            <button
              onClick={handleCreateNewPost}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-black uppercase tracking-wider shadow-sm hover:shadow-md transition flex-shrink-0"
            >
              <Plus size={15} strokeWidth={3} />
              <span>+ Create New Post</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-tabs navigation for fast switching between article sections */}
      <div className="border-b border-gray-200 pb-2 mb-6 flex items-center gap-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("overview")}
          className={`text-xs font-bold pb-2 relative transition-colors ${
            activeTab === "overview"
              ? "text-[#2563eb]"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Overview
          {activeTab === "overview" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563eb] rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("published")}
          className={`text-xs font-bold pb-2 relative transition-colors ${
            activeTab === "published"
              ? "text-[#2563eb]"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Published
          {publishedArticles.length > 0 && (
            <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-gray-100 text-gray-700">
              {publishedArticles.length}
            </span>
          )}
          {activeTab === "published" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563eb] rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("drafts")}
          className={`text-xs font-bold pb-2 relative transition-colors ${
            activeTab === "drafts"
              ? "text-[#2563eb]"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Drafts
          {draftArticles.length > 0 && (
            <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-gray-100 text-gray-700">
              {draftArticles.length}
            </span>
          )}
          {activeTab === "drafts" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563eb] rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("pending")}
          className={`text-xs font-bold pb-2 relative transition-colors ${
            activeTab === "pending"
              ? "text-[#2563eb]"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Pending Review
          {pendingArticles.length > 0 && (
            <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800">
              {pendingArticles.length}
            </span>
          )}
          {activeTab === "pending" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563eb] rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("rejected")}
          className={`text-xs font-bold pb-2 relative transition-colors ${
            activeTab === "rejected"
              ? "text-[#2563eb]"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Rejected
          {rejectedArticles.length > 0 && (
            <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800">
              {rejectedArticles.length}
            </span>
          )}
          {activeTab === "rejected" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563eb] rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("trash")}
          className={`text-xs font-bold pb-2 relative transition-colors ${
            activeTab === "trash"
              ? "text-[#2563eb]"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Trash
          {trashArticles.length > 0 && (
            <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-gray-100 text-gray-700">
              {trashArticles.length}
            </span>
          )}
          {activeTab === "trash" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563eb] rounded-full" />
          )}
        </button>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center text-gray-400">
          <Loader2 size={32} className="animate-spin text-[#2563eb] mb-3" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Loading your articles...
          </span>
        </div>
      ) : activeTab === "overview" ? (
        /* Overview Activity Feed */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Recent Stories</h3>
            <button
              onClick={() => setActiveTab("drafts")}
              className="text-xs font-bold text-[#2563eb] hover:underline"
            >
              View All Drafts →
            </button>
          </div>

          {articles.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
              <p className="text-xs text-gray-500 mb-4">You haven&apos;t created any articles yet.</p>
              <button
                onClick={handleCreateNewPost}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold"
              >
                <Plus size={14} /> Start Your First Story
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {articles.slice(0, 4).map((article) => (
                <WriterPostCard
                  key={article.id}
                  article={article}
                  onEdit={handleEditArticle}
                  onDelete={handleDeleteArticle}
                  onRestore={article.status === "trash" ? handleRestoreArticle : undefined}
                  onPermanentDelete={
                    article.status === "trash" ? handlePermanentDelete : undefined
                  }
                />
              ))}
            </div>
          )}
        </div>
      ) : displayedArticles.length === 0 ? (
        /* Empty State */
        <div className="border border-gray-200 rounded-2xl bg-white p-12 sm:p-16 flex flex-col items-center justify-center text-center shadow-xs">
          {/* Abstract SVG illustration */}
          <div className="relative w-40 h-32 mb-6 flex items-center justify-center select-none pointer-events-none">
            <div className="absolute top-2 left-6 w-9 h-9 bg-[#1e293b] rounded-xl transform -rotate-12" />
            <div className="absolute bottom-2 left-8 w-14 h-7 bg-[#eab308] rounded-b-full transform -rotate-6" />
            <div className="absolute top-14 right-6 w-5 h-5 bg-[#14b8a6] rounded-full" />
            <div className="absolute top-4 right-8 w-8 h-14 border-t-4 border-r-4 border-pink-300 rounded-tr-full transform rotate-12 opacity-80" />
            <div className="relative z-10 w-14 h-14 bg-[#2563eb] rounded-2xl flex items-center justify-center text-white shadow-lg transform rotate-3">
              <Plus size={26} strokeWidth={3} />
            </div>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-1.5">
            Share what&apos;s on your mind
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mb-6">
            Create or import posts to start publishing in {getSectionTitle()}.
          </p>

          <button
            onClick={handleCreateNewPost}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563eb] hover:text-[#1d4ed8] hover:underline"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>+ Create Post</span>
          </button>
        </div>
      ) : (
        /* Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayedArticles.map((article) => (
            <WriterPostCard
              key={article.id}
              article={article}
              onEdit={handleEditArticle}
              onDelete={handleDeleteArticle}
              onRestore={activeTab === "trash" ? handleRestoreArticle : undefined}
              onPermanentDelete={
                activeTab === "trash" ? handlePermanentDelete : undefined
              }
            />
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
