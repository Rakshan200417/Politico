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
      <div className="col-span-12 md:col-span-5 lg:col-span-4 flex items-start gap-4 min-w-0">
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
      <div className="hidden lg:block col-span-2 text-xs font-bold text-gray-900 truncate">
        {article.category || "Business"}
      </div>

      {/* Date */}
      <div className="hidden md:block col-span-2 text-xs text-gray-500 font-mono truncate">
        {(article as any).updated_at
          ? new Date((article as any).updated_at).toLocaleDateString()
          : (article as any).created_at
          ? new Date((article as any).created_at).toLocaleDateString()
          : new Date().toLocaleDateString()}
      </div>

      {/* Status */}
      <div className="hidden md:block col-span-2">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${
          article.status === "published"
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : article.status === "pending"
            ? "bg-amber-50 text-amber-700 border-amber-200"
            : article.status === "rejected"
            ? "bg-rose-50 text-rose-700 border-rose-200"
            : article.status === "trash"
            ? "bg-gray-100 text-gray-500 border-gray-300"
            : "bg-blue-50 text-blue-700 border-blue-200"
        }`}>
          {article.status.toUpperCase()}
        </span>
      </div>

      {/* Actions */}
      <div className="col-span-12 md:col-span-3 lg:col-span-2 flex items-center justify-end gap-2 text-right">
        {!isTrash ? (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(article);
              }}
              className="text-xs font-bold text-[#2563eb] hover:text-[#1d4ed8] hover:underline px-2 py-1 rounded"
            >
              Edit Post
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(article);
              }}
              title="Move to Trash"
              aria-label="Move to Trash"
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRestore && onRestore(article);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 transition-colors"
              title="Restore to Saved Drafts"
            >
              Restore
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPermanentDelete && onPermanentDelete(article);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 flex items-center gap-1 transition-colors"
              title="Permanently Delete"
            >
              <Trash2 size={13} />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
