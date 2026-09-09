"use client";

import React, { useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const newsletters = [
  { id: 'us', title: 'US', freq: 'Weekday mornings', desc: 'The biggest national headlines, policy shifts and stories shaping America — delivered before your first coffee.' },
  { id: 'world', title: 'World', freq: 'Daily', desc: 'Global affairs, conflicts, diplomacy and the international stories that move markets and minds.' },
  { id: 'politics', title: 'Politics', freq: 'Weekday mornings', desc: 'Sharp coverage of Washington, elections, legislation and the power plays behind the headlines.' },
  { id: 'economy', title: 'Economy & Markets', freq: 'Weekday mornings', desc: 'Markets, macro trends, Fed watch and the numbers that matter — explained clearly, every trading day.' },
  { id: 'business', title: 'Business', freq: 'Daily', desc: 'Corporate earnings, deals, leadership moves and the strategies driving the world of business.' },
  { id: 'crypto', title: 'Crypto', freq: 'Weekday Morning', desc: 'Up-to-date, breaking crypto news about the latest Bitcoin, Ethereum, Blockchain, NFTs, and Altcoin trends and events.' },
  { id: 'technology', title: 'Technology', freq: 'Daily', desc: 'AI, big tech, startups and the innovations rewriting how we live and work.' },
  { id: 'travel', title: 'Travel', freq: 'Once a week', desc: 'Destinations, industry trends and smart travel intelligence for the modern globetrotter.' },
  { id: 'opinion', title: 'Opinion', freq: 'Twice a week', desc: 'Provocative columns and expert commentary on the debates that define our time.' },
  { id: 'ceo', title: 'CEO Spotlight', freq: 'Once a week', desc: 'Exclusive profiles and insights from the executives and visionaries leading global business.' },
  { id: 'sports', title: 'Sports', freq: 'Daily', desc: 'Scores, storylines and the business of sports — from the field to the boardroom.' },
  { id: 'health', title: 'Health', freq: 'Once a week', desc: 'The latest health news, scientific trends and medical information, covered in a way that helps you make sense of the complex and constantly changing field of medical knowledge.' }
];

export default function NewslettersPage() {
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const handleToggle = (id: string) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectAll = () => {
    const allSelected = newsletters.every((n) => selected[n.id]);
    const newState: Record<string, boolean> = {};
    if (!allSelected) {
      newsletters.forEach((n) => {
        newState[n.id] = true;
      });
    }
    setSelected(newState);
  };

  const allSelected = newsletters.every((n) => selected[n.id]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-1 bg-white text-gray-900 pb-20">
        {/* Top Banner Section */}
        <div className="bg-[#faf9f6] py-16 px-4 flex flex-col items-center text-center border-b border-gray-200">
          <h1 className="text-4xl md:text-5xl font-serif tracking-widest text-[#ce1126] mb-4">
            NEWSLETTERS
          </h1>
          <p className="text-gray-500 font-serif text-[15px] italic">
            Stay up to date with our daily newsletter
          </p>
        </div>

        {/* Main Content Area */}
        <div className="max-w-4xl mx-auto px-4 lg:px-8 mt-12">
          {/* Intro Text */}
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

          {/* Newsletter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {newsletters.map((nl) => (
              <div key={nl.id} className="flex items-start gap-4 cursor-pointer group" onClick={() => handleToggle(nl.id)}>
                <div className="pt-1">
                  <div className={`w-4 h-4 border ${selected[nl.id] ? 'bg-[#ce1126] border-[#ce1126]' : 'border-gray-300'} flex items-center justify-center rounded-sm transition-colors group-hover:border-[#ce1126]`}>
                    {selected[nl.id] && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-[20px] font-serif text-gray-900 mb-1 leading-none">{nl.title}</h3>
                  <p className="text-[12px] text-gray-500 italic mb-3">{nl.freq}</p>
                  <p className="text-[13px] text-gray-700 leading-relaxed">
                    {nl.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Signup Bar */}
          <div className="mt-20 pt-10 border-t border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-center max-w-xl mx-auto gap-0 shadow-sm border border-gray-300 rounded-sm overflow-hidden">
              <div className="flex items-center w-full bg-white px-4 py-3">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full text-[14px] outline-none text-gray-700 placeholder-gray-400"
                />
              </div>
              <button className="w-full md:w-auto bg-[#ce1126] hover:bg-[#a00c1c] text-white font-bold text-[13px] px-8 py-3.5 tracking-wider whitespace-nowrap transition-colors">
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
