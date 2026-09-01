"use client";

import React, { useEffect, useState } from "react";
import { Search, Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsCompact(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mainCategories = [
    { name: "Congress", href: "#" },
    { name: "White House", href: "#" },
    { name: "Canada", href: "#" },
    { name: "Defense", href: "#" },
    { name: "Elections", href: "#" },
    { name: "Energy", href: "#" },
    { name: "Health Care", href: "#" },
    { name: "Legal", href: "#" },
    { name: "Tech", href: "#" },
    { name: "California", href: "#" },
    { name: "New York", href: "#" },
  ];

  const subCategories = [
    { name: "Playbook", href: "#" },
    { name: "Columns", href: "#" },
    { name: "Newsletters", href: "#" },
    { name: "Magazine", href: "#" },
    { name: "Podcasts", href: "#" },
    { name: "Polling", href: "#" },
  ];

  const megaMenuData = {
    washingtonPolitics: [
      { name: "Congress", href: "#" },
      { name: "White House", href: "#" },
      { name: "Supreme Court and Legal Issues", href: "#" },
      { name: "Magazine", href: "#" },
      { name: "2026 Elections", href: "#" },
      { name: "Latest on POLITICO", href: "#" },
    ],
    statePolitics: [
      { name: "California", href: "#" },
      { name: "Florida", href: "#" },
      { name: "New Jersey", href: "#" },
      { name: "New York", href: "#" },
    ],
    globalPolitics: [
      { name: "Brussels", href: "#" },
      { name: "Canada", href: "#" },
      { name: "United Kingdom", href: "#" },
      { name: "France", href: "#" },
      { name: "Germany", href: "#" },
      { name: "Australia", href: "#" },
    ],
    policyNews: [
      { name: "Food and Agriculture", href: "#" },
      { name: "Cybersecurity", href: "#" },
      { name: "Defense", href: "#" },
      { name: "Education", href: "#" },
      { name: "Energy and Climate", href: "#" },
      { name: "Tax, Finance and the Economy", href: "#" },
      { name: "Health Care", href: "#" },
      { name: "Labor", href: "#" },
      { name: "Tech", href: "#" },
      { name: "Trade", href: "#" },
      { name: "Transportation", href: "#" },
    ],
    newsletters: [
      { name: "Playbook", href: "#" },
      { name: "West Wing Playbook", href: "#" },
      { name: "Inside Congress", href: "#" },
      { name: "POLITICO Forecast", href: "#" },
      { name: "POLITICO Magazine", href: "#" },
      { name: "All Newsletters", href: "#" },
    ],
    columnists: [
      { name: "Alex Burns", href: "#" },
      { name: "Victoria Guida", href: "#" },
      { name: "John Harris", href: "#" },
      { name: "Debra Kahn", href: "#" },
      { name: "Jonathan Martin", href: "#" },
      { name: "Nahal Toosi", href: "#" },
      { name: "All Columnists", href: "#" },
    ],
    seriesAndMore: [
      { name: "Inside Congress Live", href: "#" },
      { name: "Breaking News Alerts", href: "#" },
      { name: "Podcasts", href: "#" },
      { name: "Video", href: "#" },
      { name: "Matt Wuerker Cartoons", href: "#" },
      { name: "Cartoon Carousel", href: "#" },
      { name: "The POLITICO Poll", href: "#" },
    ],
    politicoLive: [
      { name: "Events", href: "#" },
    ],
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm font-sans transition-all duration-300 ease-out">
      {/* Top Header Bar */}
      <div
        className={`max-w-[1440px] mx-auto px-6 flex items-center justify-between relative border-b border-gray-200 transition-all duration-300 ease-out ${
          isCompact ? "py-2" : "py-3 sm:py-4"
        }`}
      >
        {/* Left Menu Toggle Button pinned to the far left */}
        <div className="flex items-center justify-start w-[80px] flex-shrink-0">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`border border-gray-300 hover:border-gray-400 p-2 text-gray-800 transition-all duration-300 ease-out focus:outline-none flex items-center justify-center ${
              isCompact ? "w-8 h-8" : "w-10 h-10"
            }`}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? (
              <X size={isCompact ? 18 : 20} className="text-gray-800" />
            ) : (
              <Menu size={isCompact ? 18 : 20} className="text-gray-800" />
            )}
          </button>
        </div>

        {/* Center POLITICO Brand Logo */}
        <div className="text-center flex-1 min-w-0">
          <a href="/" className="inline-block">
            <span
              className={`font-black tracking-tight text-[#ce1126] uppercase font-sans leading-none transition-all duration-300 ease-out ${
                isCompact
                  ? "text-[28px] sm:text-[34px] lg:text-[42px]"
                  : "text-4xl sm:text-5xl lg:text-[52px]"
              }`}
            >
              POLITICO
            </span>
          </a>
        </div>

        {/* Right Actions: Europe | PRO | Search Icon */}
        <div className="flex items-center justify-end gap-4 sm:gap-5 w-[80px] sm:w-[140px] text-xs font-bold uppercase tracking-wider text-gray-800 flex-shrink-0">
          <a
            href="#"
            className={`transition-all duration-300 ease-out hover:text-[#ce1126] ${
              isCompact ? "hidden" : "hidden sm:inline"
            }`}
          >
            EUROPE
          </a>
          <a
            href="#"
            className={`transition-all duration-300 ease-out hover:text-[#ce1126] ${
              isCompact ? "hidden" : "hidden sm:inline"
            }`}
          >
            PRO
          </a>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-1 text-gray-800 hover:text-[#ce1126] transition-colors"
            aria-label="Search POLITICO"
          >
            <Search size={isCompact ? 20 : 22} />
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

      {/* Main Secondary Category Sub-Nav */}
      <nav className={`hidden lg:block bg-white border-b border-gray-200 transition-all duration-300 ease-out ${isCompact ? "shadow-sm" : ""}`}>
        <div
          className={`max-w-[1440px] mx-auto px-6 flex items-center justify-center overflow-x-auto whitespace-nowrap transition-all duration-300 ease-out ${
            isCompact ? "py-2 text-[12px]" : "py-3 text-[13px]"
          } font-bold text-[#1e1e1e] tracking-normal space-x-4`}
        >
          <div className="flex items-center space-x-4">
            {mainCategories.map((cat) => (
              <a
                key={cat.name}
                href={cat.href}
                className="hover:text-[#ce1126] transition-colors"
              >
                {cat.name}
              </a>
            ))}
          </div>

          <div className="h-4 w-[1px] bg-gray-300 mx-3 inline-block"></div>

          <div className="flex items-center space-x-4">
            {subCategories.map((cat) => (
              <a
                key={cat.name}
                href={cat.href}
                className="hover:text-[#ce1126] transition-colors"
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
              
              {/* Column 1: Washington & Politics */}
              <div>
                <h3 className="text-[12px] font-black tracking-wider text-[#ce1126] uppercase mb-3">
                  WASHINGTON & POLITICS
                </h3>
                <ul className="space-y-2.5 text-[13px] font-bold text-gray-900">
                  {megaMenuData.washingtonPolitics.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="hover:text-[#ce1126] transition-colors block">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2: State Politics & Policy + Global Politics & Policy */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-[12px] font-black tracking-wider text-[#ce1126] uppercase mb-3">
                    STATE POLITICS & POLICY
                  </h3>
                  <ul className="space-y-2.5 text-[13px] font-bold text-gray-900">
                    {megaMenuData.statePolitics.map((item) => (
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
                    GLOBAL POLITICS & POLICY
                  </h3>
                  <ul className="space-y-2.5 text-[13px] font-bold text-gray-900">
                    {megaMenuData.globalPolitics.map((item) => (
                      <li key={item.name}>
                        <a href={item.href} className="hover:text-[#ce1126] transition-colors block">
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Column 3: Policy News */}
              <div>
                <h3 className="text-[12px] font-black tracking-wider text-[#ce1126] uppercase mb-3">
                  POLICY NEWS
                </h3>
                <ul className="space-y-2.5 text-[13px] font-bold text-gray-900">
                  {megaMenuData.policyNews.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="hover:text-[#ce1126] transition-colors block">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 4: Newsletters */}
              <div>
                <h3 className="text-[12px] font-black tracking-wider text-[#ce1126] uppercase mb-3">
                  NEWSLETTERS
                </h3>
                <ul className="space-y-2.5 text-[13px] font-bold text-gray-900">
                  {megaMenuData.newsletters.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="hover:text-[#ce1126] transition-colors block">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 5: Columnists */}
              <div>
                <h3 className="text-[12px] font-black tracking-wider text-[#ce1126] uppercase mb-3">
                  COLUMNISTS
                </h3>
                <ul className="space-y-2.5 text-[13px] font-bold text-gray-900">
                  {megaMenuData.columnists.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="hover:text-[#ce1126] transition-colors block">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 6: Series & More + Politico Live */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-[12px] font-black tracking-wider text-[#ce1126] uppercase mb-3">
                    SERIES & MORE
                  </h3>
                  <ul className="space-y-2.5 text-[13px] font-bold text-gray-900">
                    {megaMenuData.seriesAndMore.map((item) => (
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
                    POLITICO LIVE
                  </h3>
                  <ul className="space-y-2.5 text-[13px] font-bold text-gray-900">
                    {megaMenuData.politicoLive.map((item) => (
                      <li key={item.name}>
                        <a href={item.href} className="hover:text-[#ce1126] transition-colors block">
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
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
                <a href="#" className="hover:text-[#ce1126]">
                  Log In
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
