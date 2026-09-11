"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { slugify } from "@/data/newsArticles";

const magazineArticles = [
  {
    id: "1",
    tag: "COLUMN",
    title: "Will Kevin Warsh Squander a Huge Opportunity?",
    deck: "The new Fed chair will have the spotlight at the central bank's high-profile conference in Jackson Hole. He should use it.",
    author: "BY VICTORIA GUIDA",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "2",
    tag: "COLUMN",
    title: "A Pork Tenderloin, a State Fair and Democrats' Best Shot at Iowa in Decades",
    deck: "Rob Sand is betting his independent streak can help him win over Iowa's increasingly Republican voters.",
    author: "BY JONATHAN MARTIN",
    image:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "3",
    tag: "MAGAZINE",
    title: "He's a Former General and a Grieving Father. And He Could Defeat Netanyahu.",
    deck: "Gadi Eisenkot's party is leading many polls. Will he loosen Netanyahu's grip on power?",
    author: "BY JAN PHILIPP BURGARD",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "4",
    tag: "COLUMN",
    title: "The Massive Movermaking Exodus from Hollywood",
    deck: "From Illinois to the Canary Islands and Cape Town, governments have turned film production into an auction with no clear winner.",
    author: "BY DANIEL MILLER",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "5",
    tag: "COLUMN",
    title: "The Republican Party's Midterm Nightmare Is Taking Shape",
    deck: "Democrats see an opening in the states where Trump's policies are hitting hardest.",
    author: "BY JONATHAN MARTIN",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "6",
    tag: "COLUMN",
    title: "The British Prime Minister's New Digs",
    deck: "A look at Andy Burnham's Manchester office and what it reveals about his political ambitions.",
    author: "BY DAN BLOOM",
    image:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "7",
    tag: "COLUMN",
    title: "How Badly Does Debbie Wasserman Schultz Want to Stay in Congress?",
    deck: "A decade after her career seemed to implode, the former DNC chair is back in the thick of Democratic politics.",
    author: "BY KIMBERLY LEONARD",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "8",
    tag: "COLUMN",
    title: "TACO No More: How Trump Won on Tariffs",
    deck: "Backlash against tariffs has the potential to cost the White House dearly in the November elections.",
    author: "BY VICTORIA GUIDA",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "9",
    tag: "COLUMN",
    title: "What Happens If the AI Boom Stops Paying for Itself?",
    deck: "The industry is betting on utility-scale power and massive data-center spending, but demand can shift quickly.",
    author: "BY HILARY RUSSO",
    image:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "10",
    tag: "COLUMN",
    title: "A Quiet Power Shift in the Senate Is Changing the Budget Fight",
    deck: "Theold guard is losing ground as the next generation of lawmakers pushes a tougher line against spending.",
    author: "BY DIANA MENGO",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "11",
    tag: "MAGAZINE",
    title: "Why Small Cities Are Becoming the New Political Battleground",
    deck: "Local mayors and school-board races are producing a sharper national picture in a divided electorate.",
    author: "BY SAMANTHA KORN",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "12",
    tag: "COLUMN",
    title: "Inside the Battle for Swing State Voters' Hearts",
    deck: "Political operatives are doubling down on micro-targeting strategies that could reshape the electoral map.",
    author: "BY ALEX BURNS",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "13",
    tag: "MAGAZINE",
    title: "The Tech Executive Who Could Change How Congress Works",
    deck: "Meet the Silicon Valley insider advising lawmakers on artificial intelligence regulation and crypto policy.",
    author: "BY NANCY SCOLA",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "14",
    tag: "COLUMN",
    title: "The DNC's New Blueprint for Winning the Electoral College",
    deck: "Democratic strategists are rolling out a data-driven approach to target college-educated suburban voters.",
    author: "BY MICHAEL STRATFORD",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "15",
    tag: "MAGAZINE",
    title: "How Federal Judges Are Reshaping the Immigration Debate",
    deck: "A wave of court decisions is undoing decades of precedent on refugee policy and border enforcement.",
    author: "BY JOSH GERSTEIN",
    image:
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "16",
    tag: "COLUMN",
    title: "The Secret Behind Biden's Surprisingly Strong Approval Among Latinos",
    deck: "Economic messaging and local organizing efforts are paying dividends with a crucial voting bloc.",
    author: "BY ZAINEB D'SOUZA",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "17",
    tag: "MAGAZINE",
    title: "Corporate America's New Political Tightrope",
    deck: "Fortune 500 executives are navigating increasingly polarized politics while protecting their bottom lines.",
    author: "BY LAUREN GARDNER",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "18",
    tag: "COLUMN",
    title: "The Unexpected Coalition Shaking Up Senate Republicans",
    deck: "A bloc of moderates is pushing back against hardline demands and reshaping GOP priorities.",
    author: "BY BURGESS EVERETT",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80",
  },
];

export default function MagazineCarousel() {
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [cardWidth, setCardWidth] = useState(280);
  const wheelCooldownRef = useRef(0);
  const gap = 16;

  // Get responsive visible count based on screen width
  const getResponsiveVisibleCount = () => {
    if (typeof window === "undefined") return 3;
    const width = window.innerWidth;
    if (width < 640) return 1;    // Mobile
    if (width < 1024) return 2;   // Tablet
    return 4;                     // Laptop and desktop
  };

  const getResponsiveCardWidth = () => {
    if (typeof window === "undefined") return 280;
    const width = Math.min(window.innerWidth, 1440);
    const count = getResponsiveVisibleCount();
    return count >= 4 ? (width - gap * (count - 1)) / count : 280;
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newVisibleCount = getResponsiveVisibleCount();
      setVisibleCount(newVisibleCount);
      setCardWidth(getResponsiveCardWidth());
      setStartIndex(0); // Reset scroll position on resize
    };

    // Set initial value
    const initialCount = getResponsiveVisibleCount();
    setVisibleCount(initialCount);
    setCardWidth(getResponsiveCardWidth());

    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Total cards = 1 (POLITICO MAGAZINE header) + articleCount
  const totalCards = magazineArticles.length + 1;
  // maxIndex calculation: allow scrolling until the last card is in view
  const maxIndex = Math.max(0, totalCards - visibleCount);
  
  // Clamp startIndex to prevent over-scrolling
  const clampedStartIndex = Math.min(Math.max(0, startIndex), maxIndex);
  
  // Calculate the actual visible scroll width for the viewport
  const totalScrollWidth = totalCards * (cardWidth + gap);
  // Use clamped index for offset to prevent over-scrolling
  const offset = clampedStartIndex * (cardWidth + gap);
  const pageStep = visibleCount >= 4 ? 4 : visibleCount;
  const pageStarts = Array.from(
    new Set([
      ...Array.from({ length: Math.ceil(totalCards / pageStep) }, (_, index) => index * pageStep),
      maxIndex,
    ])
  ).filter((index) => index <= maxIndex);
  const currentPage = Math.max(0, pageStarts.findIndex((index) => index === clampedStartIndex));
  const progressWidth = `${100 / pageStarts.length}%`;

  return (
    <section className="w-full my-10 font-sans">
      <div
        className="overflow-hidden"
        style={{ 
          touchAction: "pan-y",
          width: "100%",
          maxWidth: "100%"
        }}
        onWheel={(e) => {
          const now = Date.now();
          if (now < wheelCooldownRef.current) return;
          const ev = e as React.WheelEvent;
          const deltaX = ev.deltaX;
          const deltaY = ev.deltaY;
          const threshold = 30;
          if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
            // Mobile: scroll 1, Tablet: scroll 2, Laptop/desktop: scroll 4
            let scrollAmount = 4;
            if (visibleCount === 1) scrollAmount = 1;      // Mobile
            else if (visibleCount === 2) scrollAmount = 2; // Tablet
            
            const newIndex = deltaX > 0 
              ? Math.min(clampedStartIndex + scrollAmount, maxIndex)
              : Math.max(clampedStartIndex - scrollAmount, 0);
            setStartIndex(newIndex);
            wheelCooldownRef.current = now + 300;
            ev.preventDefault();
            ev.stopPropagation();
          }
        }}
      >
        <div 
          className="flex gap-4 transition-transform duration-300 ease-out" 
          style={{ 
            transform: `translateX(-${offset}px)`,
            willChange: "transform"
          }}
        >
          <div className="flex-shrink-0 bg-[#f7f7f7] p-8 flex flex-col items-center justify-center text-center relative h-[420px] border border-transparent" style={{ width: `${cardWidth}px` }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2">
              <div className="w-16 h-5 bg-[#ce1126]" style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 15% 100%)" }}></div>
            </div>
            <span className="font-extrabold text-xs tracking-[0.18em] text-[#ce1126] uppercase mb-1">
              POLITICO
            </span>
            <span className="font-serif font-black text-4xl tracking-wide text-gray-900 uppercase leading-none">
              MAGAZINE
            </span>
          </div>

          {magazineArticles.map((article) => (
            <a
              key={article.id}
              href={`/news/${slugify(article.title)}`}
              className="flex-shrink-0 bg-[#f7f7f7] p-4 flex flex-col justify-between group cursor-pointer hover:shadow-md transition-shadow border border-transparent block text-left"
              style={{ width: `${cardWidth}px` }}
            >
              <div>
                <div className="aspect-[16/10] bg-gray-200 overflow-hidden mb-4">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-[11px] font-black uppercase text-[#ce1126] tracking-wider block mb-2">
                  {article.tag}
                </span>
                <h3 className="font-serif text-[23px] font-black leading-[1.05] text-gray-900 group-hover:text-[#ce1126] transition-colors mb-3 tracking-[-0.03em]">
                  {article.title}
                </h3>
                <p className="text-xs text-gray-600 font-serif leading-relaxed mb-4">
                  {article.deck}
                </p>
              </div>
              <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">
                {article.author}
              </p>
            </a>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mt-6 pt-2">
        <button
          onClick={() => setStartIndex(pageStarts[Math.max(currentPage - 1, 0)])}
          disabled={clampedStartIndex === 0}
          className="flex h-14 w-14 flex-shrink-0 items-center justify-center border border-[#e2e2e2] bg-white text-[#315b8c] transition-colors duration-200 hover:border-[#315b8c] hover:bg-[#315b8c] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous slide"
        >
          <ChevronLeft size={22} strokeWidth={1.5} />
        </button>

        <div
          className="relative h-[2px] flex-1 bg-[#dedede]"
          style={{
            backgroundImage: `repeating-linear-gradient(to right, transparent 0, transparent calc(${100 / pageStarts.length}% - 1px), #cfcfcf calc(${100 / pageStarts.length}% - 1px), #cfcfcf ${100 / pageStarts.length}%)`,
          }}
          aria-label={`${pageStarts.length} magazine pages`}
        >
          <div
            className="absolute left-0 top-0 h-[3px] bg-[#171b2e] transition-all duration-300"
            style={{ 
              width: progressWidth,
              transform: `translateX(${currentPage * 100}%)`,
            }}
          />
        </div>

        <button
          onClick={() => setStartIndex(pageStarts[Math.min(currentPage + 1, pageStarts.length - 1)])}
          disabled={clampedStartIndex >= maxIndex}
          className="flex h-14 w-14 flex-shrink-0 items-center justify-center border border-[#e2e2e2] bg-white text-[#315b8c] transition-colors duration-200 hover:border-[#315b8c] hover:bg-[#315b8c] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next slide"
        >
          <ChevronRight size={22} strokeWidth={1.5} />
        </button>
      </div>
    </section>
  );
}
