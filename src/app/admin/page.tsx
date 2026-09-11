"use client";

import React, { useState } from "react";
import DashboardShell, { NavItem } from "@/components/dashboard/DashboardShell";
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  FileText,
  FolderTree,
  Settings,
  ShieldCheck,
} from "lucide-react";

const adminNavItems: NavItem[] = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "review", label: "Review Queue", icon: CheckSquare, badge: 0 },
  { id: "users", label: "User Management", icon: Users },
  { id: "articles", label: "All Content", icon: FileText },
  { id: "categories", label: "Categories", icon: FolderTree },
  { id: "settings", label: "System Settings", icon: Settings },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <DashboardShell
      portalTitle="Admin Control Center"
      portalBadge="Admin"
      role="admin"
      navItems={adminNavItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {/* Header Overview Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-xs font-semibold text-white/80 mb-3 border border-white/10">
            <ShieldCheck size={14} className="text-[#ce1126]" /> System Administration
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm mt-1 max-w-xl">
            Review submitted articles, manage platform users, assign editorial roles, and oversee all category publications.
          </p>
        </div>

        <button
          onClick={() => setActiveTab("review")}
          className="bg-[#ce1126] hover:bg-[#b00d1f] text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow transition-colors flex items-center gap-2"
        >
          <CheckSquare size={16} /> Review Queue
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending Review</div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">0</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">Requires approval</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Users</div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">4</div>
          <div className="text-[11px] text-gray-400 mt-1">Registered accounts</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Live Articles</div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">50+</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Across 10 categories</div>
        </div>
      </div>

      {/* Main Workspace Card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-8 sm:p-12 shadow-sm flex flex-col items-center justify-center text-center min-h-[300px]">
        <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-3 border border-gray-100">
          <ShieldCheck size={24} />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
          Admin Workspace Ready
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mb-6">
          The editorial review queue, user role management, and system configuration tools will be connected here once your team lead provides the detailed specifications.
        </p>
        <span className="inline-block bg-amber-50 text-amber-800 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-amber-200/70">
          Pending Instructions from Team Lead
        </span>
      </div>
    </DashboardShell>
  );
}
