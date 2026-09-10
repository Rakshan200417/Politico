"use client";

import React, { useEffect, useState } from "react";
import { Search, Menu, X, User } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [user, setUser] = useState<{ role: string; email: string } | null>(null);

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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  const mainCategories = [
    { id: "breakingNews", name: "Breaking News", href: "/category/breaking-news" },
    { id: "companies", name: "Companies", href: "/category/companies" },
    { id: "startups", name: "Startups", href: "/category/startups" },
    { id: "markets", name: "Markets", href: "/category/markets" },
    { id: "economy", name: "Economy", href: "/category/economy" },
    { id: "finance", name: "Finance", href: "/category/finance" },
    { id: "technology", name: "Technology", href: "/category/technology" },
    { id: "industries", name: "Industries", href: "/category/industries" },
    { id: "global", name: "Global", href: "/category/global" },
    { id: "leaders", name: "Leaders", href: "/category/leaders" },
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
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm font-sans transition-all duration-300 ease-out">
      {/* Top Header Bar */}
      <div
        className={`w-full px-3 flex items-center justify-between relative border-b border-gray-200 transition-all duration-300 ease-out ${isCompact ? "h-10 min-[1280px]:h-12" : "h-20 min-[1280px]:h-[90px]"
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
            <button
              onClick={handleLogout}
              className={`transition-all duration-300 ease-out text-gray-800 hover:text-[#ce1126] hidden sm:inline ${isCompact ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
            >
              LOGOUT
            </button>
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
                    ? "text-[#ce1126] hover:text-[#a00c1c]"
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
      <nav className={`hidden lg:block bg-white border-b border-gray-200 transition-all duration-300 ease-out relative ${isCompact ? "shadow-sm" : ""}`}>
        {/* Desktop Mega Menu Background Panel */}
        {isMenuOpen && (
          <div className="absolute left-0 top-full w-full bg-white border-b border-gray-300 shadow-xl min-h-[300px] z-40">
            {/* Mega Menu Footer */}
            <div className="max-w-[1440px] mx-auto px-8 absolute bottom-8 left-0 right-0">
              <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                <div className="flex items-center space-x-4">
                  <span className="text-[#ce1126] font-black uppercase tracking-wider">FOLLOW US</span>
                  <a href="#" className="font-bold text-gray-900 hover:text-[#ce1126]">X</a>
                  <a href="#" className="font-bold text-gray-900 hover:text-[#ce1126]">INSTAGRAM</a>
                  <a href="#" className="font-bold text-gray-900 hover:text-[#ce1126]">FACEBOOK</a>
                  <a href="#" className="font-bold text-gray-900 hover:text-[#ce1126]">LINKEDIN</a>
                </div>
                <div className="flex items-center space-x-6 font-bold text-gray-900">
                  <a href="#" className="hover:text-[#ce1126]">My Account</a>
                  {user ? (
                    <button onClick={handleLogout} className="hover:text-[#ce1126] uppercase">Log Out</button>
                  ) : (
                    <a href="/login" className="hover:text-[#ce1126]">Log In</a>
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
            <div className="relative">
              <a
                href="/category/breaking-news"
                className={`transition-colors text-[#ce1126] hover:text-[#a00c1c] py-2 block whitespace-nowrap transition-all duration-300 ${isMenuOpen ? "mr-8 md:mr-16 lg:mr-20" : "mr-4 md:mr-12"}`}
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
        <div className="lg:hidden w-full bg-white border-b border-gray-300 shadow-xl max-h-[85vh] overflow-y-auto">
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
            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col gap-4 text-xs">
              <div className="flex flex-col space-y-3">
                <span className="text-[#ce1126] font-black uppercase tracking-wider">FOLLOW US</span>
                <div className="flex space-x-4">
                  <a href="#" className="font-bold text-gray-900 hover:text-[#ce1126]">X</a>
                  <a href="#" className="font-bold text-gray-900 hover:text-[#ce1126]">INSTAGRAM</a>
                  <a href="#" className="font-bold text-gray-900 hover:text-[#ce1126]">FACEBOOK</a>
                  <a href="#" className="font-bold text-gray-900 hover:text-[#ce1126]">LINKEDIN</a>
                </div>
              </div>
              <div className="flex space-x-6 font-bold text-gray-900 mt-4">
                <a href="#" className="hover:text-[#ce1126]">My Account</a>
                {user ? (
                  <button onClick={handleLogout} className="hover:text-[#ce1126] uppercase">Log Out</button>
                ) : (
                  <a href="/login" className="hover:text-[#ce1126]">Log In</a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
