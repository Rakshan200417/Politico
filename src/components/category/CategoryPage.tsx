import type { CategoryPageData, CategoryStory } from "./categoryData";
import { slugify } from "@/data/newsArticles";
import SaveShareButtons from "@/components/common/SaveShareButtons";
import AdvertisementSlot from "@/components/common/AdvertisementSlot";

function StoryMeta({
  byline,
  title,
  slug,
  image,
  deck,
  category,
  date,
}: {
  byline: string;
  title?: string;
  slug?: string;
  image?: string;
  deck?: string;
  category?: string;
  date?: string;
}) {
  return (
    <div className="mt-2 flex items-center justify-between">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#666]">
        BY {byline} {date && <span className="mx-1">|</span>} {date}
      </p>
      <SaveShareButtons
        title={title}
        slug={slug}
        image={image}
        deck={deck}
        category={category}
        byline={byline}
        size="sm"
      />
    </div>
  );
}

function StoryRow({ story }: { story: CategoryStory }) {
  const storySlug = story.slug || slugify(story.title);
  return (
    <article className="border-t border-[#e1e1e1] py-6 first:border-t-0 first:pt-0">
      <div className="grid grid-cols-[180px_minmax(0,1fr)] gap-6 sm:grid-cols-[240px_minmax(0,1fr)]">
        <a href={`/news/${storySlug}`} className="aspect-[4/3] overflow-hidden bg-[#f2f2f2] block">
          <img src={story.image} alt="" className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]" />
        </a>
        <div>
          <a href={`/news/${storySlug}`} className="block">
            <h3 className="text-[18px] font-serif font-bold leading-[1.1] text-[#111] hover:text-[#d71920] sm:text-[22px]">
              {story.title}
            </h3>
            <p className="mt-2 font-sans text-[15px] leading-[1.3] text-[#555] sm:text-[16px]">{story.deck}</p>
          </a>
          <StoryMeta
            byline={story.byline}
            title={story.title}
            slug={storySlug}
            image={story.image}
            deck={story.deck}
            date={story.date}
          />
        </div>
      </div>
    </article>
  );
}

export default function CategoryPage({ category }: { category: CategoryPageData }) {
  const allMoreStories = category.moreStories;

  return (
    <main className="mx-auto w-full max-w-[1080px] px-4 pb-16 font-sans sm:px-6">
      
      {/* Top Banner Advertisement */}
      <div className="pt-6 pb-6 border-b border-[#ededed] mb-8">
        <div className="flex justify-center items-center h-[90px] lg:h-[120px]">
          <AdvertisementSlot variant="banner" />
        </div>
      </div>

      {/* Category Header */}
      <div className="text-center mb-10 pb-8 border-b border-[#ededed]">
        <h1 className="text-[32px] font-sans text-[#111] sm:text-[44px] mb-3 font-medium">
          {category.name}
        </h1>
        {category.description && (
          <p className="font-sans text-[15px] sm:text-[16px] font-bold text-[#333] max-w-3xl mx-auto">
            {category.description}
          </p>
        )}
      </div>

      {/* Lead Section (Image 1 match) */}
      <section className="grid gap-8 pt-2 lg:grid-cols-[5fr_4fr] lg:gap-12 mb-10 pb-10 border-b border-[#ededed]">
        {/* Left: Lead Article */}
        <article>
          <a href={`/news/${category.lead.slug || slugify(category.lead.title)}`} className="block group">
            <h2 className="text-[34px] font-sans font-bold leading-[1.05] tracking-[-0.01em] text-[#111] group-hover:text-[#d71920] sm:text-[42px]">
              {category.lead.title}
            </h2>
            <p className="mt-4 font-serif text-[18px] leading-[1.4] text-[#555] sm:text-[20px]">{category.lead.deck}</p>
            <div className="mt-3 mb-6">
              <StoryMeta
                byline={category.lead.byline}
                title={category.lead.title}
                slug={category.lead.slug || slugify(category.lead.title)}
                image={category.lead.image}
                deck={category.lead.deck}
                category={category.name}
                date={category.lead.date}
              />
            </div>
            <div className="aspect-[4/3] sm:aspect-[16/9] w-full overflow-hidden bg-[#f2f2f2]">
              <img src={category.lead.image} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
            </div>
          </a>
        </article>

        {/* Right: Side Stories */}
        <aside className="flex flex-col gap-8 lg:pl-2 lg:pt-[130px]">
          {category.sideStories.slice(0, 2).map((story, i) => (
            <article key={i} className="border-b border-[#e1e1e1] pb-8 last:border-0 last:pb-0">
              <a href={`/news/${story.slug || slugify(story.title)}`} className="grid grid-cols-[48%_minmax(0,1fr)] gap-6 group">
                <div className="aspect-[3/2] overflow-hidden bg-[#f2f2f2]">
                  <img src={story.image} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
                </div>
                <div>
                  <h3 className="text-[20px] font-sans font-bold leading-[1.1] text-[#111] group-hover:text-[#d71920] sm:text-[24px]">
                    {story.title}
                  </h3>
                  <div className="mt-3">
                    <StoryMeta
                      byline={story.byline}
                      title={story.title}
                      slug={story.slug || slugify(story.title)}
                      image={story.image}
                      category={category.name}
                      date={story.date}
                    />
                  </div>
                </div>
              </a>
            </article>
          ))}
        </aside>
      </section>

      {/* Middle Newsletters & Survey Ad (Image 2 match) */}
      <section className="mb-12">
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="pr-4 md:border-r border-[#e1e1e1]">
            <h3 className="text-[20px] font-sans text-[#111] mb-2 font-medium">Global Security</h3>
            <p className="text-[14px] text-[#444] mb-3 leading-snug">
              This POLITICO Pro newsletter preview explores the people, policies and power shifts shaping today's international security landscape.
            </p>
            <p className="text-[12px] font-bold text-[#d71920]">
              Sign up for the preview <span className="text-gray-400 font-normal mx-1">|</span> <span className="text-[#111] font-normal hover:underline cursor-pointer">Read the latest edition</span>
            </p>
          </div>
          <div className="pl-0 md:pl-4">
            <h3 className="text-[20px] font-sans text-[#111] mb-2 font-medium">National Security Daily</h3>
            <p className="text-[14px] text-[#444] mb-3 leading-snug">
              From the SitRoom to the E-Ring, the inside scoop on defense, national security and foreign policy.
            </p>
            <p className="text-[12px] font-bold text-[#d71920]">
              Sign up <span className="text-gray-400 font-normal mx-1">|</span> <span className="text-[#111] font-normal hover:underline cursor-pointer">Read today's edition</span>
            </p>
          </div>
        </div>

        {/* Survey Ad */}
        <div className="w-full flex flex-col items-center">
          <p className="text-[10px] text-gray-500 mb-2">Advertisement</p>
          <div className="w-full max-w-[800px] bg-[#f5f5f5] p-8 text-center flex flex-col items-center justify-center">
            <p className="text-[11px] font-bold text-[#457b9d] tracking-wider uppercase mb-6">Sponsored Survey | Question 1/3</p>
            <p className="text-[16px] font-sans text-[#111] font-medium mb-8 max-w-[500px]">
              In the past month, have you seen or heard messaging around <span className="font-bold">long-acting injectable treatments (LAIs)</span> for <span className="font-bold">opioid use disorder?</span>
            </p>
            <div className="flex gap-4 w-full max-w-[600px]">
              <button className="flex-1 bg-[#e0e0e0] hover:bg-[#d5d5d5] text-[#111] font-medium py-3 rounded text-[15px] transition">Yes</button>
              <button className="flex-1 bg-[#e0e0e0] hover:bg-[#d5d5d5] text-[#111] font-medium py-3 rounded text-[15px] transition">No</button>
              <button className="flex-1 bg-[#e0e0e0] hover:bg-[#d5d5d5] text-[#111] font-medium py-3 rounded text-[15px] transition">Not sure</button>
            </div>
          </div>
        </div>
      </section>

      {/* More Coverage Section (Image 3 match) */}
      <section className="mt-16">
        <div className="mb-6 pb-2 border-b-2 border-[#111]">
          <h2 className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#111]">More of Politico's Coverage of {category.name}</h2>
        </div>
        
        <div className="flex flex-col">
          {allMoreStories.slice(0, 15).map((story, idx) => (
            <StoryRow key={`${story.title}-${idx}`} story={story} />
          ))}

          {category.totalPages && category.totalPages > 1 && (
            <div className="mt-12 pt-8 flex items-center justify-center gap-1.5 sm:gap-2">
              <a 
                href={category.currentPage && category.currentPage > 1 ? `?page=${category.currentPage - 1}` : '#'}
                className={`px-3 sm:px-4 py-2 text-[11px] font-bold tracking-wider rounded border transition-colors ${
                  category.currentPage && category.currentPage > 1 
                    ? "text-[#111] border-gray-300 hover:bg-gray-50 cursor-pointer" 
                    : "text-gray-400 border-gray-200 cursor-not-allowed"
                }`}
              >
                PREV
              </a>
              
              {Array.from({ length: Math.min(5, category.totalPages) }, (_, i) => {
                const pageNum = i + 1;
                const isCurrent = pageNum === (category.currentPage || 1);
                return (
                  <a 
                    key={pageNum}
                    href={`?page=${pageNum}`}
                    className={`w-8 h-8 flex items-center justify-center text-[12px] font-bold rounded transition-colors ${
                      isCurrent 
                        ? "bg-[#820000] text-white" 
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </a>
                );
              })}
              
              {category.totalPages > 5 && <span className="text-gray-400 px-1">...</span>}
              
              <a 
                href={category.currentPage && category.currentPage < category.totalPages ? `?page=${category.currentPage + 1}` : '#'}
                className={`px-3 sm:px-4 py-2 text-[11px] font-bold tracking-wider rounded border transition-colors ${
                  category.currentPage && category.currentPage < category.totalPages 
                    ? "text-[#111] border-gray-300 hover:bg-gray-50 cursor-pointer" 
                    : "text-gray-400 border-gray-200 cursor-not-allowed"
                }`}
              >
                NEXT
              </a>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
