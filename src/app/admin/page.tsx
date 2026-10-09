"use client";

import React, { useState, useEffect } from "react";
import DashboardShell, { NavItem } from "@/components/dashboard/DashboardShell";
import {
  LayoutDashboard,
  Mail,
  FileText,
  Users,
  Megaphone,
  MessageSquare,
  TrendingUp,
  Database,
  Video,
  CheckCircle2,
  Inbox,
  Settings,
  Search,
  Loader2,
  Trash2,
  Eye,
  Edit,
  UserPlus,
  X
} from "lucide-react";
import WriterEditor, { ArticleData } from "@/components/writer/WriterEditor";
import ManageAds from "@/components/admin/ManageAds";
import ContactUsSubmissions from "@/components/admin/ContactUsSubmissions";
import AdvertiseLeads from "@/components/admin/AdvertiseLeads";

interface AdminArticleData extends ArticleData {
  writer_name?: string;
  writer_email?: string;
  updated_at?: string;
  views?: number;
  comments_count?: number;
}

const adminNavItems: NavItem[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "newsletter", label: "Newsletter", icon: Mail },
  { id: "published", label: "Published Posts", icon: FileText },
  { id: "users", label: "Users", icon: Users },
  { id: "ads", label: "Manage Ads", icon: Megaphone },
  { id: "contact", label: "Contact Us Submissions", icon: MessageSquare },
  { id: "leads", label: "Advertise Leads", icon: TrendingUp },
  { id: "backups", label: "Database Backups", icon: Database },
  { id: "shorts", label: "Shorts & Reels", icon: Video },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState<{ id?: number | string; name?: string; email?: string; role?: string } | null>(null);
  
  const [pendingReviews, setPendingReviews] = useState<AdminArticleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleData | null>(null);

  const [newsletters, setNewsletters] = useState<any[]>([]);
  const [selectedNewsletters, setSelectedNewsletters] = useState<number[]>([]);
  const [isNewsletterLoading, setIsNewsletterLoading] = useState(false);

  const [publishedPosts, setPublishedPosts] = useState<AdminArticleData[]>([]);
  const [isPublishedLoading, setIsPublishedLoading] = useState(false);

  const [systemUsers, setSystemUsers] = useState<any[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [userActiveTab, setUserActiveTab] = useState("all");

  const [userModalState, setUserModalState] = useState<"closed" | "add" | "edit" | "view">("closed");
  const [selectedSystemUser, setSelectedSystemUser] = useState<any | null>(null);
  const [userForm, setUserForm] = useState({ name: "", email: "", password: "", role: "writer" });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const loadPendingArticles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/articles?status=pending&_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.articles) {
          setPendingReviews(data.articles);
        }
      }
    } catch (err) {
      console.error("Failed to load pending articles:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPendingArticles();
    loadNewsletters();
    loadPublishedPosts();
    loadSystemUsers();
  }, []);

  const loadNewsletters = async () => {
    setIsNewsletterLoading(true);
    try {
      const res = await fetch("/api/newsletter");
      if (res.ok) {
        const data = await res.json();
        if (data.subscribers) {
          setNewsletters(data.subscribers);
        }
      }
    } catch (err) {
      console.error("Failed to load newsletters:", err);
    } finally {
      setIsNewsletterLoading(false);
    }
  };

  const loadPublishedPosts = async () => {
    setIsPublishedLoading(true);
    try {
      const res = await fetch(`/api/articles?status=published&_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.articles) {
          setPublishedPosts(data.articles);
        }
      }
    } catch (err) {
      console.error("Failed to load published posts:", err);
    } finally {
      setIsPublishedLoading(false);
    }
  };

  const loadSystemUsers = async () => {
    setIsUsersLoading(true);
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        if (data.users) {
          setSystemUsers(data.users);
        }
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setIsUsersLoading(false);
    }
  };

  const handleDeleteUser = async (id: number, email: string) => {
    if (!window.confirm(`Are you sure you want to delete user ${email}?`)) return;
    try {
      const res = await fetch(`/api/users?id=${id}&loggedInEmail=${user?.email}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to delete user");
        return;
      }
      loadSystemUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEditing = userModalState === "edit" && selectedSystemUser;
      const res = await fetch("/api/users", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(isEditing ? { id: selectedSystemUser.id } : {}),
          ...userForm,
          loggedInEmail: user?.email,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || `Failed to ${isEditing ? "update" : "save"} user`);
        return;
      }

      if (isEditing && user && (user.id === selectedSystemUser.id || user.email === selectedSystemUser.email)) {
        const updatedCurrentUser = {
          ...user,
          name: userForm.name || user.name,
          role: userForm.role || user.role,
        };
        setUser(updatedCurrentUser);
        localStorage.setItem("user", JSON.stringify(updatedCurrentUser));
      }

      setUserModalState("closed");
      setSelectedSystemUser(null);
      setUserForm({ name: "", email: "", password: "", role: "writer" });
      loadSystemUsers();
    } catch (err) {
      console.error("Failed to save user:", err);
    }
  };

  const handleDeletePublishedPost = async (id: number) => {
    if (!window.confirm("Are you sure you want to permanently delete this published post?")) return;
    try {
      await fetch(`/api/articles?id=${id}&action=permanent`, { method: "DELETE" });
      loadPublishedPosts();
    } catch (err) {
      console.error("Failed to delete published post:", err);
    }
  };

  const toggleNewsletter = (id: number) => {
    setSelectedNewsletters(prev => 
      prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]
    );
  };

  const toggleAllNewsletters = () => {
    if (selectedNewsletters.length === newsletters.length) {
      setSelectedNewsletters([]);
    } else {
      setSelectedNewsletters(newsletters.map(n => n.id));
    }
  };

  const handleBulkDeleteNewsletters = async () => {
    if (selectedNewsletters.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedNewsletters.length} subscriber(s)?`)) return;
    
    try {
      await fetch("/api/newsletter", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedNewsletters }),
      });
      setSelectedNewsletters([]);
      loadNewsletters();
    } catch (err) {
      console.error("Failed to delete newsletters:", err);
    }
  };

  const handleExportCSV = () => {
    if (newsletters.length === 0) {
      alert("No data to export");
      return;
    }

    // Prepare CSV header
    const headers = ["id", "email", "newsletters", "subscribedAt"];
    
    // Prepare CSV rows
    const rows = newsletters.map(sub => {
      const formattedDate = new Date(sub.subscribed_at || Date.now()).toLocaleDateString('en-US', { 
        month: 'short', day: '2-digit', year: 'numeric' 
      });
      // Replace commas in newsletter strings with pipes to prevent CSV column breaking, just in case
      const topics = sub.newsletters ? sub.newsletters.split(",").map((t: string) => t.trim()).filter(Boolean).join("|") : "";
      
      return [
        `nl-${sub.id || Date.now()}`, // ID
        sub.email,                    // Email
        `"${topics}"`,                // Newsletters
        `"${formattedDate}"`          // Date
      ].join(",");
    });

    // Combine headers and rows
    const csvContent = [headers.join(","), ...rows].join("\n");
    
    // Create Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `politico_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteSingleNewsletter = async (id: number) => {
    if (!window.confirm(`Are you sure you want to remove this subscriber?`)) return;
    
    try {
      await fetch("/api/newsletter", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id] }),
      });
      setSelectedNewsletters(prev => prev.filter(nId => nId !== id));
      loadNewsletters();
    } catch (err) {
      console.error("Failed to delete subscriber:", err);
    }
  };

  const displayName = user?.name || user?.email?.split("@")[0] || "Admin";

  const handleOpenArticle = (article: ArticleData) => {
    setEditingArticle(article);
    setIsEditing(true);
  };

  const handleEditorSaveSuccess = (savedArticle: ArticleData, action: "draft" | "pending" | "trash" | "published") => {
    setIsEditing(false);
    setEditingArticle(null);
    // Reload articles to reflect the status change
    loadPendingArticles();
    loadPublishedPosts();
  };

  const displayedReviews = pendingReviews.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      (r.deck && r.deck.toLowerCase().includes(q)) ||
      r.category.toLowerCase().includes(q)
    );
  });

  if (isEditing && editingArticle) {
    return (
      <WriterEditor
        initialArticle={editingArticle}
        onCancel={() => {
          setIsEditing(false);
          setEditingArticle(null);
        }}
        onSaveSuccess={handleEditorSaveSuccess}
        userEmail={user?.email || "admin@politico.com"}
        userName={displayName}
        isAdminMode={true}
      />
    );
  }

  return (
    <DashboardShell
      portalTitle="My Workspace"
      portalBadge="Admin"
      role="admin"
      navItems={adminNavItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === "overview" && (
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="flex-1 w-full">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
              Recent Projects (Pending Review)
            </h2>
            <p className="text-xs text-gray-500 mt-1 mb-4">
              Review and approve submitted articles before they are published.
            </p>
            <div className="relative w-full sm:max-w-md">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 shadow-sm transition"
              />
            </div>
          </div>
          
          <div className="text-[10px] font-bold text-gray-600 bg-gray-100 px-4 py-2 rounded-full flex items-center justify-center h-fit border border-gray-200">
            Pending Count: {pendingReviews.length}
          </div>
        </div>
      )}

      {/* Analytic Cards (Always visible at the top) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Active Reviews */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden flex items-center justify-between group">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#8b5cf6] transition-all group-hover:w-2"></div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Active Reviews</div>
            <div className="text-3xl font-black text-gray-900">{pendingReviews.length}</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#f3e8ff] flex items-center justify-center text-[#8b5cf6]">
            <FileText size={22} />
          </div>
        </div>

        {/* Completed Releases */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden flex items-center justify-between group">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#10b981] transition-all group-hover:w-2"></div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Completed Releases</div>
            <div className="text-3xl font-black text-gray-900">{publishedPosts.length > 0 ? publishedPosts.length : 0}</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#d1fae5] flex items-center justify-center text-[#10b981]">
            <CheckCircle2 size={22} />
          </div>
        </div>

        {/* Newsletter Subs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden flex items-center justify-between group cursor-pointer" onClick={() => setActiveTab("newsletter")}>
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#f97316] transition-all group-hover:w-2"></div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Newsletter Subs</div>
            <div className="text-3xl font-black text-gray-900">{newsletters.length > 0 ? newsletters.length : 13}</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#ffedd5] flex items-center justify-center text-[#f97316]">
            <Mail size={22} />
          </div>
        </div>
      </div>

      {/* Main Content Area Based on Active Tab */}
      {activeTab === "overview" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6 sm:p-8 relative">
          
          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center text-gray-400">
              <Loader2 size={32} className="animate-spin text-[#ce1126] mb-3" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Loading pending reviews...
              </span>
            </div>
          ) : displayedReviews.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center text-gray-400 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                <CheckCircle2 size={28} className="text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">All caught up!</h3>
              <p className="text-sm text-gray-500">There are no pending articles to review.</p>
            </div>
          ) : (
            <div className="overflow-x-auto pb-4">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-4 px-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 w-[45%]">Article Details</th>
                    <th className="py-4 px-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Category</th>
                    <th className="py-4 px-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Author</th>
                    <th className="py-4 px-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Submitted Date</th>
                    <th className="py-4 px-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Status</th>
                    <th className="py-4 px-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayedReviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-5 px-4">
                        <div className="flex gap-4 items-start">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden relative">
                            {review.image ? (
                              <img src={review.image} alt={review.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <FileText size={24} />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col flex-1 min-w-0">
                            <h3 className="text-[13px] sm:text-sm font-bold text-[#111] leading-snug mb-1 line-clamp-2 pr-2">{review.title}</h3>
                            <p className="text-[11px] text-gray-500 line-clamp-2 mb-2 leading-relaxed pr-2">{review.deck}</p>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{review.read_time}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-4">
                        <span className="text-[9px] font-bold text-amber-600 border border-amber-200 bg-amber-50 px-2.5 py-1 rounded-full uppercase tracking-widest whitespace-nowrap">
                          {review.category}
                        </span>
                      </td>
                      <td className="py-5 px-4">
                        <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">{review.writer_name || review.writer_email?.split("@")[0] || "Unknown"}</span>
                      </td>
                      <td className="py-5 px-4">
                        <span className="text-[10px] text-gray-500 font-mono whitespace-nowrap">
                          {new Date(review.updated_at || new Date()).toLocaleString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </span>
                      </td>
                      <td className="py-5 px-4">
                        <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-3 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                          {review.status}
                        </span>
                      </td>
                      <td className="py-5 px-4 text-right">
                        <button 
                          onClick={() => handleOpenArticle(review)}
                          className="bg-[#ce1126] hover:bg-[#b00d1f] text-white text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-[#ce1126] focus:ring-offset-1"
                        >
                          OPEN
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Newsletter Tab */}
      {activeTab === "newsletter" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6 sm:p-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 border-b border-gray-100 pb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">
                Newsletter Subscribers
              </h2>
              <p className="text-xs text-gray-500 font-mono mt-1">
                Emails collected from the Newsletter signup page.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {selectedNewsletters.length > 0 && (
                <button 
                  onClick={handleBulkDeleteNewsletters}
                  className="text-[11px] font-bold text-white bg-[#ce1126] border border-[#ce1126] px-4 py-2 rounded flex items-center gap-2 hover:bg-[#b00d1f] transition shadow-sm uppercase tracking-wider"
                >
                  <Trash2 size={14} /> DELETE SELECTED ({selectedNewsletters.length})
                </button>
              )}
              <button 
                onClick={handleExportCSV}
                className="text-[11px] font-bold text-gray-700 bg-white border border-gray-200 px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-50 transition shadow-sm uppercase tracking-wider"
              >
                <Inbox size={14} /> EXPORT CSV
              </button>
              <div className="text-[10px] font-bold text-gray-500 bg-gray-50 px-3 py-2 rounded-full border border-gray-100">
                Total: {newsletters.length}
              </div>
            </div>
          </div>
          
          {isNewsletterLoading ? (
            <div className="py-24 flex flex-col items-center justify-center text-gray-400">
              <Loader2 size={32} className="animate-spin text-[#ce1126] mb-3" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Loading subscribers...
              </span>
            </div>
          ) : (
            <div className="overflow-x-auto pb-4">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-3 px-4 w-10">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-[#ce1126] focus:ring-[#ce1126]" 
                        checked={selectedNewsletters.length > 0 && selectedNewsletters.length === newsletters.length}
                        onChange={toggleAllNewsletters}
                      />
                    </th>
                    <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Email</th>
                    <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Newsletters</th>
                    <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Subscribed</th>
                    <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {newsletters.map((sub, idx) => (
                    <tr key={sub.id || idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-4 w-10">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-[#ce1126] focus:ring-[#ce1126]" 
                          checked={selectedNewsletters.includes(sub.id)}
                          onChange={() => toggleNewsletter(sub.id)}
                        />
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <Mail size={16} className="text-gray-400" />
                          <span className="text-sm font-semibold text-gray-800">{sub.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {sub.newsletters.split(",").map((t: string) => t.trim()).filter((t: string) => t).map((topic: string) => (
                            <span key={topic} className="text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-sm uppercase tracking-widest">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-xs text-gray-500 font-mono whitespace-nowrap">
                          {new Date(sub.subscribed_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button 
                          onClick={() => handleDeleteSingleNewsletter(sub.id)}
                          className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-white border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded flex items-center gap-1.5 ml-auto transition-colors"
                        >
                          <Trash2 size={12} /> REMOVE
                        </button>
                      </td>
                    </tr>
                  ))}
                  {newsletters.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-400 text-sm">
                        No subscribers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Placeholders for other tabs */}

      {activeTab === "published" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6 sm:p-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 pb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">
                Published Posts
              </h2>
              <p className="text-xs text-gray-500 font-mono mt-2 leading-relaxed max-w-2xl">
                This panel grants the Chief Editor absolute authority to inspect engagement metrics and permanently delete/de-list articles from the database.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-[11px] font-bold text-[#ce1126] bg-white border border-gray-200 px-4 py-2 rounded flex items-center gap-2 hover:bg-red-50 transition shadow-sm uppercase tracking-wider whitespace-nowrap">
                <Database size={14} /> BACKUP ARTICLES (ZIP)
              </button>
              <div className="text-[10px] font-bold text-gray-500 bg-gray-50 px-3 py-2 rounded-full border border-gray-100 whitespace-nowrap">
                Live items: {publishedPosts.length} / {publishedPosts.length}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100 flex flex-wrap items-center gap-4">
            <div className="flex flex-col gap-1.5 flex-1 min-w-[150px]">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Filter by Category</label>
              <select className="w-full bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 py-2 px-3 focus:outline-none">
                <option>All Categories</option>
                <option>World</option>
                <option>Companies</option>
                <option>Startups</option>
                <option>Markets</option>
                <option>Economy</option>
                <option>Finance</option>
                <option>Technology</option>
                <option>Industries</option>
                <option>Leaders</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5 flex-1 min-w-[150px]">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Filter by Placement</label>
              <select className="w-full bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 py-2 px-3 focus:outline-none">
                <option>All Placements</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5 flex-[2] min-w-[200px]">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Search Articles</label>
              <input type="text" placeholder="Search title, author..." className="w-full bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 py-2 px-3 focus:outline-none placeholder-gray-400" />
            </div>
            <div className="flex items-end pb-0.5">
              <button className="text-xs font-bold text-[#2563eb] hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors bg-white border border-gray-200">
                Clear Filters
              </button>
            </div>
          </div>
          
          {isPublishedLoading ? (
            <div className="py-24 flex flex-col items-center justify-center text-gray-400">
              <Loader2 size={32} className="animate-spin text-[#ce1126] mb-3" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Loading published posts...
              </span>
            </div>
          ) : (
            <div className="overflow-x-auto pb-4">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b-2 border-gray-100">
                    <th className="py-3 px-4 text-[9px] font-bold uppercase tracking-widest text-gray-400">Article Details</th>
                    <th className="py-3 px-4 text-[9px] font-bold uppercase tracking-widest text-gray-400">Category</th>
                    <th className="py-3 px-4 text-[9px] font-bold uppercase tracking-widest text-gray-400">Author</th>
                    <th className="py-3 px-4 text-[9px] font-bold uppercase tracking-widest text-gray-400">Metrics Desk</th>
                    <th className="py-3 px-4 text-[9px] font-bold uppercase tracking-widest text-gray-400 text-right">Delete Gate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {publishedPosts.map((article, idx) => (
                    <tr key={article.id || idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-4 w-1/3 min-w-[250px]">
                        <div className="flex items-start gap-3">
                          {article.image ? (
                            <img src={article.image} alt="" className="w-16 h-16 rounded object-cover flex-shrink-0 border border-gray-200" />
                          ) : (
                            <div className="w-16 h-16 rounded bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center">
                              <FileText size={20} className="text-gray-300" />
                            </div>
                          )}
                          <div>
                            <h4 className="text-xs font-bold text-gray-900 leading-tight mb-1">{article.title}</h4>
                            <p className="text-[10px] text-gray-500 font-medium mb-1 line-clamp-1">{article.deck || article.card_summary}</p>
                            <p className="text-[9px] text-gray-400 font-mono">{article.read_time || '5 min read'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-sm uppercase tracking-widest">
                          {(() => {
                            try {
                              let subs = article.subcategories;
                              if (typeof subs === 'string') {
                                subs = JSON.parse(subs || '[]');
                              }
                              if (Array.isArray(subs) && subs.length > 0) return subs[0];
                            } catch(e) {}
                            return article.category || 'World';
                          })()}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-xs font-bold text-gray-800">{article.writer_name || article.writer_email?.split('@')[0] || "Unknown"}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-[10px] font-bold text-[#2563eb]">{article.views || 0} Views</span>
                        <span className="text-[10px] text-gray-400 mx-1">•</span>
                        <span className="text-[10px] font-bold text-gray-500">{article.comments_count || 0} Comments</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">

                          <button 
                            onClick={() => handleOpenArticle(article)}
                            className="w-7 h-7 rounded bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center hover:bg-blue-100 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                          </button>
                          <button 
                            onClick={() => article.id && handleDeletePublishedPost(article.id)}
                            className="w-7 h-7 rounded bg-red-50 text-red-600 border border-red-100 flex items-center justify-center hover:bg-red-100 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {publishedPosts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-400 text-sm">
                        No published posts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6 sm:p-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 border-b border-gray-100 pb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">
                Users Desk
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  setUserForm({ name: "", email: "", password: "", role: "writer" });
                  setUserModalState("add");
                }}
                className="text-[11px] font-bold text-white bg-[#ce1126] hover:bg-[#b00d1f] px-4 py-2 rounded flex items-center gap-2 transition shadow-sm uppercase tracking-wider"
              >
                <UserPlus size={14} /> ADD USER
              </button>
              <div className="text-[10px] font-bold text-gray-500 bg-gray-50 px-3 py-2 rounded-full border border-gray-100">
                Total Users: {systemUsers.length}
              </div>
            </div>
          </div>
          
          <div className="flex gap-6 border-b border-gray-100 mb-6 px-2">
            {[
              { id: "all", label: `ALL USERS (${systemUsers.length})` },
              { id: "admins", label: `ADMINS (${systemUsers.filter(u => u.role === 'admin').length})` },
              { id: "writers", label: `WRITERS (${systemUsers.filter(u => u.role === 'writer').length})` },
              { id: "readers", label: `READERS (${systemUsers.filter(u => u.role === 'reader').length})` }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setUserActiveTab(t.id)}
                className={`pb-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-colors ${
                  userActiveTab === t.id
                    ? "border-[#ce1126] text-[#ce1126]"
                    : "border-transparent text-gray-400 hover:text-gray-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <h3 className="text-lg font-bold text-[#001738] mb-4 font-serif">User Workspace Roles</h3>

          {isUsersLoading ? (
            <div className="py-24 flex flex-col items-center justify-center text-gray-400">
              <Loader2 size={32} className="animate-spin text-[#ce1126] mb-3" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Loading users...
              </span>
            </div>
          ) : (
            <div className="overflow-x-auto pb-4">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-3 px-4 text-[9px] font-bold uppercase tracking-widest text-gray-500">Name</th>
                    <th className="py-3 px-4 text-[9px] font-bold uppercase tracking-widest text-gray-500">Email Address</th>
                    <th className="py-3 px-4 text-[9px] font-bold uppercase tracking-widest text-gray-500">Workspace Role</th>
                    <th className="py-3 px-4 text-[9px] font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {systemUsers
                    .filter(u => userActiveTab === 'all' || u.role === userActiveTab.replace('s', ''))
                    .map((sysUser, idx) => {
                      const isDefaultAdmin = sysUser.email === 'admin@example.com';
                      const isCurrentUser = sysUser.email === user?.email;
                      return (
                        <tr key={sysUser.id || idx} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-semibold text-gray-900">{sysUser.name}</span>
                              {isDefaultAdmin && (
                                <span className="text-[8px] font-bold text-amber-600 border border-amber-200 bg-amber-50 px-1.5 py-0.5 rounded-sm uppercase tracking-widest whitespace-nowrap">
                                  Default Admin
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-xs font-medium text-gray-600">{sysUser.email}</td>
                          <td className="py-4 px-4">
                            <span className={`text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                              sysUser.role === 'admin' ? 'text-[#ce1126] bg-red-50 border border-red-100' :
                              sysUser.role === 'writer' ? 'text-blue-600 bg-blue-50 border border-blue-100' :
                              'text-emerald-600 bg-emerald-50 border border-emerald-100'
                            }`}>
                              {sysUser.role}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <button 
                                onClick={() => {
                                  setSelectedSystemUser(sysUser);
                                  setUserModalState("view");
                                }}
                                className="text-blue-600 hover:text-blue-800 transition-colors" title="View Profile"
                              >
                                <Eye size={16} />
                              </button>
                              
                              {(!isDefaultAdmin || isCurrentUser) && (
                                <button 
                                  onClick={() => {
                                    setSelectedSystemUser(sysUser);
                                    setUserForm({ name: sysUser.name, email: sysUser.email, password: "", role: sysUser.role });
                                    setUserModalState("edit");
                                  }}
                                  className="text-[10px] font-bold uppercase tracking-wider text-gray-600 hover:text-gray-900 flex items-center gap-1.5 transition-colors" title="Edit"
                                >
                                  <Edit size={14} /> EDIT
                                </button>
                              )}
                              
                              {(!isDefaultAdmin && (user?.email === 'admin@example.com' || sysUser.role !== 'admin')) && (
                                <button 
                                  onClick={() => handleDeleteUser(sysUser.id, sysUser.email)}
                                  className="text-[10px] font-bold uppercase tracking-wider text-red-600 hover:text-white border border-red-200 hover:bg-red-600 hover:border-red-600 px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors"
                                >
                                  <Trash2 size={12} /> DELETE
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  {systemUsers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-gray-400 text-sm">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "ads" && (
        <ManageAds />
      )}

      {activeTab === "contact" && (
        <ContactUsSubmissions />
      )}

      {activeTab === "leads" && (
        <AdvertiseLeads />
      )}

      {/* User Modals */}
      {(userModalState === "add" || userModalState === "edit") && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[400px] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#ce1126] flex items-center gap-2">
                <UserPlus size={20} />
                {userModalState === "add" ? "Add New User" : "Edit User Settings"}
              </h3>
              <button onClick={() => setUserModalState("closed")} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUserSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">User Name</label>
                <input 
                  type="text" 
                  value={userForm.name} 
                  onChange={e => setUserForm({...userForm, name: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ce1126] focus:border-transparent transition-all"
                  placeholder="e.g. Richard Hendricks"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">User Email</label>
                <input 
                  type="email" 
                  value={userForm.email}
                  disabled={userModalState === "edit"}
                  onChange={e => setUserForm({...userForm, email: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ce1126] focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="e.g. richard@washington.com"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">User Password</label>
                <input 
                  type="password" 
                  value={userForm.password}
                  onChange={e => setUserForm({...userForm, password: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ce1126] focus:border-transparent transition-all"
                  placeholder={userModalState === "edit" ? "Leave blank to keep unchanged" : "Create user passcode"}
                  required={userModalState === "add"}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Workspace Role</label>
                <select 
                  value={userForm.role}
                  onChange={e => setUserForm({...userForm, role: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ce1126] focus:border-transparent transition-all bg-white"
                >
                  <option value="reader">Reader</option>
                  <option value="writer">Writer</option>
                  {user?.email === 'admin@example.com' && <option value="admin">Admin</option>}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setUserModalState("closed")}
                  className="flex-1 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-[#ce1126] hover:bg-[#a00d1d] text-white text-[11px] font-bold uppercase tracking-widest rounded-lg transition-colors"
                >
                  {userModalState === "add" ? "Create User" : "Update User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {userModalState === "view" && selectedSystemUser && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[420px] overflow-hidden relative">
            <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600"></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-sm font-bold text-[#001738] flex items-center gap-2">
                  <Eye size={16} className="text-blue-600" />
                  Profile Details
                </h3>
                <button onClick={() => setUserModalState("closed")} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-lg bg-black text-white text-3xl font-black italic flex items-center justify-center overflow-hidden flex-shrink-0 bg-gradient-to-br from-indigo-900 to-purple-900">
                  {selectedSystemUser.name ? selectedSystemUser.name.substring(0,2).toUpperCase() : 'US'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    {selectedSystemUser.name}
                    <div className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center text-[10px]">
                      in
                    </div>
                  </h2>
                  <span className="inline-block mt-1 text-[9px] font-bold text-blue-600 border border-blue-200 px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                    {selectedSystemUser.role}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1">Email</label>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Mail size={14} className="text-gray-400" />
                    {selectedSystemUser.email}
                  </div>
                </div>
                
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1">Bio</label>
                  <div className="bg-gray-50 p-4 rounded-lg text-xs text-gray-600 leading-relaxed font-mono">
                    {selectedSystemUser.role.charAt(0).toUpperCase() + selectedSystemUser.role.slice(1)} User {selectedSystemUser.role.charAt(0).toUpperCase() + selectedSystemUser.role.slice(1)} User{selectedSystemUser.role.charAt(0).toUpperCase() + selectedSystemUser.role.slice(1)} User{selectedSystemUser.role.charAt(0).toUpperCase() + selectedSystemUser.role.slice(1)}
                    <br />
                    User{selectedSystemUser.role.charAt(0).toUpperCase() + selectedSystemUser.role.slice(1)} User{selectedSystemUser.role.charAt(0).toUpperCase() + selectedSystemUser.role.slice(1)} User{selectedSystemUser.role.charAt(0).toUpperCase() + selectedSystemUser.role.slice(1)} User{selectedSystemUser.role.charAt(0).toUpperCase() + selectedSystemUser.role.slice(1)} User{selectedSystemUser.role.charAt(0).toUpperCase() + selectedSystemUser.role.slice(1)} User
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1">LinkedIn</label>
                  <a href="#" className="flex items-start gap-2 text-xs text-blue-600 hover:underline">
                    <div className="mt-0.5"><div className="w-3.5 h-3.5 rounded-sm bg-blue-600 text-white flex items-center justify-center text-[8px] font-bold">in</div></div>
                    <span className="break-all">https://linkedin.com/in/{selectedSystemUser.name?.toLowerCase().replace(/\s+/g, '_')}_profile</span>
                  </a>
                </div>
              </div>

              <div className="mt-8">
                <button 
                  onClick={() => setUserModalState("closed")}
                  className="w-full py-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </DashboardShell>
  );
}
