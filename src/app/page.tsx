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
import MainCategorySection from "@/components/home/MainCategorySection";
import LeftCategorySection from "@/components/home/LeftCategorySection";

export default async function Home() {
  // Simulate network delay to ensure the loading skeleton is visible
  await new Promise((resolve) => setTimeout(resolve, 800));
  
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

        <main id="newsfeed" className="flex-1 max-w-[1440px] w-[98%] xl:w-[95%] 2xl:w-[1440px] mx-auto mt-6 lg:mt-10 px-4 lg:px-8 pt-6 lg:pt-8 pb-0 space-y-6 bg-white shadow-2xl">
          {/* ── TOP FOLD ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)_320px] gap-4 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
            {/* Left: Latest News Sidebar */}
            <div className="order-2 lg:order-1 pt-4 lg:pt-0 lg:sticky lg:top-[120px] lg:self-start">
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
              <a href={`/news/${slugify("'The US can't lose': Pentagon plows ahead on AI despite warnings")}`}  className="mb-6 group cursor-pointer block">
                <h1 className="text-[40px] md:text-[52px] font-bold leading-[1] tracking-[-0.03em] text-[#111111] group-hover:text-[#d32f2f] transition-colors mb-4 font-sans">
                  &apos;The US can&apos;t lose&apos;: Pentagon plows ahead on AI despite warnings
                </h1>
                <p className="text-[17px] leading-[1.4] text-[#333333] font-sans mb-2">
                  Military leaders warn the risks of falling behind adversaries in artificial intelligence research outweigh the potential risks of the technology.
                </p>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-sans mb-4">
                  BY LEE SHANE
                </div>
                <div className="w-full aspect-[16/9] bg-gray-200 mb-6 overflow-hidden">
                  <img src="https://picsum.photos/seed/1/800/600" alt="Pentagon" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                </div>
              </a>
              
              {/* Row of 3 small articles */}
              <div className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b border-gray-200">
                  <a href={`/news/${slugify("GOP's gas tax holiday push falters in House")}`} className="group cursor-pointer block">
                    <div className="w-full aspect-video bg-gray-200 mb-2 overflow-hidden">
                       <img src="https://picsum.photos/seed/2/800/600" alt="News" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                    </div>
                    <h3 className="text-[14px] font-bold leading-[1.2] tracking-[-0.02em] text-[#111111] group-hover:text-[#d32f2f] transition-colors mb-1 font-sans">
                      GOP&apos;s gas tax holiday push falters in House
                    </h3>
                    <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider font-sans">
                      BY PAVAN ACHARYA, ANTHONY CRUZ AND MICO PORTUONDO
                    </div>
                  </a>

                  <a href={`/news/${slugify("Trump administration paid federal workers $6.7B to quit, GAO audit says")}`} className="group cursor-pointer block">
                    <div className="w-full aspect-video bg-gray-200 mb-2 overflow-hidden">
                       <img src="https://picsum.photos/seed/3/800/600" alt="News" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                    </div>
                    <h3 className="text-[14px] font-bold leading-[1.2] tracking-[-0.02em] text-[#111111] group-hover:text-[#d32f2f] transition-colors mb-1 font-sans">
                      Trump administration paid federal workers $6.7B to quit, GAO audit says
                    </h3>
                    <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider font-sans">
                      BY CASEY HE
                    </div>
                  </a>

                  <a href={`/news/${slugify("Poll: Americans say there's a serious risk of AI destroying humanity")}`} className="group cursor-pointer block">
                    <div className="w-full aspect-video bg-gray-200 mb-2 overflow-hidden">
                       <img src="https://picsum.photos/seed/4/800/600" alt="News" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                    </div>
                    <div className="text-[10px] font-extrabold text-[#d32f2f] uppercase tracking-widest mb-1 font-sans">
                      THE POLITICO POLL
                    </div>
                    <h3 className="text-[14px] font-bold leading-[1.2] tracking-[-0.02em] text-[#111111] group-hover:text-[#d32f2f] transition-colors mb-1 font-sans">
                      Poll: Americans say there&apos;s a serious risk of AI destroying humanity
                    </h3>
                    <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider font-sans">
                      BY ERIN DOHERTY
                    </div>
                  </a>
              </div>

              <a href={`/news/${slugify("Fears of AI sparked a moment of unity. Now that's over.")}`} className="group cursor-pointer block mb-6">
                <h2 className="text-[28px] font-bold leading-[1.2] tracking-[-0.02em] text-[#111111] group-hover:text-[#d32f2f] transition-colors mb-2 font-sans">
                  Fears of AI sparked a moment of unity. Now that&apos;s over.
                </h2>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-sans mb-4">
                  BY KATHERINE LONG, GABBY MILLER AND OWEN DAHLKAMP
                </div>
              </a>
              
              {/* Row of 2 articles */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                  <a href={`/news/${slugify("Rand Paul kills Kennedy's AI 'kill switch' bill 1")}`} className="group cursor-pointer block">
                    <div className="w-full aspect-video bg-gray-200 mb-2 overflow-hidden">
                       <img src="https://picsum.photos/seed/5/800/600" alt="News" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                    </div>
                    <h3 className="text-[18px] font-bold leading-[1.2] tracking-[-0.02em] text-[#111111] group-hover:text-[#d32f2f] transition-colors mb-2 font-sans">
                      Rand Paul kills Kennedy&apos;s AI &apos;kill switch&apos; bill
                    </h3>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-sans">
                      BY JORDAIN CARNEY
                    </div>
                  </a>
                  <a href={`/news/${slugify("Rand Paul kills Kennedy's AI 'kill switch' bill 2")}`} className="group cursor-pointer block">
                    <div className="w-full aspect-video bg-gray-200 mb-2 overflow-hidden">
                       <img src="https://picsum.photos/seed/5/800/600" alt="News" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                    </div>
                    <h3 className="text-[18px] font-bold leading-[1.2] tracking-[-0.02em] text-[#111111] group-hover:text-[#d32f2f] transition-colors mb-2 font-sans">
                      Rand Paul kills Kennedy&apos;s AI &apos;kill switch&apos; bill
                    </h3>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-sans">
                      BY JORDAIN CARNEY
                    </div>
                  </a>
              </div>

            </div>

            {/* Right: Top Article + 3 Links + Ad1 */}
            <div className="order-3 pt-4 lg:pt-0 lg:mt-0 h-full pb-4 flex flex-col relative lg:pl-4">
              <div className="mb-6 space-y-4">
                <a href={`/news/${slugify("Trump threatens to impose 'serious tariffs' on Europe if Canada joins EU as associate member")}`}  className="group cursor-pointer mb-6 border-b border-gray-200 pb-4 block">
                  <div className="w-full aspect-video bg-gray-200 mb-3 overflow-hidden">
                    <img src="https://picsum.photos/seed/6/800/600" alt="Trump" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                  </div>
                  <h3 className="text-[17px] font-bold leading-[1.1] tracking-[-0.02em] text-[#111111] group-hover:text-[#d32f2f] transition-colors mb-2 font-sans">
                    Trump threatens to impose &apos;serious tariffs&apos; on Europe if Canada joins EU as associate member
                  </h3>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-sans">
                    BY JALEN BECKFORD
                  </div>
                </a>
                
                <a href={`/news/${slugify("House passes Russia sanctions bill, handing Trump more leverage against Moscow")}`}  className="group cursor-pointer border-b border-gray-100 pb-4 block">
                  <h3 className="text-[17px] font-bold leading-[1.2] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans">
                    House passes Russia sanctions bill, handing Trump more leverage against Moscow
                  </h3>
                </a>

                <a href={`/news/${slugify("House passes Russia sanctions bill, handing Trump more leverage against Moscow 2")}`}  className="group cursor-pointer border-b border-gray-100 pb-4 block">
                  <h3 className="text-[17px] font-bold leading-[1.2] text-[#111111] group-hover:text-[#d32f2f] transition-colors mb-2 font-sans">
                    House passes Russia sanctions bill, handing Trump more leverage against Moscow
                  </h3>
                  <p className="text-[13px] leading-[1.3] text-[#333333] font-sans mb-2">
                    The vote ends a nearly two-year pause in Ukraine assistance from Congress.
                  </p>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-sans">
                    BY GISELLE RUBIYYIH EWING
                  </div>
                </a>

                <a href={`/news/${slugify("House overwhelmingly passes bill to shield ratepayers from data centers")}`}  className="group cursor-pointer border-b border-gray-100 pb-4 block last:border-0">
                  <h3 className="text-[17px] font-bold leading-[1.2] text-[#111111] group-hover:text-[#d32f2f] transition-colors mb-2 font-sans">
                    House overwhelmingly passes bill to shield ratepayers from data centers
                  </h3>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-sans">
                    BY MICO PORTUONDO AND AMELIA DAVIDSON
                  </div>
                </a>
              </div>

              {/* Ad 01 */}
              <div className="w-full mt-4 border-t border-gray-200 pt-6 lg:sticky lg:top-[120px] z-10">
                <div className="w-full max-w-[280px] mx-auto aspect-square bg-[#e5e7eb] flex items-center justify-center">
                  <span className="text-[#111111] font-bold text-[32px] tracking-tight">Ad 01</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top section grid (Lower part - More Top Headlines & Newsletters) */}
          <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)_320px] gap-4 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 mt-0 mb-8">
            {/* Left: Empty spacer */}
            <div className="hidden lg:block"></div>

            {/* Center: More Top Headlines */}
            <div className="flex flex-col relative lg:px-4 pt-4 lg:pt-0">
               <MoreTopHeadlines />
            </div>

            {/* Right: Newsletters */}
            <div className="flex flex-col relative lg:pl-4 pt-4 lg:pt-0">
              {/* NEWSLETTERS */}
              <div className="w-full max-w-[260px] border-t border-gray-200 pt-6 lg:border-t-0 lg:pt-0">
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#d9d9d9]">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
                  <h2 className="text-[10px] font-extrabold tracking-[0.12em] text-[#222222] uppercase font-sans">
                    NEWSLETTERS
                  </h2>
                </div>
                <h3 className="text-[22px] font-bold leading-[1.1] text-[#111111] mb-2 font-sans">
                  Playbook
                </h3>
                <p className="text-[13px] leading-[1.3] text-[#333333] font-sans mb-6">
                  The unofficial guide to official Washington, every morning and weekday afternoons.
                </p>
                
                <form className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-[#111111] mb-1 font-sans">EMAIL</label>
                    <input type="email" placeholder="Your Email" className="w-full border-b border-gray-300 pb-2 text-[14px] text-[#111111] placeholder-gray-500 focus:outline-none focus:border-[#d32f2f]" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-[#111111] mb-1 font-sans">EMPLOYER</label>
                    <input type="text" placeholder="Employer" className="w-full border-b border-gray-300 pb-2 text-[14px] text-[#111111] placeholder-gray-500 focus:outline-none focus:border-[#d32f2f]" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-[#111111] mb-1 font-sans">JOB TITLE</label>
                    <input type="text" placeholder="Job Title" className="w-full border-b border-gray-300 pb-2 text-[14px] text-[#111111] placeholder-gray-500 focus:outline-none focus:border-[#d32f2f]" />
                  </div>
                  <button type="submit" className="bg-[#555555] hover:bg-[#333333] text-white text-[11px] font-bold uppercase tracking-widest py-3 px-6 rounded-full transition-colors mt-2">
                    SIGN UP
                  </button>
                </form>
                <p className="text-[8px] text-gray-500 mt-4 font-sans leading-tight">
                  By signing up, you acknowledge and agree to our <a href="#" className="underline">Privacy Policy</a> and <a href="#" className="underline">Terms of Service</a>. You may unsubscribe at any time by following the directions at the bottom of the email or by contacting us here. This site is protected by reCAPTCHA and the Google <a href="#" className="underline">Privacy Policy</a> and <a href="#" className="underline">Terms of Service</a> apply.
                </p>
              </div>
            </div>
          </div>

          {/* ── POLITICO MAGAZINE Carousel ── */}
          <div className="w-full border-t border-b border-gray-200 py-4">
            <MagazineCarousel />
          </div>

          {/* ── MIDDLE FOLD: Below Carousel ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)_320px] gap-6 mt-8 h-full">
            {/* Left Column: COMPANIES + Ads */}
            <div className="flex flex-col space-y-8 h-full">
              <LeftCategorySection category="Companies" />
              
              {/* Sticky Block for Left Column */}
              <div className="flex-1 space-y-6 w-full tall-sticky self-start pt-6 lg:pt-8 border-t border-gray-100 lg:border-t-0 mt-6 lg:mt-0">
                <div className="group cursor-pointer">
                  <a href={`/news/${slugify("Poll: Trump's MAGA voters would stick by a candidate through the most serious of scandals")}`} className="block">
                    <div className="w-full aspect-[4/3] bg-gray-200 mb-2 overflow-hidden">
                      <img src="https://picsum.photos/seed/53/800/600" alt="News" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                    </div>
                    <h3 className="text-[16px] font-bold leading-[1.2] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans mb-1">
                      Poll: Trump&apos;s MAGA voters would stick by a candidate through the most serious of scandals
                    </h3>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mt-2 font-sans">BY ERIN DOHERTY</p>
                  </a>
                </div>
              
                <div className="space-y-6 lg:sticky lg:top-[calc(100vh-620px)] tall-static">
                  {[2, 3].map((i) => (
                  <div key={i} className="w-full max-w-[280px] mx-auto aspect-square bg-[#e5e7eb] flex items-center justify-center relative z-10">
                    <span className="text-[#111111] font-bold text-[32px] tracking-tight">Ad 0{i}</span>
                  </div>
                ))}
                </div>
              </div>
            </div>

            {/* Center Column: DYNAMIC CATEGORIES */}
            <div className="flex flex-col lg:px-6 border-l border-r border-gray-200 h-full">
              <MainCategorySection category="Technology" />
              <MainCategorySection category="Startups" />
              <MainCategorySection category="Economy" />
              <MainCategorySection category="Markets" />
              <MainCategorySection category="Industries" />
              <MainCategorySection category="Finance" />
              <MainCategorySection category="World" />
            </div>

            {/* Right Column: LEADERS, MOST READ, ECONOMY, VIDEO */}
            <div className="flex flex-col space-y-8 h-full">
              {/* LEADERS */}
              <div className="w-full">
                <LeftCategorySection category="Leaders" />
              </div>

              {/* MOST READ */}
              <div className="w-full border-t border-gray-200 pt-6">
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#d9d9d9]">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
                  <h2 className="text-[10px] font-extrabold tracking-[0.12em] text-[#222222] uppercase font-sans">
                    MOST READ
                  </h2>
                </div>
                <a href={`/news/${slugify("Election watchers brace for Trump's next move after Supreme Court ruling")}`}  className="group cursor-pointer mb-6 block border-b border-gray-200 pb-4">
                  <div className="w-full aspect-video bg-gray-200 mb-3 overflow-hidden">
                    <img src="https://picsum.photos/seed/19/800/600" alt="Most Read" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                  </div>
                </a>
                <ul className="space-y-4">
                  <li className="flex gap-4 group cursor-pointer items-start border-b border-gray-100 pb-4">
                    <span className="text-[#d32f2f] font-bold text-[14px] mt-0.5">1</span>
                    <h3 className="text-[15px] font-bold leading-[1.3] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans">
                      Election watchers brace for Trump&apos;s next move after Supreme Court ruling
                    </h3>
                  </li>
                  <li className="flex gap-4 group cursor-pointer items-start border-b border-gray-100 pb-4">
                    <span className="text-[#d32f2f] font-bold text-[14px] mt-0.5">2</span>
                    <h3 className="text-[15px] font-bold leading-[1.3] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans">
                      &apos;That&apos;s not a strong suit&apos;: Trump&apos;s lack of message discipline shows one week post convention
                    </h3>
                  </li>
                  <li className="flex gap-4 group cursor-pointer items-start border-b border-gray-100 pb-4">
                    <span className="text-[#d32f2f] font-bold text-[14px] mt-0.5">3</span>
                    <h3 className="text-[15px] font-bold leading-[1.3] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans">
                      Rebel Democrats again help House GOP advance floor agenda
                    </h3>
                  </li>
                  <li className="flex gap-4 group cursor-pointer items-start border-b border-gray-100 pb-4">
                    <span className="text-[#d32f2f] font-bold text-[14px] mt-0.5">4</span>
                    <h3 className="text-[15px] font-bold leading-[1.3] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans">
                      Trump threatens to impose &apos;serious tariffs&apos; on Europe if Canada joins EU as associate member
                    </h3>
                  </li>
                  <li className="flex gap-4 group cursor-pointer items-start border-b border-gray-100 pb-4">
                    <span className="text-[#d32f2f] font-bold text-[14px] mt-0.5">5</span>
                    <h3 className="text-[15px] font-bold leading-[1.3] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans">
                      Texas Republicans are scrambling after Bo French&apos;s outburst
                    </h3>
                  </li>
                </ul>
              </div>

              {/* ECONOMY */}
              <div className="w-full border-t border-gray-200 pt-6">
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#d9d9d9]">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
                  <h2 className="text-[10px] font-extrabold tracking-[0.12em] text-[#222222] uppercase font-sans">
                    ECONOMY
                  </h2>
                </div>
                <ul className="space-y-4">
                  <li className="pt-4 border-t border-gray-100 first:border-0 first:pt-0">
                    <a href={`/news/${slugify("Hegseth allies campaign to put loyalist in Army secretary job")}`}  className="flex gap-3 group block">
                      <div className="w-[80px] h-[55px] bg-gray-200 shrink-0 overflow-hidden relative">
                         <img src="https://picsum.photos/seed/80/800/600" alt="News" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                      </div>
                      <h3 className="text-[14px] font-bold leading-[1.2] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans mt-1">
                        Hegseth allies campaign to put loyalist in Army secretary job
                      </h3>
                    </a>
                  </li>
                  <li className="pt-4 border-t border-gray-100">
                    <a href={`/news/${slugify("Bernie Sanders Lets Loose on the Democratic Party, the Midterms and 2028")}`}  className="flex gap-3 group block">
                      <div className="w-[80px] h-[55px] bg-gray-200 shrink-0 overflow-hidden relative">
                         <img src="https://picsum.photos/seed/81/800/600" alt="News" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                      </div>
                      <h3 className="text-[14px] font-bold leading-[1.2] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans mt-1">
                        Bernie Sanders Lets Loose on the Democratic Party, the Midterms and 2028
                      </h3>
                    </a>
                  </li>
                  <li className="pt-4 border-t border-gray-100">
                    <a href={`/news/${slugify("The Iranian Regime's Dynamics Are Fooling Trump")}`}  className="flex gap-3 group block">
                      <div className="w-[80px] h-[55px] bg-gray-200 shrink-0 overflow-hidden relative">
                         <img src="https://picsum.photos/seed/82/800/600" alt="News" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                      </div>
                      <h3 className="text-[14px] font-bold leading-[1.2] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans mt-1">
                        The Iranian Regime&apos;s Dynamics Are Fooling Trump
                      </h3>
                    </a>
                  </li>
                  <li className="pt-4 border-t border-gray-100">
                    <a href={`/news/${slugify("Trump's ballroom Tush Push")}`}  className="flex gap-3 group block">
                      <div className="w-[80px] h-[55px] bg-gray-200 shrink-0 overflow-hidden relative">
                         <img src="https://picsum.photos/seed/83/800/600" alt="News" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                      </div>
                      <h3 className="text-[14px] font-bold leading-[1.2] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans mt-1">
                        Trump&apos;s ballroom Tush Push
                      </h3>
                    </a>
                  </li>
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
                <ul className="space-y-4">
                  <li className="pt-4 border-t border-gray-100 first:border-0 first:pt-0">
                    <a href={`/news/${slugify("David Sacks talks AI 'fearmongering', Trump administration's policy approach and more")}`}  className="flex gap-3 group block">
                      <div className="w-[80px] h-[55px] bg-gray-200 shrink-0 overflow-hidden relative">
                         <img src="https://picsum.photos/seed/90/800/600" alt="Video" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                         <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                           <div className="w-6 h-6 rounded-full bg-[#d32f2f] flex items-center justify-center">
                             <div className="w-0 h-0 border-t-[3px] border-l-[5px] border-b-[3px] border-transparent border-l-white ml-0.5"></div>
                           </div>
                         </div>
                      </div>
                      <h3 className="text-[14px] font-bold leading-[1.2] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans mt-1">
                        David Sacks talks AI &apos;fearmongering&apos;, Trump administration&apos;s policy approach and more
                      </h3>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Sticky Block Right */}
              <div className="flex-1 w-full space-y-6 tall-sticky self-start mt-4 lg:mt-6 border-t border-gray-100 lg:border-t-0 pt-4 lg:pt-0">
                <ul className="space-y-4">
                  <li className="group block">
                    <a href={`/news/${slugify("Anthropic's Sarah Heck discusses the AI race, American voters and more")}`}  className="flex gap-3 group block">
                      <div className="w-[80px] h-[55px] bg-gray-200 shrink-0 overflow-hidden relative">
                         <img src="https://picsum.photos/seed/91/800/600" alt="Video" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                         <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                           <div className="w-6 h-6 rounded-full bg-[#d32f2f] flex items-center justify-center">
                             <div className="w-0 h-0 border-t-[3px] border-l-[5px] border-b-[3px] border-transparent border-l-white ml-0.5"></div>
                           </div>
                         </div>
                      </div>
                      <h3 className="text-[14px] font-bold leading-[1.2] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans mt-1">
                        Anthropic&apos;s Sarah Heck discusses the AI race, American voters and more
                      </h3>
                    </a>
                  </li>
                  <li className="pt-4 border-t border-gray-100">
                    <a href={`/news/${slugify("Rep. Greg Casar talks AI reform during Trump Presidency")}`}  className="flex gap-3 group block">
                      <div className="w-[80px] h-[55px] bg-gray-200 shrink-0 overflow-hidden relative">
                         <img src="https://picsum.photos/seed/92/800/600" alt="Video" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                         <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                           <div className="w-6 h-6 rounded-full bg-[#d32f2f] flex items-center justify-center">
                             <div className="w-0 h-0 border-t-[3px] border-l-[5px] border-b-[3px] border-transparent border-l-white ml-0.5"></div>
                           </div>
                         </div>
                      </div>
                      <h3 className="text-[14px] font-bold leading-[1.2] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans mt-1">
                        Rep. Greg Casar talks AI reform during Trump Presidency
                      </h3>
                    </a>
                  </li>
                  <li className="pt-4 border-t border-gray-100">
                    <a href={`/news/${slugify("Hugging Face CEO talks cyberattacks, regulatory enforcement and China")}`}  className="flex gap-3 group block">
                      <div className="w-[80px] h-[55px] bg-gray-200 shrink-0 overflow-hidden relative">
                         <img src="https://picsum.photos/seed/93/800/600" alt="Video" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                         <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                           <div className="w-6 h-6 rounded-full bg-[#d32f2f] flex items-center justify-center">
                             <div className="w-0 h-0 border-t-[3px] border-l-[5px] border-b-[3px] border-transparent border-l-white ml-0.5"></div>
                           </div>
                         </div>
                      </div>
                      <h3 className="text-[14px] font-bold leading-[1.2] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans mt-1">
                        Hugging Face CEO talks cyberattacks, regulatory enforcement and China
                      </h3>
                    </a>
                  </li>
                  <li className="pt-4 border-t border-gray-100">
                    <a href={`/news/${slugify("Gina Raimondo: 'You're not going to beat China if you have destabilizing unemployment'")}`}  className="flex gap-3 group block">
                      <div className="w-[80px] h-[55px] bg-gray-200 shrink-0 overflow-hidden relative">
                         <img src="https://picsum.photos/seed/94/800/600" alt="Video" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                         <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                           <div className="w-6 h-6 rounded-full bg-[#d32f2f] flex items-center justify-center">
                             <div className="w-0 h-0 border-t-[3px] border-l-[5px] border-b-[3px] border-transparent border-l-white ml-0.5"></div>
                           </div>
                         </div>
                      </div>
                      <h3 className="text-[14px] font-bold leading-[1.2] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans mt-1">
                        Gina Raimondo: &apos;You&apos;re not going to beat China if you have destabilizing unemployment&apos;
                      </h3>
                    </a>
                  </li>
                </ul>
                
                <div className="space-y-6 lg:sticky lg:top-[calc(100vh-620px)] tall-static">
                  {[4, 5].map((i) => (
                    <div key={i} className="w-full max-w-[280px] mx-auto aspect-square bg-[#e5e7eb] flex items-center justify-center border border-gray-300 relative z-10">
                      <span className="text-[#111111] font-bold text-[32px] tracking-tight">Ad 0{i}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
}
