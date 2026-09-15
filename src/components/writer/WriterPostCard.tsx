"use client";

import React from "react";
import {
  Edit3,
  Trash2,
  RotateCcw,
  AlertCircle,
  Clock,
  CheckCircle2,
  FileText,
  XCircle,
  Tag,
  ExternalLink,
} from "lucide-react";
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
  const isPending = article.status === "pending";
  const isPublished = article.status === "published";
  const isRejected = article.status === "rejected";
  const isDraft = article.status === "draft";

  const getStatusBadge = () => {
    switch (article.status) {
      case "published":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <CheckCircle2 size={12} /> Published
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
            <Clock size={12} /> Pending Review
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/60">
            <XCircle size={12} /> Rejected by Admin
          </span>
        );
      case "trash":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
            <Trash2 size={12} /> In Trash
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <FileText size={12} /> Draft
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Top Meta: Category + Status Badge */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-800 text-[11px] font-black uppercase tracking-wider">
              {article.category || "General"}
            </span>

            {article.subcategories && article.subcategories.length > 0 && (
              <span className="text-[11px] font-semibold text-gray-400">
                {article.subcategories.slice(0, 2).join(", ")}
                {article.subcategories.length > 2 ? ` +${article.subcategories.length - 2}` : ""}
              </span>
            )}
          </div>

          <div>{getStatusBadge()}</div>
        </div>

        {/* Title (Opens in new tab) */}
        <a
          href={`/news/${article.slug || slugify(article.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Open article in new tab"
          className="block group/link"
        >
          <h3 className="text-base sm:text-lg font-bold text-gray-950 tracking-tight leading-snug mb-2 group-hover/link:text-[#ce1126] transition-colors">
            {article.title}
          </h3>
        </a>

        {/* Deck / Excerpt */}
        {article.deck && (
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed mb-4">
            {article.deck}
          </p>
        )}

        {/* Rejection Note banner if rejected */}
        {isRejected && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 mb-4 flex items-start gap-2.5 text-xs text-rose-800">
            <AlertCircle size={15} className="text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Editorial Feedback: </span>
              <span>{article.rejection_reason || "Article requires revision on headline clarity and citation sources."}</span>
            </div>
          </div>
        )}

        {/* Tags if any */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-4">
            <Tag size={12} className="text-gray-400" />
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-50 text-gray-500 border border-gray-100"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer: Metadata + Action Buttons */}
      <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-2">
        <div className="text-[11px] text-gray-400 font-medium">
          {article.read_time || "5 min read"}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          {!isTrash ? (
            <>
              {/* View Article in New Tab */}
              <a
                href={`/news/${article.slug || slugify(article.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                title="View Article (Opens in new tab)"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 bg-gray-50 hover:bg-blue-50 hover:text-[#2563eb] border border-gray-200 transition"
              >
                <ExternalLink size={13} />
                <span>View</span>
              </a>

              {/* Edit Button (Available for Draft, Pending Review, Rejected, Published) */}
              <button
                onClick={() => onEdit(article)}
                title="Edit Article"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 bg-gray-50 hover:bg-[#ce1126]/10 hover:text-[#ce1126] border border-gray-200 transition"
              >
                <Edit3 size={14} />
                <span>Edit</span>
              </button>

              {/* Delete Button (Moves to Trash) */}
              <button
                onClick={() => onDelete(article)}
                title="Move to Trash"
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition"
              >
                <Trash2 size={16} />
              </button>
            </>
          ) : (
            <>
              {/* Restore from Trash */}
              {onRestore && (
                <button
                  onClick={() => onRestore(article)}
                  title="Restore Article to Drafts"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition"
                >
                  <RotateCcw size={14} />
                  <span>Restore</span>
                </button>
              )}

              {/* Delete Permanently */}
              {onPermanentDelete && (
                <button
                  onClick={() => onPermanentDelete(article)}
                  title="Delete Permanently"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition"
                >
                  <Trash2 size={14} />
                  <span>Purge</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
