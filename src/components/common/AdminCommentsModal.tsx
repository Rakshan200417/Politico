"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Trash2, X, ExternalLink, Loader2, CheckCircle2 } from "lucide-react";

interface CommentItem {
  id: number;
  article_slug: string;
  category?: string;
  commenter_name: string;
  commenter_email?: string;
  comment_text: string;
  created_at: string;
}

export default function AdminCommentsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/comments?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      const res = await fetch(`/api/comments?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== id));
        setToast("Comment deleted successfully");
        setTimeout(() => setToast(null), 3000);
      } else {
        alert("Failed to delete comment");
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment");
    }
  };

  if (!isOpen) return null;

  const filtered = comments.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.comment_text.toLowerCase().includes(q) ||
      c.commenter_name.toLowerCase().includes(q) ||
      (c.commenter_email && c.commenter_email.toLowerCase().includes(q)) ||
      c.article_slug.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-[#0f172a] text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#ce1126] flex items-center justify-center text-white">
              <MessageSquare size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight">Admin Comment Moderation</h2>
              <p className="text-[11px] text-gray-400 font-mono">
                Manage and remove reader comments across all articles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by comment text, commenter name, email, or article slug..."
            className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#ce1126]"
          />
          <span className="text-[11px] font-bold text-gray-500 whitespace-nowrap">
            {filtered.length} comment{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-gray-100">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400">
              <Loader2 size={28} className="animate-spin text-[#ce1126] mb-2" />
              <span className="text-xs font-bold uppercase tracking-wider">Loading comments...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400 text-center">
              <CheckCircle2 size={32} className="text-emerald-500 mb-2" />
              <p className="text-sm font-semibold text-gray-700">No comments found</p>
              <p className="text-xs text-gray-400 mt-0.5">All comments are clean or match no search query.</p>
            </div>
          ) : (
            filtered.map((c) => (
              <div key={c.id} className="py-4 flex flex-col gap-2 hover:bg-gray-50/60 p-3 rounded-lg transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-gray-900">{c.commenter_name}</span>
                    {c.commenter_email && (
                      <span className="text-[10px] text-gray-500 font-mono">({c.commenter_email})</span>
                    )}
                    <span className="text-[10px] text-gray-400">
                      • {new Date(c.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`/news/${c.article_slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
                    >
                      <ExternalLink size={11} />
                      <span className="truncate max-w-[120px]">View Article</span>
                    </a>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-[#ce1126] hover:bg-red-50 border border-red-200 px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition"
                      title="Remove comment"
                    >
                      <Trash2 size={12} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-700 bg-white border border-gray-100 p-2.5 rounded-md leading-relaxed whitespace-pre-wrap">
                  {c.comment_text}
                </p>
                <div className="text-[10px] text-gray-400 font-mono truncate">
                  Article: <span className="text-gray-600 font-semibold">{c.article_slug}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Toast */}
        <div className="p-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <span>{toast ? <span className="text-emerald-600 font-bold">✔ {toast}</span> : "Only administrators can remove reader comments."}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
