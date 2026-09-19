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
        className="w-full flex-1 relative flex flex-col items-center bg-[#f3f4f6]"
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
          {/* ── TOP FOLD: Latest News | Top News + More Top Headlines | Podcasts/Newsletters ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)_320px] gap-4 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
          {/* Left: Latest News Sidebar */}
          <div className="order-2 lg:order-1 pt-4 lg:pt-0 lg:sticky lg:top-4 lg:self-start">
            <LatestNewsList />
          </div>

          {/* Center: Top News + More Top Headlines stacked */}
          <div className="order-1 lg:order-2 pt-4 lg:pt-0 lg:px-3">
            <TopNewsGrid />
            <div className="mt-8">
              <MoreTopHeadlines />
            </div>
          </div>

          {/* Right: aligned sidebar stack matching the top headline row */}
          <div className="order-3 pt-4 lg:pt-0 lg:mt-0 h-full pb-4 flex flex-col relative">
            {/* 2 Small News Items */}
            <div className="mb-6 space-y-6">
              <article className="group cursor-pointer">
                <a href="/news/trump-bans-media" className="block">
                  <div className="overflow-hidden bg-gray-200 mb-2 aspect-video">
                    <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80" alt="Trump" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                  </div>
                  <h3 className="text-[17px] font-bold leading-[1.1] tracking-[-0.02em] text-[#111111] group-hover:text-[#d32f2f] transition-colors mb-1 font-sans">
                    Trump says he&apos;s banning media outlets, including POLITICO, from White House
                  </h3>
                  <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#6b6b6b] font-sans mt-2">
                    BY GREGORY SVIRNOVSKIY
                  </p>
                </a>
              </article>
              <article className="group cursor-pointer">
                <a href="/news/us-denmark-greenland" className="block">
                  <div className="overflow-hidden bg-gray-200 mb-2 aspect-video">
                    <img src="https://images.unsplash.com/photo-1517400508447-f8dd518b86db?auto=format&fit=crop&w=600&q=80" alt="Greenland" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                  </div>
                  <h3 className="text-[17px] font-bold leading-[1.1] tracking-[-0.02em] text-[#111111] group-hover:text-[#d32f2f] transition-colors mb-1 font-sans">
                    US and Denmark reach new agreement on defense and investment in Greenland
                  </h3>
                  <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#6b6b6b] font-sans mt-2">
                    BY PAUL MCLEARY
                  </p>
                </a>
              </article>
            </div>

            {/* Sticky Ad */}
            <div className="lg:sticky lg:top-[120px] lg:self-start w-full text-center">
              <span className="block text-[11px] font-sans font-normal text-gray-400 uppercase tracking-widest mb-3">
                Advertisement
              </span>
              <div className="bg-[#f2f2f2] border border-[#e0e0e0] p-8 pb-10 flex flex-col items-center">
                <div className="flex flex-col items-center justify-center mb-6">
                  <span className="text-[#d71920] font-black text-[32px] tracking-tighter leading-none mb-1">POLITICO</span>
                  <span className="text-[22px] font-serif font-black text-gray-900 leading-none italic">
                    California Currents
                  </span>
                </div>
                <h4 className="text-[17px] font-serif text-gray-800 text-center leading-snug mb-8 px-2">
                  How the politics of energy, the environment and transportation are shaping California&apos;s future
                </h4>
                <button className="bg-[#12b07e] hover:bg-[#0f9268] text-white font-extrabold text-[14px] uppercase tracking-widest py-3.5 px-8 rounded-full transition-colors w-full sm:w-auto">
                  SUBSCRIBE NOW
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── POLITICO MAGAZINE Carousel ── */}
        <div className="w-full border-t border-b border-gray-200 py-4">
          <MagazineCarousel />
        </div>

        {/* ── Advertisement Space 1 matching Image 3 ── */}
        <AdvertisementSlot variant="in-article" />

        {/* ── CONGRESS Section ── */}
        <div className="w-full border-b border-gray-200 pb-8">
          <CongressSection />
        </div>

        {/* ── WHITE HOUSE Section ── */}
        <div className="w-full border-b border-gray-200 pb-4">
          <WhiteHouseSection />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full border-b border-gray-200 pb-8 -mt-4">
          <div className="lg:col-span-9 flex flex-col">
            <LegalSection />
            <div className="w-full border-b border-gray-200 pb-8 mt-4">
              <StatesSection />
            </div>
            <div className="w-full pt-8">
              <ElectionsSection />
            </div>
          </div>
          
          <div className="lg:col-span-3 hidden lg:block h-full relative border-l border-gray-200 pl-6 pt-12">
            <div className="w-full flex flex-col items-center lg:sticky lg:top-[120px] lg:self-start">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-sans">
                Advertisement
              </span>
              <div className="w-[300px] h-[600px] bg-gray-100 flex items-center justify-center relative border border-gray-200">
                <img
                  src="https://loremflickr.com/300/600/medicine"
                  alt="Advertisement"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-blue-900 bg-opacity-70 flex flex-col items-center justify-center p-6 text-center text-white font-sans">
                  <h3 className="text-2xl font-bold mb-4">GOP voters want candidates who will lower drug prices for Americans.</h3>
                  <div className="w-16 h-1 bg-red-500 mb-4"></div>
                  <button className="bg-red-500 text-white font-bold py-2 px-4 text-xs uppercase tracking-wider hover:bg-red-600 transition-colors">
                    Codify Most Favored Nation
                  </button>
                  <p className="mt-8 text-sm font-bold tracking-widest uppercase">
                    Pharmaceutical Reform Alliance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Advertisement Space 2 matching Image 3 ── */}
        <AdvertisementSlot variant="banner" />

        <div className="w-full border-b border-gray-200 pb-8">
          <ForeignAffairsSection />
        </div>

        <div className="w-full border-b border-gray-200 pb-8">
          <ThreeColumnSection />
        </div>

        <div className="w-full pb-0">
          <EarlierSection />
        </div>

      </main>
      </div>

      <Footer />
    </div>
  );
}
