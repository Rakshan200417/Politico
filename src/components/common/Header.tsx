"use client";

import React, { useEffect, useState, useRef } from "react";
import { Search, Menu, X, User, BookOpen, LogOut } from "lucide-react";
import ProfileModal from "@/components/profile/ProfileModal";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [user, setUser] = useState<{ id?: number | string; name?: string; role: string; email: string; avatar_url?: string } | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsCompact((prev) => {
        if (prev && window.scrollY < 20) return false;
        if (!prev && window.scrollY > 100) return true;
        return prev;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const loadUserData = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);

      // Refresh with latest profile details including avatar_url from DB
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
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("user");
    setUser(null);
    setProfileMenuOpen(false);
    window.location.href = "/";
  };

  const mainCategories = [
    { id: "breakingNews", name: "Breaking News", href: "/category/breaking-news" },
    { id: "companies", name: "Companies", href: "/category/companies" },
    { id: "startups", name: "Startups", href: "/category/startups" },
    { id: "markets", name: "Markets", href: "/category/markets" },
    { id: "economy", name: "Economy", href: "/category/economy" },
    { id: "finance", name: "Finance", href: "/category/finance" },
    { id: "leaders", name: "Leaders", href: "/category/leaders" },
    { id: "industries", name: "Industries", href: "/category/industries" },
    { id: "global", name: "Global", href: "/category/global" },
    { id: "technology", name: "Technology", href: "/category/technology" },
  ];

  const megaMenuData: Record<string, { name: string; href: string }[]> = {
    companies: [
      { name: "Corporate Announcements", href: "/category/corporate-announcements" },
      { name: "Mergers & Acquisitions", href: "/category/mergers-acquisitions" },
      { name: "Leadership Changes", href: "/category/leadership-changes" },
    ],
    startups: [
      { name: "Funding & Investment", href: "/category/funding-investment" },
      { name: "Founder Stories", href: "/category/founder-stories" },
      { name: "Venture Capital", href: "/category/venture-capital" },
      { name: "Startup Failures", href: "/category/startup-failures" },
    ],
    markets: [
      { name: "Stock Market", href: "/category/stock-market" },
      { name: "Bonds", href: "/category/bonds" },
      { name: "Mutual Funds", href: "/category/mutual-funds" },
    ],
    economy: [
      { name: "GDP & Economic Growth", href: "/category/gdp-economic-growth" },
      { name: "Employment", href: "/category/employment" },
      { name: "Government Economic Policies", href: "/category/government-economic-policies" },
    ],
    finance: [
      { name: "Digital Banking", href: "/category/digital-banking" },
      { name: "FinTech", href: "/category/fintech" },
      { name: "Banking Industry", href: "/category/banking-industry" },
      { name: "Loans & Lending", href: "/category/loans-lending" },
    ],
    industries: [
      { name: "Manufacturing", href: "/category/manufacturing" },
      { name: "Energy", href: "/category/energy" },
      { name: "Pharmaceuticals", href: "/category/pharmaceuticals" },
      { name: "Automobile", href: "/category/automobile" },
      { name: "Agriculture Business", href: "/category/agriculture-business" },
      { name: "Construction", href: "/category/construction" },
      { name: "Design", href: "/category/design" },
      { name: "Textiles", href: "/category/textiles" },
      { name: "Entertainment", href: "/category/entertainment" },
    ],
    leaders: [
      { name: "Business Leaders", href: "/category/business-leaders" },
      { name: "CEO Interviews", href: "/category/ceo-interviews" },
      { name: "Executive Appointments", href: "/category/executive-appointments" },
      { name: "Leadership Strategies", href: "/category/leadership-strategies" },
    ],
  };

  return (
    <header className={`w-full bg-white ${isMenuOpen ? "border-b-0" : "border-b border-gray-200"} sticky top-0 z-50 shadow-sm font-sans transition-all duration-300 ease-out`}>
      {/* Top Header Bar */}
      <div
        className={`w-full px-3 flex items-center justify-between relative z-20 border-b border-gray-200 transition-all duration-300 ease-out ${isCompact ? "h-10 min-[1280px]:h-12" : "h-20 min-[1280px]:h-[90px]"
          }`}
      >
        {/* Left Menu Toggle Button pinned to the far left */}
        <div className="flex items-center justify-start flex-1 flex-shrink-0">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-1 text-gray-800 transition-all duration-300 ease-out focus:outline-none flex items-center justify-center`}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? (
              <X className="text-gray-800 w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" strokeWidth={2} />
            ) : (
              <Menu className="text-gray-800 w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" strokeWidth={2} />
            )}
          </button>
        </div>

        {/* Center POLITICO Brand Logo */}
        <div className="flex-1 flex justify-center items-center pointer-events-none absolute left-0 right-0">
          <a href="/" className="pointer-events-auto">
            <span
              className={`font-black tracking-[-0.04em] text-[#d71920] uppercase leading-none transition-all duration-300 ease-out ${isCompact
                  ? "text-[28px] font-medium"
                  : "text-[40px] min-[1280px]:text-[56px] font-bold"
                }`}
            >
              POLITICO
            </span>
          </a>
        </div>

        {/* Right Actions: NEWSLETTER SIGNUP | Login Icon | Search Icon */}
        <div className="flex items-center justify-end gap-4 text-[10px] font-bold uppercase tracking-wide text-gray-800 flex-1 flex-shrink-0 min-w-max relative z-10">
          <a
            href="/newsletters"
            className={`transition-all duration-300 ease-out bg-[#ce1126] text-white px-4 py-2 hover:bg-[#a00c1c] hidden sm:inline whitespace-nowrap ${isCompact ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
          >
            NEWSLETTER SIGNUP
          </a>
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="relative flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#b01753] hover:opacity-90 text-white font-bold text-xs md:text-sm shadow-sm transition-all focus:outline-none cursor-pointer select-none overflow-hidden"
                aria-label="User profile menu"
              >
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name || "Profile"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (user.name?.[0] || user.email[0] || "U").toUpperCase()
                )}
                {/* Online status indicator green dot */}
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#10b981] rounded-full border-2 border-white ring-1 ring-white/50 z-10"></span>
              </button>

              {/* Profile Dropdown Popup (matching screenshot) */}
              {profileMenuOpen && (
                <div className="absolute right-0 top-full mt-2.5 w-64 bg-white rounded-lg shadow-[0_12px_32px_rgba(0,0,0,0.18)] border border-gray-100 z-50 py-2.5 normal-case">
                  {/* User details header */}
                  <div className="px-4 pb-2.5 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#b01753] text-white font-bold text-sm flex items-center justify-center overflow-hidden flex-shrink-0">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        (user.name?.[0] || user.email[0] || "U").toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-gray-900 text-sm leading-snug truncate">
                        {user.name || user.email.split("@")[0]}
                      </div>
                      <div className="text-xs text-gray-500 font-mono mt-0.5 truncate lowercase">
                        {user.email}
                      </div>
                    </div>
                  </div>

                  {/* Action items */}
                  <div className="py-1">
                    <a
                      href={
                        user.role === "admin"
                          ? "/admin"
                          : user.role === "writer"
                          ? "/writer"
                          : "/reader"
                      }
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs md:text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-[#ce1126] transition-colors"
                    >
                      <BookOpen className="w-4 h-4 text-emerald-600 flex-shrink-0" strokeWidth={2} />
                      <span>
                        {user.role === "admin"
                          ? "Admin Dashboard"
                          : user.role === "writer"
                          ? "Writer Dashboard"
                          : "Readers Dashboard"}
                      </span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        setProfileModalOpen(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs md:text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-[#ce1126] transition-colors text-left cursor-pointer"
                    >
                      <User className="w-4 h-4 text-slate-500 flex-shrink-0" strokeWidth={2} />
                      <span>Profile Settings</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100 my-1"></div>

                  {/* Sign Out Terminal */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs md:text-sm font-semibold text-gray-800 hover:bg-red-50 hover:text-[#ce1126] transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-slate-500 flex-shrink-0" strokeWidth={2} />
                    <span>Sign Out Terminal</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a
              href="/login"
              className={`transition-all duration-300 ease-out text-gray-800 hover:text-[#ce1126] hidden sm:inline ${isCompact ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
            >
              <User className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" strokeWidth={2} />
            </a>
          )}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-1 text-gray-800 hover:text-[#ce1126] transition-colors"
            aria-label="Search POLITICO"
          >
            <Search className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Expandable Search Input */}
      {searchOpen && (
        <div className="bg-gray-100 border-b border-gray-300 p-3 max-w-[1440px] mx-auto flex items-center gap-2">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search POLITICO stories, topics, authors..."
            className="w-full bg-transparent border-none focus:outline-none text-sm text-gray-900 placeholder-gray-500"
            autoFocus
          />
          <button
            onClick={() => setSearchOpen(false)}
            className="text-xs font-bold uppercase text-gray-500 hover:text-black px-2"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Mobile/Tablet Responsive Category Nav */}
      <nav className="lg:hidden bg-white border-b border-gray-200">
        <div className="px-4 py-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div className="flex items-center gap-4 text-[12px] font-bold text-gray-800">
            {mainCategories.map((cat) => (
              <a
                key={cat.name}
                href={cat.href}
                className={`transition-colors flex-shrink-0 ${cat.name === "Breaking News"
                    ? "text-[#ce1126] hover:text-[#a00c1c] mr-4"
                    : "hover:text-[#ce1126]"
                  }`}
              >
                {cat.name}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Secondary Category Sub-Nav */}
      <nav className={`hidden lg:block bg-white ${isMenuOpen ? "border-b-0" : "border-b border-gray-200"} transition-all duration-300 ease-out relative z-10 ${isCompact ? "shadow-sm" : ""}`}>
        {/* Desktop Mega Menu Background Panel */}
        {isMenuOpen && (
          <div className="absolute left-0 top-full w-full bg-white shadow-xl min-h-[390px] z-40">
            {/* Mega Menu Footer */}
            <div className="max-w-[1440px] mx-auto px-8 absolute bottom-8 left-0 right-0">
              <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                <div className="flex items-center space-x-4">
                  <span className="text-[#ce1126] font-black uppercase tracking-wider">FOLLOW US</span>
                  <a href="#" className="font-bold text-gray-900 hover:text-[#ce1126]">X</a>
                  <a href="#" className="font-bold text-gray-900 hover:text-[#ce1126]">INSTAGRAM</a>
                  <a href="#" className="font-bold text-gray-900 hover:text-[#ce1126]">FACEBOOK</a>
                  <a href="#" className="font-bold text-gray-900 hover:text-[#ce1126]">LINKEDIN</a>
                </div>
                <div className="flex items-center space-x-6 font-bold text-gray-900 text-sm md:text-base">
                  <a href="#" className="hover:text-[#ce1126] transition-colors">My Account</a>
                  {user ? (
                    <button onClick={handleLogout} className="hover:text-[#ce1126] uppercase transition-colors">Log Out</button>
                  ) : (
                    <a href="/login" className="hover:text-[#ce1126] transition-colors">Log In</a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          className={`max-w-[1440px] mx-auto px-3 flex items-start justify-center transition-all duration-300 ease-out py-3 text-[12px] min-[1280px]:py-4 min-[1280px]:text-[16px] font-bold text-[#1e1e1e] tracking-normal`}
        >
          <div className={`flex items-start relative z-50 transition-all duration-300 ease-out ${isMenuOpen ? "space-x-8 md:space-x-12 lg:space-x-16" : "space-x-4 md:space-x-6"}`}>
            <div className={`relative transition-all duration-300 ${isMenuOpen ? "mr-4 md:mr-6 lg:mr-8" : "mr-4 md:mr-6"}`}>
              <a
                href="/category/breaking-news"
                className="transition-colors text-[#ce1126] hover:text-[#a00c1c] py-2 block whitespace-nowrap"
              >
                Breaking News
              </a>
            </div>
            {mainCategories.filter((cat) => cat.id !== "breakingNews").map((cat) => {
              const subCategories = megaMenuData[cat.id] || [];
              return (
                <div key={cat.name} className="relative">
                  <a
                    href={cat.href}
                    className="transition-colors hover:text-[#ce1126] py-2 block whitespace-nowrap"
                  >
                    {cat.name}
                  </a>
                  {isMenuOpen && subCategories.length > 0 && (
                    <div className="absolute left-0 top-full mt-4 w-[130px] pr-2">
                      <ul className="space-y-3 text-[13px] font-medium text-gray-800">
                        {subCategories.map((sub) => (
                          <li key={sub.name}>
                            <a href={sub.href} className="hover:text-[#ce1126] transition-colors block leading-tight break-words">
                              {sub.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile/Tablet Mega Menu Overlay Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden w-full bg-white shadow-xl max-h-[85vh] overflow-y-auto">
          <div className="px-4 py-6 space-y-6">
            {mainCategories.filter((cat) => cat.id !== "breakingNews").map((cat) => {
              const subCategories = megaMenuData[cat.id] || [];
              if (subCategories.length === 0) return null;
              return (
                <div key={cat.name}>
                  <a href={cat.href} className="text-[14px] font-black text-gray-900 uppercase mb-3 block">
                    {cat.name}
                  </a>
                  <ul className="space-y-2 text-[14px] font-medium text-gray-700 pl-4 border-l-2 border-gray-100">
                    {subCategories.map((sub) => (
                      <li key={sub.name}>
                        <a href={sub.href} className="hover:text-[#ce1126] transition-colors block">
                          {sub.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            {/* Bottom Footer Section Mobile */}
            <div className="mt-8 pt-6 flex flex-col gap-4 text-xs">
              <div className="flex flex-col space-y-3">
                <span className="text-[#ce1126] font-black uppercase tracking-wider">FOLLOW US</span>
                <div className="flex space-x-4">
                  <a href="#" className="font-bold text-gray-900 hover:text-[#ce1126]">X</a>
                  <a href="#" className="font-bold text-gray-900 hover:text-[#ce1126]">INSTAGRAM</a>
                  <a href="#" className="font-bold text-gray-900 hover:text-[#ce1126]">FACEBOOK</a>
                  <a href="#" className="font-bold text-gray-900 hover:text-[#ce1126]">LINKEDIN</a>
                </div>
              </div>
              <div className="flex space-x-6 font-bold text-gray-900 mt-4 text-sm md:text-base">
                <a href="#" className="hover:text-[#ce1126] transition-colors">My Account</a>
                {user ? (
                  <button onClick={handleLogout} className="hover:text-[#ce1126] uppercase transition-colors">Log Out</button>
                ) : (
                  <a href="/login" className="hover:text-[#ce1126] transition-colors">Log In</a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Settings Modal */}
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
