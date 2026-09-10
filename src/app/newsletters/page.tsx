"use client";

import React, { useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const mainCategories = [
  { id: "breakingNews", name: "Breaking News" },
  { id: "companies", name: "Companies" },
  { id: "startups", name: "Startups" },
  { id: "markets", name: "Markets" },
  { id: "economy", name: "Economy" },
  { id: "finance", name: "Finance" },
  { id: "technology", name: "Technology" },
  { id: "industries", name: "Industries" },
  { id: "global", name: "Global" },
  { id: "leaders", name: "Leaders" },
];

const megaMenuData: Record<string, { name: string; id: string }[]> = {
  companies: [
    { name: "Corporate Announcements", id: "corporate-announcements" },
    { name: "Mergers & Acquisitions", id: "mergers-acquisitions" },
    { name: "Leadership Changes", id: "leadership-changes" },
  ],
  startups: [
    { name: "Funding & Investment", id: "funding-investment" },
    { name: "Founder Stories", id: "founder-stories" },
    { name: "Venture Capital", id: "venture-capital" },
    { name: "Startup Failures", id: "startup-failures" },
  ],
  markets: [
    { name: "Stock Market", id: "stock-market" },
    { name: "Bonds", id: "bonds" },
    { name: "Mutual Funds", id: "mutual-funds" },
  ],
  economy: [
    { name: "GDP & Economic Growth", id: "gdp-economic-growth" },
    { name: "Employment", id: "employment" },
    { name: "Government Economic Policies", id: "government-economic-policies" },
  ],
  finance: [
    { name: "Digital Banking", id: "digital-banking" },
    { name: "FinTech", id: "fintech" },
    { name: "Banking Industry", id: "banking-industry" },
    { name: "Loans & Lending", id: "loans-lending" },
  ],
  industries: [
    { name: "Manufacturing", id: "manufacturing" },
    { name: "Energy", id: "energy" },
    { name: "Pharmaceuticals", id: "pharmaceuticals" },
    { name: "Automobile", id: "automobile" },
    { name: "Agriculture Business", id: "agriculture-business" },
    { name: "Construction", id: "construction" },
    { name: "Design", id: "design" },
    { name: "Textiles", id: "textiles" },
    { name: "Entertainment", id: "entertainment" },
  ],
  leaders: [
    { name: "Business Leaders", id: "business-leaders" },
    { name: "CEO Interviews", id: "ceo-interviews" },
    { name: "Executive Appointments", id: "executive-appointments" },
    { name: "Leadership Strategies", id: "leadership-strategies" },
  ],
};

export default function NewslettersPage() {
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const handleToggleCategory = (catId: string) => {
    setSelected((prev) => {
      const isNowSelected = !prev[catId];
      const newState = { ...prev, [catId]: isNowSelected };
      
      const subCats = megaMenuData[catId];
      if (subCats) {
        subCats.forEach(sub => {
          newState[sub.id] = isNowSelected;
        });
      }
      return newState;
    });
  };

  const handleToggleSub = (subId: string, parentId: string) => {
    setSelected((prev) => {
      const isNowSelected = !prev[subId];
      const newState = { ...prev, [subId]: isNowSelected };
      
      const subCats = megaMenuData[parentId];
      if (subCats) {
        const allSubSelected = subCats.every(sub => newState[sub.id]);
        newState[parentId] = allSubSelected;
      }
      return newState;
    });
  };

  const getAllSelectableIds = () => {
    const ids: string[] = [];
    mainCategories.forEach(cat => {
      ids.push(cat.id);
      if (megaMenuData[cat.id]) {
        megaMenuData[cat.id].forEach(sub => ids.push(sub.id));
      }
    });
    return ids;
  };

  const handleSelectAll = () => {
    const allIds = getAllSelectableIds();
    const allSelected = allIds.every(id => selected[id]);
    
    const newState: Record<string, boolean> = {};
    if (!allSelected) {
      allIds.forEach(id => {
        newState[id] = true;
      });
    }
    setSelected(newState);
  };

  const allSelected = getAllSelectableIds().every(id => selected[id]);

  const [email, setEmail] = useState("");

  const handleSignUp = () => {
    const hasSelection = Object.values(selected).some((val) => val === true);
    
    if (!hasSelection) {
      alert("Please select at least one newsletter to sign up.");
      return;
    }

    if (email.trim() === "") {
      alert("Please enter your email to sign up.");
      return;
    }
    // Redirect to success page
    window.location.href = "/newsletters/success";
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-1 bg-white text-gray-900 pb-20">
        <div className="bg-[#faf9f6] py-16 px-4 flex flex-col items-center text-center border-b border-gray-200">
          <h1 className="text-4xl md:text-5xl font-serif tracking-widest text-[#ce1126] mb-4">
            NEWSLETTERS
          </h1>
          <p className="text-gray-500 font-serif text-[15px] italic">
            Stay up to date with our daily newsletter
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-4 lg:px-8 mt-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-medium text-[#111827] mb-6 leading-relaxed">
              Let the best of POLITICO news come to you.
            </h2>
            <p className="text-[13px] text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Select any of the free newsletters below. Then, enter your email address and click "Sign Up." <br className="hidden md:block" />
              Your newsletter subscriptions with us are subject to POLITICO's <a href="#" className="text-[#ce1126] hover:underline">Terms and Conditions</a> and <a href="#" className="text-[#ce1126] hover:underline">Privacy Policy</a>.
            </p>
            <button
              onClick={handleSelectAll}
              className="mt-8 bg-[#ce1126] text-white font-bold text-[11px] uppercase tracking-wider px-8 py-3.5 hover:bg-[#a00c1c] transition-colors rounded-sm"
            >
              {allSelected ? "DESELECT ALL NEWSLETTERS" : "SELECT ALL NEWSLETTERS"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {mainCategories.map((cat) => (
              <div key={cat.id} className="flex flex-col">
                <div 
                  className="flex items-center gap-4 cursor-pointer group mb-3" 
                  onClick={() => handleToggleCategory(cat.id)}
                >
                  <div className={`w-5 h-5 border ${selected[cat.id] ? 'bg-[#ce1126] border-[#ce1126]' : 'border-gray-400'} flex items-center justify-center rounded-sm transition-colors group-hover:border-[#ce1126]`}>
                    {selected[cat.id] && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-[22px] font-serif text-gray-900 leading-none">{cat.name}</h3>
                </div>

                {megaMenuData[cat.id] && (
                  <div className="ml-9 space-y-3 mt-1">
                    {megaMenuData[cat.id].map(sub => (
                      <div 
                        key={sub.id} 
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => handleToggleSub(sub.id, cat.id)}
                      >
                        <div className={`w-4 h-4 border ${selected[sub.id] ? 'bg-[#ce1126] border-[#ce1126]' : 'border-gray-300'} flex items-center justify-center rounded-sm transition-colors group-hover:border-[#ce1126]`}>
                          {selected[sub.id] && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="text-[15px] text-gray-700">{sub.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-20 pt-10 border-t border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-center max-w-xl mx-auto gap-0 shadow-sm border border-gray-300 rounded-sm overflow-hidden">
              <div className="flex items-center w-full bg-white px-4 py-3">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  className="w-full text-[14px] outline-none text-gray-700 placeholder-gray-400"
                />
              </div>
              <button 
                onClick={handleSignUp}
                className="w-full md:w-auto bg-[#ce1126] hover:bg-[#a00c1c] text-white font-bold text-[13px] px-8 py-3.5 tracking-wider whitespace-nowrap transition-colors"
              >
                SIGN UP NOW
              </button>
            </div>
            <p className="text-center text-[11px] text-gray-500 mt-4">
              You can unsubscribe at any time. By signing up you are agreeing to our <a href="#" className="text-[#ce1126] hover:underline">Terms of Service</a> and <a href="#" className="text-[#ce1126] hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
