"use client";

import React, { useState } from "react";

export default function CommentsSection({ articleSlug }: { articleSlug: string }) {
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Jane Doe",
      text: "This is a very insightful article. Thanks for sharing!",
      time: "2 hours ago"
    },
    {
      id: 2,
      author: "John Smith",
      text: "I completely disagree with the premise, but it's an interesting perspective.",
      time: "5 hours ago"
    }
  ]);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setComments([
      {
        id: Date.now(),
        author: "Current User",
        text: newComment,
        time: "Just now"
      },
      ...comments
    ]);
    setNewComment("");
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

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="pb-6 border-b border-gray-100 last:border-0">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-gray-900">{comment.author}</span>
              <span className="text-xs text-gray-500">{comment.time}</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {comment.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
