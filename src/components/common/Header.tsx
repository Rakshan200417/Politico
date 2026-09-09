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
      setIsCompact(window.scrollY > 40);
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
    { name: "Breaking News", href: "/category/breaking-news" },
    { name: "Companies", href: "/category/companies" },
    { name: "Startups", href: "/category/startups" },
    { name: "Markets", href: "/category/markets" },
    { name: "Economy", href: "/category/economy" },
    { name: "Finance", href: "/category/finance" },
    { name: "Technology", href: "/category/technology" },
    { name: "Industries", href: "/category/industries" },
    { name: "Global", href: "/category/global" },
    { name: "Leaders", href: "/category/leaders" },
  ];

  const megaMenuData = {
    companies: [
      { name: "Corporate Announcements", href: "#" },
      { name: "Mergers & Acquisitions", href: "#" },
      { name: "Leadership Changes", href: "#" },
    ],
    startups: [
      { name: "Funding & Investment", href: "#" },
      { name: "Founder Stories", href: "#" },
      { name: "Venture Capital", href: "#" },
      { name: "Startup Failures", href: "#" },
    ],
    markets: [
      { name: "Stock Market", href: "#" },
      { name: "Bonds", href: "#" },
      { name: "Mutual Funds", href: "#" },
    ],
    economy: [
      { name: "GDP & Economic Growth", href: "#" },
      { name: "Employment", href: "#" },
      { name: "Government Economic Policies", href: "#" },
    ],
    finance: [
      { name: "Digital Banking", href: "#" },
      { name: "FinTech", href: "#" },
      { name: "Banking Industry", href: "#" },
      { name: "Loans & Lending", href: "#" },
    ],
    industries: [
      { name: "Manufacturing", href: "#" },
      { name: "Energy", href: "#" },
      { name: "Pharmaceuticals", href: "#" },
      { name: "Automobile", href: "#" },
      { name: "Agriculture Business", href: "#" },
      { name: "Construction", href: "#" },
      { name: "Design", href: "#" },
      { name: "Textiles", href: "#" },
      { name: "Entertainment", href: "#" },
    ],
    globalLeaders: [
      { name: "Business Leaders", href: "#" },
      { name: "CEO Interviews", href: "#" },
      { name: "Executive Appointments", href: "#" },
      { name: "Leadership Strategies", href: "#" },
    ],
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm font-sans transition-all duration-300 ease-out">
      {/* Top Header Bar */}
      <div
        className={`w-full px-3 flex items-center justify-between relative border-b border-gray-200 transition-all duration-300 ease-out ${
          isCompact ? "h-10 min-[1280px]:h-12" : "h-20 min-[1280px]:h-[90px]"
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
              className={`font-black tracking-[-0.04em] text-[#d71920] uppercase leading-none transition-all duration-300 ease-out ${
                isCompact
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
            className={`transition-all duration-300 ease-out bg-[#ce1126] text-white px-4 py-2 hover:bg-[#a00c1c] hidden sm:inline whitespace-nowrap ${
              isCompact ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            NEWSLETTER SIGNUP
          </a>
          {user ? (
            <button
              onClick={handleLogout}
              className={`transition-all duration-300 ease-out text-gray-800 hover:text-[#ce1126] hidden sm:inline ${
                isCompact ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              LOGOUT
            </button>
          ) : (
            <a
              href="/login"
              className={`transition-all duration-300 ease-out text-gray-800 hover:text-[#ce1126] hidden sm:inline ${
                isCompact ? "opacity-0 pointer-events-none" : "opacity-100"
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
                className={`transition-colors flex-shrink-0 ${
                  cat.name === "Breaking News"
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
      <nav className={`hidden lg:block bg-white border-b border-gray-200 transition-all duration-300 ease-out ${isCompact ? "shadow-sm" : ""}`}>
        <div
          className={`max-w-[1440px] mx-auto px-3 flex items-center justify-center overflow-x-auto whitespace-nowrap transition-all duration-300 ease-out py-3 text-[12px] min-[1280px]:py-4 min-[1280px]:text-[16px] font-bold text-[#1e1e1e] tracking-normal space-x-2`}
        >
          <div className="flex items-center space-x-4">
            {mainCategories.map((cat) => (
              <a
                key={cat.name}
                href={cat.href}
                className={`transition-colors ${
                  cat.name === "Breaking News"
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

      {/* POLITICO Mega Menu Overlay Dropdown */}
      {isMenuOpen && (
        <div className="w-full bg-white border-b border-gray-300 shadow-xl max-h-[85vh] overflow-y-auto">
          <div className="max-w-[1440px] mx-auto px-8 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              
              {/* Column 1: Companies */}
              <div>
                <h3 className="text-[12px] font-black tracking-wider text-[#ce1126] uppercase mb-3">
                  COMPANIES
                </h3>
                <ul className="space-y-2 text-[14px] font-medium text-gray-900">
                  {megaMenuData.companies.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="hover:text-[#ce1126] transition-colors block">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2: Startups */}
              <div>
                <h3 className="text-[12px] font-black tracking-wider text-[#ce1126] uppercase mb-3">
                  STARTUPS
                </h3>
                <ul className="space-y-2 text-[14px] font-medium text-gray-900">
                  {megaMenuData.startups.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="hover:text-[#ce1126] transition-colors block">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Markets & Economy */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-[12px] font-black tracking-wider text-[#ce1126] uppercase mb-3">
                    MARKETS
                  </h3>
                  <ul className="space-y-2 text-[14px] font-medium text-gray-900">
                    {megaMenuData.markets.map((item) => (
                      <li key={item.name}>
                        <a href={item.href} className="hover:text-[#ce1126] transition-colors block">
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-[12px] font-black tracking-wider text-[#ce1126] uppercase mb-3">
                    ECONOMY
                  </h3>
                  <ul className="space-y-2 text-[14px] font-medium text-gray-900">
                    {megaMenuData.economy.map((item) => (
                      <li key={item.name}>
                        <a href={item.href} className="hover:text-[#ce1126] transition-colors block">
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Column 4: Finance */}
              <div>
                <h3 className="text-[12px] font-black tracking-wider text-[#ce1126] uppercase mb-3">
                  FINANCE
                </h3>
                <ul className="space-y-2 text-[14px] font-medium text-gray-900">
                  {megaMenuData.finance.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="hover:text-[#ce1126] transition-colors block">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 5: Industries */}
              <div>
                <h3 className="text-[12px] font-black tracking-wider text-[#ce1126] uppercase mb-3">
                  INDUSTRIES
                </h3>
                <ul className="space-y-2 text-[14px] font-medium text-gray-900">
                  {megaMenuData.industries.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="hover:text-[#ce1126] transition-colors block">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 6: Global Leaders */}
              <div>
                <h3 className="text-[12px] font-black tracking-wider text-[#ce1126] uppercase mb-3">
                  GLOBAL LEADERS
                </h3>
                <ul className="space-y-2 text-[14px] font-medium text-gray-900">
                  {megaMenuData.globalLeaders.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="hover:text-[#ce1126] transition-colors block">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Bottom Footer Section within Mega Menu */}
            <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center space-x-4">
                <span className="text-[#ce1126] font-black uppercase tracking-wider">
                  FOLLOW US
                </span>
                <a href="#" className="font-bold text-gray-900 hover:text-[#ce1126]">
                  X
                </a>
                <a href="#" className="font-bold text-gray-900 hover:text-[#ce1126]">
                  INSTAGRAM
                </a>
                <a href="#" className="font-bold text-gray-900 hover:text-[#ce1126]">
                  FACEBOOK
                </a>
                <a href="#" className="font-bold text-gray-900 hover:text-[#ce1126]">
                  LINKEDIN
                </a>
              </div>

              <div className="flex items-center space-x-6 font-bold text-gray-900">
                <a href="#" className="hover:text-[#ce1126]">
                  My Account
                </a>
                {user ? (
                  <button onClick={handleLogout} className="hover:text-[#ce1126] uppercase">
                    Log Out
                  </button>
                ) : (
                  <a href="/login" className="hover:text-[#ce1126]">
                    Log In
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
