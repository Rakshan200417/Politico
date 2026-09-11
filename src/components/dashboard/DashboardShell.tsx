"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  ArrowLeft,
  Menu,
  X,
  LogOut,
  ChevronDown,
  User as UserIcon,
  BookOpen,
} from "lucide-react";
import ProfileModal from "@/components/profile/ProfileModal";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
}

interface DashboardShellProps {
  portalTitle: string;
  portalBadge: string;
  role: "writer" | "admin";
  navItems: NavItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  children: React.ReactNode;
}

export default function DashboardShell({
  portalTitle,
  portalBadge,
  role,
  navItems,
  activeTab,
  onTabChange,
  children,
}: DashboardShellProps) {
  const [user, setUser] = useState<{ id?: number | string; name?: string; role: string; email: string; avatar_url?: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  return (
    <div className="min-h-screen flex bg-[#f8f9fa] font-sans antialiased text-gray-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 w-64 bg-white border-r border-gray-200 z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Sidebar Brand Header */}
          <div className="h-16 px-6 border-b border-gray-200 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#ce1126] flex items-center justify-center text-white font-black text-lg shadow-sm select-none">
                P
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg tracking-tight text-gray-900 leading-none">
                  POLITICO
                </span>
                <span className="text-[10px] font-bold text-[#ce1126] tracking-wider uppercase mt-0.5">
                  {portalBadge}
                </span>
              </div>
            </a>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-gray-500 hover:text-gray-900"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-1">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
              Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-colors ${
                    isActive
                      ? "bg-[#ce1126]/10 text-[#ce1126]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? "text-[#ce1126]" : "text-gray-400"} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? "bg-[#ce1126] text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#b01753] text-white font-bold text-xs flex items-center justify-center flex-shrink-0 overflow-hidden">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                initialLetter
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-gray-900 truncate">{displayName}</div>
              <div className="text-[10px] text-gray-500 font-mono truncate">{user?.email}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-gray-600 hover:text-[#ce1126] hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out Terminal</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-md text-gray-600 hover:bg-gray-100"
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              {portalTitle}
            </h2>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-[#ce1126] transition-colors"
            >
              <ArrowLeft size={14} strokeWidth={2.5} />
              <span className="hidden sm:inline">Back to News</span>
            </a>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer select-none"
              >
                <span className="w-6 h-6 rounded-full bg-[#b01753] text-white font-bold text-xs flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    initialLetter
                  )}
                </span>
                <span className="text-xs font-bold text-gray-800 hidden md:inline">
                  {displayName}
                </span>
                <ChevronDown size={12} className="text-gray-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 z-50 py-2.5">
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
                      href="/reader"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs md:text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-[#ce1126] transition-colors"
                    >
                      <BookOpen className="w-4 h-4 text-emerald-600 flex-shrink-0" strokeWidth={2} />
                      <span>Readers Dashboard</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        setProfileModalOpen(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs md:text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-[#ce1126] transition-colors text-left cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-slate-500 flex-shrink-0" strokeWidth={2} />
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
        </header>

        {/* Main Body */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full">
          {children}
        </main>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onProfileUpdated={(updated) => {
          setUser((prev) => (prev ? { ...prev, name: updated.name } : null));
        }}
      />
    </div>
  );
}
