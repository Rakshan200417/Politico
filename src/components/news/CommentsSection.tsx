"use client";

import React, { useState, useEffect } from "react";

interface Comment {
  id: number;
  commenter_name: string;
  commenter_email?: string;
  comment_text: string;
  created_at: string;
}

export default function CommentsSection({ 
  articleSlug, 
  category, 
  articleAuthor 
}: { 
  articleSlug: string, 
  category?: string, 
  articleAuthor?: string 
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  // Attempt to get user from local storage
  let userName = "Anonymous";
  let userEmail = "";
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        userName = user.name || user.email?.split("@")[0] || "Anonymous";
        userEmail = user.email || "";
      } catch (e) {}
    }
  }

  useEffect(() => {
    fetch(`/api/comments?slug=${encodeURIComponent(articleSlug)}`)
      .then(res => res.json())
      .then(data => {
        if (data.comments) {
          setComments(data.comments);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading comments:", err);
        setLoading(false);
      });
  }, [articleSlug]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          article_slug: articleSlug,
          category,
          article_author: articleAuthor,
          commenter_name: userName,
          commenter_email: userEmail,
          comment_text: newComment
        })
      });
      const data = await res.json();
      
      if (data.success && data.comment) {
        setComments([data.comment, ...comments]);
        setNewComment("");
      }
    } catch (err) {
      console.error("Error posting comment:", err);
      alert("Failed to post comment.");
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffMins < 60) return `${diffMins || 1} mins ago`;
    if (diffHrs < 24) return `${diffHrs} hours ago`;
    return `${diffDays} days ago`;
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-6 font-serif">
        Comments ({comments.length})
      </h3>
      
      <form onSubmit={handleAddComment} className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Leave a comment..."
          className="w-full border border-gray-300 rounded-md p-4 text-sm focus:outline-none focus:border-[#d71920] focus:ring-1 focus:ring-[#d71920]"
          rows={3}
        />
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            className="bg-[#d71920] hover:bg-[#a00c1c] text-white font-bold text-xs uppercase tracking-wider px-6 py-2 rounded transition-colors"
          >
            Post Comment
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-sm text-gray-500">Loading comments...</p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="pb-6 border-b border-gray-100 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-gray-900">{comment.commenter_name}</span>
                <span className="text-xs text-gray-500">{formatTime(comment.created_at)}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {comment.comment_text}
              </p>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-sm text-gray-500">No comments yet. Be the first to share your thoughts!</p>
          )}
        </div>
      )}
    </div>
  );
}
