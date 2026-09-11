"use client";

import React, { useEffect, useState, useRef } from "react";
import { ArrowLeft, ChevronDown, BookOpen, User, LogOut } from "lucide-react";
import ProfileModal from "@/components/profile/ProfileModal";

interface DashboardHeaderProps {
  title: string;
  backHref?: string;
}

export default function DashboardHeader({ title, backHref = "/" }: DashboardHeaderProps) {
  const [user, setUser] = useState<{ id?: number | string; name?: string; role: string; email: string; avatar_url?: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadUserData = () => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);

      fetch(`/api/profile?email=${encodeURIComponent(parsed.email)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.profile) {
            const updated = {
              ...parsed,
              name: data.profile.full_name || parsed.name,
              avatar_url: data.profile.avatar_url || parsed.avatar_url || '',
            };
            localStorage.setItem("user", JSON.stringify(updated));
            setUser(updated);
          }
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    loadUserData();
    window.addEventListener("userProfileUpdated", loadUserData);
    return () => window.removeEventListener("userProfileUpdated", loadUserData);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setDropdownOpen(false);
    window.location.href = "/";
  };

  const displayName = user?.name || user?.email?.split("@")[0] || "User";
  const initialLetter = (displayName[0] || user?.email?.[0] || "U").toUpperCase();

  const dashboardLabel =
    user?.role === "admin"
      ? "Admin Dashboard"
      : user?.role === "writer"
      ? "Writer Dashboard"
      : "Readers Dashboard";

  const dashboardHref =
    user?.role === "admin"
      ? "/admin"
      : user?.role === "writer"
      ? "/writer"
      : "/reader";

  return (
    <header className="w-full bg-white border-b border-gray-200/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left: Back to News */}
        <div className="flex-1 flex justify-start">
          <a
            href={backHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-black transition-colors select-none"
          >
            <ArrowLeft size={16} strokeWidth={2.2} />
            <span>Back to News</span>
          </a>
        </div>

        {/* Center: Dashboard Title */}
        <div className="flex-1 flex justify-center text-center">
          <h1 className="text-xl md:text-2xl font-serif font-black tracking-wide text-gray-900 uppercase">
            {title}
          </h1>
        </div>

        {/* Right: User Pill Button & Dropdown */}
        <div className="flex-1 flex justify-end relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors focus:outline-none cursor-pointer select-none"
            aria-label="User profile menu"
          >
            <span className="w-7 h-7 rounded-full bg-[#b01753] text-white font-bold text-xs flex items-center justify-center flex-shrink-0 overflow-hidden">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                initialLetter
              )}
            </span>
            <span className="text-xs md:text-sm font-bold text-gray-800 hidden sm:inline">
              {displayName}
            </span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {/* Profile Dropdown Popup Card */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-[0_12px_32px_rgba(0,0,0,0.18)] border border-gray-100 z-50 py-2.5">
              <div className="px-4 pb-2.5 border-b border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#b01753] text-white font-bold text-sm flex items-center justify-center overflow-hidden flex-shrink-0">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    initialLetter
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-gray-900 text-sm leading-snug truncate">
                    {displayName}
                  </div>
                  <div className="text-xs text-gray-500 font-mono mt-0.5 truncate lowercase">
                    {user?.email || "Not signed in"}
                  </div>
                </div>
              </div>

              <div className="py-1">
                <a
                  href={dashboardHref}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-xs md:text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-[#ce1126] transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-emerald-600 flex-shrink-0" strokeWidth={2} />
                  <span>{dashboardLabel}</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    setProfileModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs md:text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-[#ce1126] transition-colors text-left cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-500 flex-shrink-0" strokeWidth={2} />
                  <span>Profile Settings</span>
                </button>
              </div>

              <div className="border-t border-gray-100 my-1"></div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-xs md:text-sm font-semibold text-gray-800 hover:bg-red-50 hover:text-[#ce1126] transition-colors text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-slate-500 flex-shrink-0" strokeWidth={2} />
                <span>Sign Out Terminal</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onProfileUpdated={(updated) => {
          setUser((prev) => (prev ? { ...prev, name: updated.name } : null));
        }}
      />
    </header>
  );
}
