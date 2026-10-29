"use client";

import React from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { BookOpen } from "lucide-react";

export default function ReaderSkeleton() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f3f4f6] select-none pointer-events-none">
      {/* Dashboard Top Navigation */}
      <DashboardHeader title="READERS DASHBOARD" />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 md:py-10">
        {/* Sub-Header Row */}
        <div className="flex items-center justify-between mb-6 border-b border-gray-200/80 pb-4">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-[#ce1126]" strokeWidth={2.5} />
            <h2 className="text-xs md:text-sm font-black text-gray-900 uppercase tracking-wider">
              SAVED ARTICLES
            </h2>
          </div>

          <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse"></div>
        </div>

        {/* Saved Articles Cards Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200/80 overflow-hidden shadow-sm flex flex-col"
            >
              <div className="aspect-[16/10] bg-gray-200 animate-pulse"></div>
              <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="h-2.5 w-16 bg-red-100 rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <div className="h-2.5 w-20 bg-gray-100 rounded animate-pulse"></div>
                  <div className="w-5 h-5 rounded bg-gray-100 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
