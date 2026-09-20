import { slugify } from "@/data/newsArticles";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import LatestNewsList from "@/components/home/LatestNewsList";
import TopNewsGrid from "@/components/home/TopNewsGrid";
import MoreTopHeadlines from "@/components/home/MoreTopHeadlines";
import MoreTopSidebar from "@/components/home/MoreTopSidebar";
import TopSidebarWidgets from "@/components/home/TopSidebarWidgets";
import MagazineCarousel from "@/components/home/MagazineCarousel";
import CongressSection from "@/components/home/CongressSection";
import WhiteHouseSection from "@/components/home/WhiteHouseSection";
import LegalSection from "@/components/home/LegalSection";
import StatesSection from "@/components/home/StatesSection";
import ElectionsSection from "@/components/home/ElectionsSection";
import ForeignAffairsSection from "@/components/home/ForeignAffairsSection";
import EarlierSection from "@/components/home/EarlierSection";
import ThreeColumnSection from "@/components/home/ThreeColumnSection";
import AdvertisementSlot from "@/components/common/AdvertisementSlot";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />

      <div
        className="w-full flex-1 relative flex flex-col items-center bg-[#f3eadd]"
      >
        {/* ── Top Banner Advertisement (In the Grey Gap) ── */}
        <div className="w-full max-w-[970px] mx-auto mt-6 hidden lg:block">
          <div className="w-full font-sans text-center">
            <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-2">
              Advertisement
            </span>
            <div className="w-full min-h-[110px] sm:min-h-[140px] bg-[#f9fafb] border border-[#e5e7eb] rounded-xs flex flex-col items-center justify-center p-6 relative overflow-hidden">
              <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase border border-gray-300 px-2.5 py-0.5 rounded mb-1">
                AD
              </span>
              <span className="text-[11px] font-sans font-medium text-gray-400">
                POLITICO Commercial Network
              </span>
            </div>
          </div>
        </div>

        <main className="flex-1 max-w-[1440px] w-[98%] xl:w-[95%] 2xl:w-[1440px] mx-auto mt-6 lg:mt-10 px-4 lg:px-8 pt-6 lg:pt-8 pb-0 space-y-6 bg-white shadow-2xl">
          {/* ── TOP FOLD ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)_320px] gap-4 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
            {/* Left: Latest News Sidebar */}
            <div className="order-2 lg:order-1 pt-4 lg:pt-0 lg:sticky lg:top-[120px] lg:self-start lg:max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar">
              <LatestNewsList />
            </div>

            {/* Center: Top News */}
            <div className="order-1 lg:order-2 pt-4 lg:pt-0 lg:px-4">
              <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#d9d9d9]">
                <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
                <h2 className="text-[10px] font-extrabold tracking-[0.12em] text-[#222222] uppercase font-sans">
                  TOP NEWS
                </h2>
              </div>
              <a href={`/news/${slugify("'The US can't lose': Pentagon plows ahead on AI despite warnings")}`}  className="mb-6 group cursor-pointer"  target="_blank">
                <h1 className="text-[40px] md:text-[52px] font-bold leading-[1] tracking-[-0.03em] text-[#111111] group-hover:text-[#d32f2f] transition-colors mb-4 font-sans">
                  &apos;The US can&apos;t lose&apos;: Pentagon plows ahead on AI despite warnings
                </h1>
                <p className="text-[17px] leading-[1.4] text-[#333333] font-sans mb-4">
                  Military leaders say they don&apos;t have the luxury of holding back on artificial intelligence, even as some experts warn against its potential use in lethal drones.
                </p>
                <div className="w-full aspect-[16/9] bg-gray-200 mb-6 overflow-hidden">
                  <img src="https://picsum.photos/seed/1/800/600" alt="Pentagon" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                </div>
              </a>
              
              {/* Row of 3 small articles */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[1, 2, 3].map((i) => (
                  <a href={`/news/${slugify("Small article headline for the row of three")}`}  key={i} className="group cursor-pointer"  target="_blank">
                    <div className="w-full aspect-video bg-gray-200 mb-2 overflow-hidden">
                       <img src="https://picsum.photos/seed/2/800/600" alt="News" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                    </div>
                    <h3 className="text-[14px] font-bold leading-[1.2] tracking-[-0.02em] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans">
                      Small article headline for the row of three
                    </h3>
                  </a>
                ))}
              </div>

              <h2 className="text-[24px] font-bold leading-[1.2] tracking-[-0.02em] text-[#111111] mb-4 font-sans border-t border-gray-200 pt-4">
                Even if AI sparks a wave of spam, here&apos;s what&apos;s next.
              </h2>
              
              {/* Row of 2 articles */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                 {[1, 2].map((i) => (
                  <a href={`/news/${slugify("Treasury Secretary announces new sanctions on foreign oligarchs")}`}  key={i} className="group cursor-pointer"  target="_blank">
                    <div className="w-full aspect-video bg-gray-200 mb-2 overflow-hidden">
                       <img src="https://picsum.photos/seed/3/800/600" alt="News" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                    </div>
                    <h3 className="text-[18px] font-bold leading-[1.2] tracking-[-0.02em] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans">
                      Treasury Secretary announces new sanctions on foreign oligarchs
                    </h3>
                  </a>
                ))}
              </div>

              <div className="mt-8">
                <MoreTopHeadlines />
              </div>
            </div>

            {/* Right: Top Article + 3 Links + Ad1 */}
            <div className="order-3 pt-4 lg:pt-0 lg:mt-0 h-full pb-4 flex flex-col relative lg:pl-4">
              <div className="mb-6 space-y-4">
                <a href={`/news/${slugify("Trump threatens to revoke media credentials from outlets covering him")}`}  className="group cursor-pointer mb-6 border-b border-gray-200 pb-4"  target="_blank">
                  <div className="w-full aspect-video bg-gray-200 mb-3 overflow-hidden">
                    <img src="https://picsum.photos/seed/4/800/600" alt="Trump" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                  </div>
                  <h3 className="text-[17px] font-bold leading-[1.1] tracking-[-0.02em] text-[#111111] group-hover:text-[#d32f2f] transition-colors mb-1 font-sans">
                    Trump threatens to revoke media credentials from outlets covering him
                  </h3>
                </a>
                
                {[1, 2, 3].map((i) => (
                  <a href={`/news/${slugify("Senators propose bipartisan legislation to regulate cryptocurrency")}`}  key={i} className="group cursor-pointer border-b border-gray-100 pb-4 last:border-0"  target="_blank">
                    <h3 className="text-[15px] font-bold leading-[1.3] text-[#111111] group-hover:text-[#d32f2f] transition-colors mb-1 font-sans">
                      Senators propose bipartisan legislation to regulate cryptocurrency
                    </h3>
                  </a>
                ))}
              </div>

              {/* Ad1 */}
              <div className="lg:sticky lg:top-[120px] lg:self-start w-full mt-4">
                <div className="w-full aspect-square bg-[#e5e7eb] flex items-center justify-center border border-gray-300">
                  <span className="text-gray-500 font-bold text-xl">Ad1</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── POLITICO MAGAZINE Carousel ── */}
          <div className="w-full border-t border-b border-gray-200 py-4">
            <MagazineCarousel />
          </div>

          {/* ── MIDDLE FOLD: Below Carousel ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)_320px] gap-6 mt-8 h-full">
            {/* Left Column: News + Ads */}
            <div className="flex flex-col space-y-8">
              <div className="w-full">
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#d9d9d9]">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
                  <h2 className="text-[10px] font-extrabold tracking-[0.12em] text-[#222222] uppercase font-sans">
                    NEWS
                  </h2>
                </div>
                <ul className="space-y-6">
                  {[1, 2, 3, 4].map((i) => (
                    <li key={i} className="group cursor-pointer">
                      <div className="w-full aspect-[4/3] bg-gray-200 mb-2 overflow-hidden">
                        <img src="https://picsum.photos/seed/5/800/600" alt="News" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                      </div>
                      <h3 className="text-[13px] font-bold leading-[1.3] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans mb-1">
                        Energy department highlights breakthroughs in fusion research
                      </h3>
                      <p className="text-[9px] font-black uppercase text-gray-400 mt-1">BY AUTHOR NAME</p>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Ad1 Blocks */}
              <div className="space-y-6 pt-4 flex-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`w-full aspect-square bg-[#e5e7eb] flex items-center justify-center border border-gray-300 relative ${i === 3 ? 'lg:sticky lg:top-[120px]' : ''}`}>
                    <span className="text-gray-500 font-bold text-xl">Ad1</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Center Column: Election, Congress, Defense */}
            <div className="flex flex-col lg:px-6 border-l border-r border-gray-200">
              {/* ELECTION */}
              <div className="w-full mb-10">
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#d9d9d9]">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
                  <h2 className="text-[10px] font-extrabold tracking-[0.12em] text-[#222222] uppercase font-sans">
                    ELECTION
                  </h2>
                </div>
                <a href={`/news/${slugify("Biden races to hold the blue wall as Democrats begin to panic")}`}  className="mb-6 group cursor-pointer border-b border-gray-200 pb-6"  target="_blank">
                  <div className="w-full aspect-[16/9] bg-gray-200 mb-4 overflow-hidden">
                     <img src="https://picsum.photos/seed/6/800/600" alt="Election" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                  </div>
                  <h3 className="text-[26px] font-bold leading-[1.1] tracking-[-0.02em] text-[#111111] group-hover:text-[#d32f2f] transition-colors mb-2 font-sans">
                    Biden races to hold the blue wall as Democrats begin to panic
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#6b6b6b] font-sans">
                    BY JONATHAN MARTIN
                  </p>
                </a>

                <div className="flex flex-col space-y-4">
                  {[1, 2, 3].map((i) => (
                    <a href={`/news/${slugify("Smaller election article headline that spans a couple of lines")}`}  key={i} className="group cursor-pointer flex gap-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0"  target="_blank">
                      <div className="w-[120px] h-[80px] bg-gray-200 shrink-0 overflow-hidden">
                        <img src="https://picsum.photos/seed/7/800/600" alt="Election News" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                      </div>
                      <h3 className="text-[16px] font-bold leading-[1.2] tracking-[-0.01em] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans mt-1">
                        Smaller election article headline that spans a couple of lines {i}
                      </h3>
                    </a>
                  ))}
                </div>
              </div>

              {/* CONGRESS */}
              <div className="w-full mb-10 border-t border-gray-200 pt-8">
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#d9d9d9]">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
                  <h2 className="text-[10px] font-extrabold tracking-[0.12em] text-[#222222] uppercase font-sans">
                    CONGRESS
                  </h2>
                </div>
                <a href={`/news/${slugify("Trump's former UN ambassador says she is 'a voice for reason'")}`}  className="mb-6 group cursor-pointer border-b border-gray-200 pb-6"  target="_blank">
                  <div className="w-full aspect-[16/9] bg-gray-200 mb-4 overflow-hidden">
                     <img src="https://picsum.photos/seed/8/800/600" alt="Congress" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                  </div>
                  <h3 className="text-[26px] font-bold leading-[1.1] tracking-[-0.02em] text-[#111111] group-hover:text-[#d32f2f] transition-colors mb-2 font-sans">
                    Trump's former UN ambassador says she is 'a voice for reason'
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#6b6b6b] font-sans">
                    BY ALEX ISENSTADT
                  </p>
                </a>

                <div className="flex flex-col space-y-4">
                  {[1, 2, 3].map((i) => (
                    <a href={`/news/${slugify("Justice Department opens antitrust probe into telecom mergers")}`}  key={i} className="group cursor-pointer flex gap-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0"  target="_blank">
                      <div className="w-[120px] h-[80px] bg-gray-200 shrink-0 overflow-hidden">
                        <img src="https://picsum.photos/seed/9/800/600" alt="Congress News" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                      </div>
                      <h3 className="text-[16px] font-bold leading-[1.2] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans mt-1">
                        Justice Department opens antitrust probe into telecom mergers
                      </h3>
                    </a>
                  ))}
                </div>
              </div>

              {/* DEFENSE */}
              <div className="w-full mb-10 border-t border-gray-200 pt-8">
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#d9d9d9]">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
                  <h2 className="text-[10px] font-extrabold tracking-[0.12em] text-[#222222] uppercase font-sans">
                    DEFENSE
                  </h2>
                </div>
                <a href={`/news/${slugify("Election watchers brace for Trump's next move")}`}  className="mb-6 group cursor-pointer border-b border-gray-200 pb-6"  target="_blank">
                  <div className="w-full aspect-[16/9] bg-gray-200 mb-4 overflow-hidden">
                     <img src="https://picsum.photos/seed/10/800/600" alt="Defense" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                  </div>
                  <h3 className="text-[26px] font-bold leading-[1.1] tracking-[-0.02em] text-[#111111] group-hover:text-[#d32f2f] transition-colors mb-2 font-sans">
                    Election watchers brace for Trump's next move
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#6b6b6b] font-sans">
                    BY PAUL MCLEARY
                  </p>
                </a>

                <div className="flex flex-col space-y-4">
                  {[1, 2, 3].map((i) => (
                    <a href={`/news/${slugify("Voter turnout initiatives target suburban districts ahead of midterms")}`}  key={i} className="group cursor-pointer flex gap-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0"  target="_blank">
                      <div className="w-[120px] h-[80px] bg-gray-200 shrink-0 overflow-hidden">
                        <img src="https://picsum.photos/seed/11/800/600" alt="Defense News" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                      </div>
                      <h3 className="text-[16px] font-bold leading-[1.2] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans mt-1">
                        Voter turnout initiatives target suburban districts ahead of midterms
                      </h3>
                    </a>
                  ))}
                </div>
              </div>

              {/* STATES */}
              <div className="w-full mb-10 border-t border-gray-200 pt-8">
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#d9d9d9]">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
                  <h2 className="text-[10px] font-extrabold tracking-[0.12em] text-[#222222] uppercase font-sans">
                    STATES
                  </h2>
                </div>
                <a href={`/news/${slugify("New talks to shore up California's environmental enforcement fall apart")}`}  className="mb-6 group cursor-pointer border-b border-gray-200 pb-6"  target="_blank">
                  <div className="w-full aspect-[16/9] bg-gray-200 mb-4 overflow-hidden">
                     <img src="https://picsum.photos/seed/12/800/600" alt="States" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                  </div>
                  <h3 className="text-[26px] font-bold leading-[1.1] tracking-[-0.02em] text-[#111111] group-hover:text-[#d32f2f] transition-colors mb-2 font-sans">
                    New talks to shore up California's environmental enforcement fall apart
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#6b6b6b] font-sans">
                    BY REPORTER NAME
                  </p>
                </a>

                <div className="flex flex-col space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <a href={`/news/${slugify("Smaller state article headline")}`}  key={i} className="group cursor-pointer flex gap-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0"  target="_blank">
                      <div className="w-[120px] h-[80px] bg-gray-200 shrink-0 overflow-hidden">
                        <img src="https://picsum.photos/seed/13/800/600" alt="States News" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                      </div>
                      <h3 className="text-[16px] font-bold leading-[1.2] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans mt-1">
                        Smaller state article headline {i}
                      </h3>
                    </a>
                  ))}
                </div>
              </div>
              {/* LEGAL */}
              <div className="w-full mb-10 border-t border-gray-200 pt-8">
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#d9d9d9]">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
                  <h2 className="text-[10px] font-extrabold tracking-[0.12em] text-[#222222] uppercase font-sans">
                    LEGAL
                  </h2>
                </div>
                <a href={`/news/${slugify("Democrats are worried about AI. They're not planning to let it loose on the campaign trail.")}`}  className="mb-6 group cursor-pointer border-b border-gray-200 pb-6"  target="_blank">
                  <div className="w-full aspect-[16/9] bg-gray-200 mb-4 overflow-hidden">
                     <img src="https://picsum.photos/seed/14/800/600" alt="Legal" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                  </div>
                  <h3 className="text-[26px] font-bold leading-[1.1] tracking-[-0.02em] text-[#111111] group-hover:text-[#d32f2f] transition-colors mb-2 font-sans">
                    Democrats are worried about AI. They're not planning to let it loose on the campaign trail.
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#6b6b6b] font-sans">
                    BY REPORTER NAME
                  </p>
                </a>

                <div className="flex flex-col space-y-4">
                  {[1, 2, 3].map((i) => (
                    <a href={`/news/${slugify("Bipartisan group unveils new border security framework")}`}  key={i} className="group cursor-pointer flex gap-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0"  target="_blank">
                      <div className="w-[120px] h-[80px] bg-gray-200 shrink-0 overflow-hidden">
                        <img src="https://picsum.photos/seed/15/800/600" alt="Legal News" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                      </div>
                      <h3 className="text-[16px] font-bold leading-[1.2] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans mt-1">
                        Bipartisan group unveils new border security framework
                      </h3>
                    </a>
                  ))}
                </div>
              </div>

              {/* HEALTH CARE */}
              <div className="w-full mb-10 border-t border-gray-200 pt-8">
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#d9d9d9]">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
                  <h2 className="text-[10px] font-extrabold tracking-[0.12em] text-[#222222] uppercase font-sans">
                    HEALTH CARE
                  </h2>
                </div>
                <a href={`/news/${slugify("novo")}`}  className="mb-6 group cursor-pointer border-b border-gray-200 pb-6"  target="_blank">
                  <div className="w-full aspect-[16/9] bg-[#f8f9fa] border border-gray-200 mb-4 flex flex-col items-center justify-center overflow-hidden">
                     <h2 className="text-blue-600 text-6xl font-serif italic font-bold mb-2">novo</h2>
                     <p className="text-xs font-sans font-bold">Leading Medical Research</p>
                  </div>
                  <h3 className="text-[26px] font-bold leading-[1.1] tracking-[-0.02em] text-[#111111] group-hover:text-[#d32f2f] transition-colors mb-2 font-sans">
                    Changes to overtime rules put on ice by Texas judge
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#6b6b6b] font-sans">
                    BY REPORTER NAME
                  </p>
                </a>

                <div className="flex flex-col space-y-4">
                  {[1, 2, 3].map((i) => (
                    <a href={`/news/${slugify("Smaller health care article headline")}`}  key={i} className="group cursor-pointer flex gap-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0"  target="_blank">
                      <div className="w-[120px] h-[80px] bg-gray-200 shrink-0 overflow-hidden">
                        <img src="https://picsum.photos/seed/16/800/600" alt="Health News" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                      </div>
                      <h3 className="text-[16px] font-bold leading-[1.2] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans mt-1">
                        Smaller health care article headline {i}
                      </h3>
                    </a>
                  ))}
                </div>
              </div>

              {/* MORE */}
              <div className="w-full mb-10 border-t border-gray-200 pt-8">
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#d9d9d9]">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
                  <h2 className="text-[10px] font-extrabold tracking-[0.12em] text-[#222222] uppercase font-sans">
                    MORE
                  </h2>
                </div>
                
                <div className="flex flex-col space-y-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                    <a href={`/news/${slugify("Smaller more section article headline")}`}  key={i} className="group cursor-pointer flex gap-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0"  target="_blank">
                      <div className="w-[120px] h-[80px] bg-gray-200 shrink-0 overflow-hidden">
                        <img src="https://picsum.photos/seed/17/800/600" alt="More News" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                      </div>
                      <h3 className="text-[16px] font-bold leading-[1.2] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans mt-1">
                        Smaller more section article headline {i}
                      </h3>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Opinion, Magazine, Video, Podcasts, Ad1 */}
            <div className="flex flex-col space-y-8">
              {/* OPINION */}
              <div className="w-full">
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#d9d9d9]">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
                  <h2 className="text-[10px] font-extrabold tracking-[0.12em] text-[#222222] uppercase font-sans">
                    OPINION
                  </h2>
                </div>
                <div className="w-full aspect-[4/3] bg-gray-200 overflow-hidden border border-gray-200 cursor-pointer group">
                  <img src="https://picsum.photos/seed/18/800/600" alt="Cartoon" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                </div>
              </div>

              {/* MAGAZINE */}
              <div className="w-full border-t border-gray-200 pt-6">
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#d9d9d9]">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
                  <h2 className="text-[10px] font-extrabold tracking-[0.12em] text-[#222222] uppercase font-sans">
                    MAGAZINE
                  </h2>
                </div>
                <a href={`/news/${slugify("Why Democrats are losing the working class")}`}  className="group cursor-pointer mb-4"  target="_blank">
                  <div className="w-full aspect-video bg-gray-200 mb-2 overflow-hidden">
                    <img src="https://picsum.photos/seed/19/800/600" alt="Magazine" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                  </div>
                  <h3 className="text-[15px] font-bold leading-[1.2] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans">
                    Why Democrats are losing the working class
                  </h3>
                </a>
                <ul className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <li key={i} className="flex gap-2 group cursor-pointer items-start border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d32f2f] shrink-0 mt-2"></span>
                      <h3 className="text-[13px] font-bold leading-[1.3] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans">
                        Tech CEOs face grueling Senate hearing on data privacy
                      </h3>
                    </li>
                  ))}
                </ul>
              </div>

              {/* VIDEO */}
              <div className="w-full border-t border-gray-200 pt-6">
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#d9d9d9]">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
                  <h2 className="text-[10px] font-extrabold tracking-[0.12em] text-[#222222] uppercase font-sans">
                    VIDEO
                  </h2>
                </div>
                <ul className="space-y-4 divide-y divide-[#e5e5e5]">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <li key={i} className="pt-4 first:pt-0">
                      <a href={`/news/${slugify("New polls show tightening race in key rust belt states")}`}  className="flex gap-3 group"  target="_blank">
                        <div className="w-[70px] h-[45px] bg-gray-200 shrink-0 overflow-hidden relative">
                           <img src="https://picsum.photos/seed/20/800/600" alt="Video" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                           <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                             <div className="w-4 h-4 rounded-full bg-black/60 flex items-center justify-center">
                               <div className="w-0 h-0 border-t-4 border-l-6 border-b-4 border-transparent border-l-white ml-1"></div>
                             </div>
                           </div>
                        </div>
                        <h3 className="text-[13px] font-bold leading-[1.3] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans">
                          New polls show tightening race in key rust belt states
                        </h3>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* PODCASTS */}
              <div className="w-full border-t border-gray-200 pt-6">
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#d9d9d9]">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
                  <h2 className="text-[10px] font-extrabold tracking-[0.12em] text-[#222222] uppercase font-sans">
                    PODCASTS
                  </h2>
                </div>
                <ul className="space-y-4 divide-y divide-[#e5e5e5]">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <li key={i} className="pt-4 first:pt-0">
                      <a href={`/news/${slugify("Labor unions plan nationwide strikes ahead of contract negotiations")}`}  className="flex gap-3 group items-center"  target="_blank">
                        <div className="w-[50px] h-[50px] bg-blue-600 shrink-0 flex flex-col items-center justify-center text-white font-sans font-bold leading-none overflow-hidden relative rounded-md">
                           <span className="text-[8px] uppercase tracking-wider mb-0.5 opacity-80">Vol</span>
                           <span className="text-[18px]">{i}</span>
                        </div>
                        <h3 className="text-[13px] font-bold leading-[1.3] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans">
                          Labor unions plan nationwide strikes ahead of contract negotiations
                        </h3>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ad1 */}
              <div className="w-full aspect-square bg-[#e5e7eb] flex items-center justify-center border border-gray-300 lg:sticky lg:top-[120px] lg:self-start">
                <span className="text-gray-500 font-bold text-xl">Ad1</span>
              </div>
            </div>
          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
}
