"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export interface LegalSection {
  id: string;
  label: string;
  title?: string;
  content: React.ReactNode;
}

interface LegalPageLayoutProps {
  pageTitle: string;
  sidebarTitle: string;
  sidebarIcon: React.ReactNode;
  lastUpdated?: string;
  sections: LegalSection[];
}

export default function LegalPageLayout({
  pageTitle,
  sidebarTitle,
  sidebarIcon,
  lastUpdated = "November 2026",
  sections,
}: LegalPageLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>(
    sections[0]?.id || "introduction"
  );

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 130;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sec.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 85;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-8 md:py-12">
        {/* Always side-by-side: Table on left, Content on right */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-start">
          {/* Sticky Left Sidebar: Table of Contents */}
          <aside className="w-full md:w-[240px] lg:w-[260px] shrink-0 md:sticky md:top-20 z-20">
            <div className="bg-white border border-gray-200 shadow-2xs p-4 sm:p-5">
              <div className="flex items-center gap-2 pb-3 mb-2 border-b border-gray-100 text-xs font-black uppercase tracking-wider text-gray-900">
                <span className="text-[#002f6c]">{sidebarIcon}</span>
                <span>{sidebarTitle}</span>
              </div>

              <nav className="space-y-0.5 max-h-[calc(100vh-10rem)] overflow-y-auto pr-1">
                {sections.map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left py-1.5 text-[11px] sm:text-xs transition-colors rounded-none flex items-center justify-between cursor-pointer ${
                        isActive
                          ? "border-l-2 border-[#ce1126] text-[#ce1126] font-bold pl-2.5 bg-red-50/50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 pl-3 font-medium"
                      }`}
                    >
                      <span className="truncate">{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Right Main Content */}
          <div className="flex-1 min-w-0 max-w-3xl space-y-10 pt-1">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 space-y-3.5 pb-2"
              >
                {section.title && (
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-serif">
                    {section.title}
                  </h2>
                )}
                <div className="text-gray-800 text-[14px] sm:text-[15px] leading-[1.75] space-y-3.5 font-normal">
                  {section.content}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
