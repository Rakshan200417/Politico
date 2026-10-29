"use client";

import React from "react";

export default function DashboardSkeleton({ role = "admin" }: { role?: "admin" | "writer" }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans select-none pointer-events-none">
      {/* Dashboard Top Header Bar */}
      <header className="h-16 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="h-7 w-28 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-5 w-20 bg-gray-100 rounded animate-pulse"></div>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-8 w-24 bg-gray-100 rounded-lg animate-pulse hidden sm:block"></div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse hidden md:block"></div>
          </div>
        </div>
      </header>

      {/* Main Layout (Sidebar + Content) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Skeleton (Desktop/Tablet) */}
        <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 p-4 flex-col justify-between shrink-0">
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 animate-pulse">
                <div className="w-5 h-5 rounded bg-gray-200 shrink-0"></div>
                <div className="h-4 bg-gray-200 rounded" style={{ width: `${60 + (i % 3) * 20}%` }}></div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center gap-3 px-3 py-2">
            <div className="w-5 h-5 rounded bg-gray-200"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        </aside>

        {/* Right Main Content Skeleton */}
        <main className="flex-1 bg-[#f8fafc] p-6 md:p-8 space-y-6 overflow-y-auto">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200/80">
            <div>
              <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-3.5 w-72 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-36 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>

          {/* 4 Metric Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-8 h-8 rounded-lg bg-gray-100 animate-pulse"></div>
                </div>
                <div className="h-7 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-2.5 w-28 bg-gray-100 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Main Table / Review Panel Skeleton */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-48 bg-gray-100 rounded-lg animate-pulse"></div>
            </div>

            <div className="space-y-3 pt-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-lg bg-gray-200 animate-pulse shrink-0"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-48 sm:w-80 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 w-28 bg-gray-100 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-7 rounded-lg bg-gray-200 animate-pulse"></div>
                    <div className="w-8 h-7 rounded-lg bg-gray-100 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
