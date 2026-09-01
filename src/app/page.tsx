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

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 py-4 space-y-8">

        {/* ── TOP FOLD: Latest News | Top News + More Top Headlines | Podcasts/Newsletters ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 items-start">
          {/* Left: Latest News Sidebar */}
          <div className="lg:col-span-2 xl:col-span-3 pt-4 lg:pt-0 lg:sticky lg:top-4 lg:self-start">
            <LatestNewsList />
          </div>

          {/* Center: Top News + More Top Headlines stacked */}
          <div className="lg:col-span-7 xl:col-span-6 pt-4 lg:pt-0 lg:px-3">
            <TopNewsGrid />
            <div className="mt-8">
              <MoreTopHeadlines />
            </div>
          </div>

          {/* Right: aligned sidebar stack matching the top headline row */}
          <div className="lg:col-span-3 pt-4 lg:pt-0 lg:mt-0 lg:self-start">
            <TopSidebarWidgets />
            <div className="mt-6">
              <MoreTopSidebar />
            </div>
          </div>
        </div>

        {/* ── POLITICO MAGAZINE Carousel ── */}
        <div className="w-full border-t border-b border-gray-200 py-4">
          <MagazineCarousel />
        </div>

        {/* ── CONGRESS Section ── */}
        <div className="w-full border-b border-gray-200 pb-8">
          <CongressSection />
        </div>

        {/* ── WHITE HOUSE Section ── */}
        <div className="w-full border-b border-gray-200 pb-8">
          <WhiteHouseSection />
        </div>

        <div className="w-full border-b border-gray-200 pb-8">
          <LegalSection />
        </div>

        <div className="w-full border-b border-gray-200 pb-8">
          <StatesSection />
        </div>

        <div className="w-full border-b border-gray-200 pb-8">
          <ElectionsSection />
        </div>

        <div className="w-full border-b border-gray-200 pb-8">
          <ForeignAffairsSection />
        </div>

        <div className="w-full pb-2">
          <EarlierSection />
        </div>

      </main>

      <Footer />
    </div>
  );
}
