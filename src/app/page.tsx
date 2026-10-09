import { slugify } from "@/data/newsArticles";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import LatestNewsList from "@/components/home/LatestNewsList";
import TopNewsGrid from "@/components/home/TopNewsGrid";
import MoreTopHeadlines from "@/components/home/MoreTopHeadlines";
import MoreTopSidebar from "@/components/home/MoreTopSidebar";
import TopSidebarWidgets from "@/components/home/TopSidebarWidgets";
import MagazineCarousel from "@/components/home/MagazineCarousel";
import AdvertisementSlot from "@/components/common/AdvertisementSlot";
import MainCategorySection from "@/components/home/MainCategorySection";
import LeftCategorySection from "@/components/home/LeftCategorySection";
import RightListCategorySection from "@/components/home/RightListCategorySection";
import WorldHomeSection from "@/components/home/WorldHomeSection";
import HomeBottomPanel from "@/components/home/HomeBottomPanel";
import HomeRightPanel from "@/components/home/HomeRightPanel";

import { getArticlesByPlacement } from "@/lib/articleService";

export default async function Home() {
  // Simulate network delay to ensure the loading skeleton is visible
  await new Promise((resolve) => setTimeout(resolve, 800));
  const spotlightArticles = await getArticlesByPlacement("Home - Spotlight", 12);
  
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
              <TopNewsGrid />
              <HomeBottomPanel />

            </div>

            {/* Right: Top Article + 3 Links + Ad1 */}
            <div className="order-3 pt-4 lg:pt-0 lg:mt-0 h-full pb-4 flex flex-col relative lg:pl-4">
              <HomeRightPanel />

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
            <MagazineCarousel articles={spotlightArticles} />
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
              <MainCategorySection category="Leadership Strategies" />
              <MainCategorySection category="Economy" />
              <MainCategorySection category="Markets" />
              <MainCategorySection category="Industries" />
              <MainCategorySection category="Finance" />
              <MainCategorySection category="World" count={12} />
            </div>

            {/* Right Column: LEADERS, MOST READ, ECONOMY, VIDEO */}
            <div className="flex flex-col space-y-8 h-full">
              {/* LEADERS */}
              <div className="w-full">
                <LeftCategorySection category="Leaders" />
              </div>

              {/* MOST READ */}
              <RightListCategorySection category="" isMostRead={true} />
              {/* STARTUPS */}
              <RightListCategorySection category="Startups" />
              {/* VIDEO */}
              <div>
                <RightListCategorySection category="Interview" />
              </div>
              {/* Sticky Block Right */}
              <div className="flex-1 w-full space-y-6 tall-sticky self-start mt-4 lg:mt-6 border-t border-gray-100 lg:border-t-0 pt-4 lg:pt-0">
                <div className="flex items-center gap-2 pb-2 mb-4 border-b border-[#d9d9d9]">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
                  <h2 className="text-[10px] font-extrabold tracking-[0.12em] text-[#222222] uppercase font-sans">
                    VIDEO
                  </h2>
                </div>
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
