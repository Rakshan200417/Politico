"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { ArticleData } from "./WriterEditor";
import { slugify } from "@/data/newsArticles";

interface WriterPostCardProps {
  article: ArticleData;
  onEdit: (article: ArticleData) => void;
  onDelete: (article: ArticleData) => void;
  onRestore?: (article: ArticleData) => void;
  onPermanentDelete?: (article: ArticleData) => void;
}

export default function WriterPostCard({
  article,
  onEdit,
  onDelete,
  onRestore,
  onPermanentDelete,
}: WriterPostCardProps) {
  const isTrash = article.status === "trash";

  return (
    <div className="group grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors bg-white">
      {/* Title & Summary */}
      <div className="col-span-12 md:col-span-6 lg:col-span-5 flex items-start gap-4">
        <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
          {article.image ? (
            <img src={article.image} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs font-bold">
              IMG
            </div>
          )}
        </div>
        <div className="min-w-0">
          <a
            href={`/news/${article.slug || slugify(article.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Open article in new tab"
            className="block group-hover:text-[#ce1126] transition-colors"
          >
            <h3 className="text-sm font-bold text-gray-900 leading-tight mb-1 truncate">
              {article.title}
            </h3>
          </a>
          <p className="text-xs text-gray-500 line-clamp-1 mb-1">{article.deck || "No excerpt available."}</p>
          <div className="text-[10px] text-gray-400 font-medium">{article.read_time || "5 min read"}</div>
        </div>
      </div>

      {/* Category */}
      <div className="hidden lg:block col-span-2 text-xs font-bold text-gray-900">
        {article.category || "Business"}
      </div>

      {/* Date */}
      <div className="hidden md:block col-span-3 lg:col-span-2 text-xs text-gray-500 font-mono">
        {(article as any).created_at ? new Date((article as any).created_at).toISOString() : new Date().toISOString()}
      </div>

      {/* Status */}
      <div className="hidden md:block col-span-2">
        <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">
          {article.status.toUpperCase()}
        </span>
      </div>

      {/* Actions */}
      <div className="hidden md:flex col-span-1 items-center justify-end gap-3 text-right">
        {!isTrash ? (
          <>
            <button onClick={() => onEdit(article)} className="text-xs font-bold text-[#2563eb] hover:underline">
              Edit Post
            </button>
            <button onClick={() => onDelete(article)} className="text-gray-400 hover:text-red-600 transition-colors">
              <Trash2 size={16} />
            </button>
          </>
        ) : (
          <>
            <button onClick={() => onRestore && onRestore(article)} className="text-xs font-bold text-emerald-600 hover:underline">
              Restore
            </button>
            <button onClick={() => onPermanentDelete && onPermanentDelete(article)} className="text-gray-400 hover:text-red-600 transition-colors">
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
