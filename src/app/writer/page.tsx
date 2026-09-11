"use client";

import React, { useState } from "react";
import DashboardShell, { NavItem } from "@/components/dashboard/DashboardShell";
import {
  FileText,
  PenSquare,
  BarChart3,
  Clock,
  FolderTree,
  PlusCircle,
  Sparkles,
} from "lucide-react";

const writerNavItems: NavItem[] = [
  { id: "overview", label: "Dashboard", icon: BarChart3 },
  { id: "articles", label: "My Articles", icon: FileText, badge: 0 },
  { id: "new-story", label: "Write Story", icon: PenSquare },
  { id: "drafts", label: "Saved Drafts", icon: Clock, badge: 0 },
  { id: "categories", label: "Categories", icon: FolderTree },
];

export default function WriterDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <DashboardShell
      portalTitle="Writer Workspace"
      portalBadge="Writer"
      role="writer"
      navItems={writerNavItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {/* Header Overview Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-xs font-semibold text-white/80 mb-3 border border-white/10">
            <Sparkles size={13} className="text-[#ce1126]" /> Editorial Contributor Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Writer Dashboard
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm mt-1 max-w-xl">
            Draft, edit, and submit policy and political stories for publication across POLITICO categories.
          </p>
        </div>

        <button
          onClick={() => setActiveTab("new-story")}
          className="bg-[#ce1126] hover:bg-[#b00d1f] text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow transition-colors flex items-center gap-2"
        >
          <PlusCircle size={16} /> New Story
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Published Articles</div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">0</div>
          <div className="text-[11px] text-gray-400 mt-1">Live on Politico</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Drafts</div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">0</div>
          <div className="text-[11px] text-gray-400 mt-1">In progress</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Readers</div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">0</div>
          <div className="text-[11px] text-gray-400 mt-1">Across all stories</div>
        </div>
      </div>

      {/* Main Workspace Card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-8 sm:p-12 shadow-sm flex flex-col items-center justify-center text-center min-h-[300px]">
        <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-3 border border-gray-100">
          <PenSquare size={24} />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
          Writer Workspace Ready
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mb-6">
          Your article editor, submission queues, and story performance statistics will be configured here once your team lead provides the detailed instructions.
        </p>
        <span className="inline-block bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-blue-100">
          Pending Instructions from Team Lead
        </span>
      </div>
    </DashboardShell>
  );
}
