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

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />

      <div 
        className="w-full flex-1 relative flex flex-col items-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1584308666744-24d5e4a7a8d2?auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center'
        }}
      >
        <main className="flex-1 max-w-[1440px] w-[98%] xl:w-[95%] 2xl:w-[1440px] mx-auto mt-10 lg:mt-24 px-4 lg:px-8 pt-6 lg:pt-8 pb-0 space-y-6 bg-white shadow-2xl">
          {/* ── TOP FOLD: Latest News | Top News + More Top Headlines | Podcasts/Newsletters ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)_320px] gap-4 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 items-start">
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
          <div className="order-3 pt-4 lg:pt-0 lg:mt-0 lg:self-start">
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
        <div className="w-full border-b border-gray-200 pb-4">
          <WhiteHouseSection />
        </div>

        <div className="w-full border-b border-gray-200 pb-8 -mt-4">
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
