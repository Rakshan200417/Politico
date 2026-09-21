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
}: {
  byline: string;
  title?: string;
  slug?: string;
  image?: string;
  deck?: string;
  category?: string;
}) {
  return (
    <div className="mt-2 flex items-center justify-between">
      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#666]">{byline}</p>
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
  return (
    <article className="border-t border-[#e1e1e1] py-4 first:border-t-0 first:pt-0">
      <div className="grid grid-cols-[150px_minmax(0,1fr)] gap-5 sm:grid-cols-[208px_minmax(0,1fr)]">
        <a href={`/news/${slugify(story.title)}`} className="aspect-[4/3] overflow-hidden bg-[#f2f2f2] block">
          <img src={story.image} alt="" className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]" />
        </a>
        <div>
          <a href={`/news/${slugify(story.title)}`} className="block">
            <h3 className="text-[18px] font-bold leading-[1.08] tracking-[-0.02em] text-[#111] hover:text-[#d71920] sm:text-[21px]">
              {story.title}
            </h3>
            <p className="mt-2 font-sans text-[15px] leading-[1.2] text-[#666] sm:text-[17px]">{story.deck}</p>
          </a>
          <StoryMeta
            byline={story.byline}
            title={story.title}
            slug={slugify(story.title)}
            image={story.image}
            deck={story.deck}
          />
        </div>
      </div>
    </article>
  );
}

export default function CategoryPage({ category }: { category: CategoryPageData }) {
  // Combine all stories to simulate a long feed of ~30 articles
  const allMoreStories = [
    ...category.moreStories,
    ...category.sideStories,
    ...category.moreStories,
    ...category.sideStories,
    ...category.moreStories,
    ...category.sideStories,
  ];

  return (
    <main className="mx-auto w-full max-w-[1080px] px-4 pb-16 font-sans sm:px-6">
      
      {/* Top Banner Advertisement */}
      <div className="pt-6 pb-6 border-b border-[#ededed] mb-8">
        <div className="flex justify-center items-center h-[90px] lg:h-[120px]">
          <AdvertisementSlot variant="banner" />
        </div>
      </div>

      {/* Lead Section (Image 1 match) */}
      <section className="grid gap-8 pt-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(300px,1fr)] mb-12">
        <article>
          <a href={`/news/${slugify(category.lead.title)}`} className="block group">
            <h2 className="max-w-[740px] text-[32px] font-sans font-bold leading-[1.1] tracking-[-0.03em] text-[#111] group-hover:text-[#d71920] sm:text-[42px]">
              {category.lead.title}
            </h2>
            <p className="mt-3 max-w-[740px] font-sans text-[18px] leading-[1.4] text-[#555] sm:text-[20px]">{category.lead.deck}</p>
            <div className="mt-1 mb-5">
              <StoryMeta
                byline={category.lead.byline}
                title={category.lead.title}
                slug={slugify(category.lead.title)}
                image={category.lead.image}
                deck={category.lead.deck}
                category={category.name}
              />
            </div>
            <div className="aspect-[3/2] overflow-hidden bg-[#f2f2f2]">
              <img src={category.lead.image} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
            </div>
          </a>
        </article>

        <aside className="flex flex-col gap-6 lg:border-l border-[#e1e1e1] lg:pl-6">
          {category.sideStories.map((story) => (
            <article key={story.title} className="border-b border-[#e1e1e1] pb-6 last:border-0 last:pb-0">
              <a href={`/news/${slugify(story.title)}`} className="flex flex-col gap-3 group">
                <div className="aspect-[3/2] overflow-hidden bg-[#f2f2f2]">
                  <img src={story.image} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
                </div>
                <div>
                  <h3 className="text-[18px] font-sans font-bold leading-[1.2] text-[#111] group-hover:text-[#d71920] sm:text-[20px]">{story.title}</h3>
                  <div className="mt-1">
                    <StoryMeta
                      byline={story.byline}
                      title={story.title}
                      slug={slugify(story.title)}
                      image={story.image}
                      category={category.name}
                    />
                  </div>
                </div>
              </a>
            </article>
          ))}
        </aside>
      </section>

      {/* Middle Banner Advertisement */}
      <div className="py-6 border-t border-[#ededed] mb-8">
        <div className="flex justify-center items-center h-[90px] lg:h-[120px]">
          <AdvertisementSlot variant="banner" />
        </div>
      </div>

      {/* Thematic Section 1: Trade War */}
      <section className="mb-12">
        <h2 className="text-[32px] font-serif font-bold tracking-[-0.02em] text-[#111] border-b border-[#111] pb-4 mb-6">
          U.S.-Canada Trade War
        </h2>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.8fr)_minmax(300px,1fr)]">
           <article>
             <a href={`/news/${slugify(category.moreStories[0]?.title || "Trade War")}`} className="block group">
               <div className="aspect-[16/9] overflow-hidden bg-[#f2f2f2] mb-5">
                 <img src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80" alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
               </div>
               <h3 className="text-[26px] font-serif font-bold leading-[1.1] text-[#111] group-hover:text-[#d71920] sm:text-[32px]">
                 'We are going in the wrong direction': Republican convention dogged by the cost of living
               </h3>
               <StoryMeta byline="BY SUE ALLAN" title="Trade War" />
             </a>
           </article>
           <aside className="flex flex-col gap-6 lg:border-l border-[#e1e1e1] lg:pl-6">
             {category.moreStories.slice(0, 3).map((story, i) => (
                <article key={i} className="border-b border-[#e1e1e1] pb-6 last:border-0 last:pb-0">
                  <a href={`/news/${slugify(story.title)}`} className="grid grid-cols-[100px_minmax(0,1fr)] gap-4 group">
                    <div className="aspect-[4/3] overflow-hidden bg-[#f2f2f2]">
                      <img src={story.image} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-[16px] font-serif font-bold leading-[1.15] text-[#111] group-hover:text-[#d71920]">{story.title}</h4>
                      <div className="mt-1">
                        <StoryMeta byline={story.byline} />
                      </div>
                    </div>
                  </a>
                </article>
             ))}
           </aside>
        </div>
      </section>

      {/* Thematic Section 2: Elections & Politics */}
      <section className="mb-12">
        <h2 className="text-[32px] font-serif font-bold tracking-[-0.02em] text-[#111] border-b border-[#111] pb-4 mb-6">
          {category.name} Elections & Politics
        </h2>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.8fr)_minmax(300px,1fr)]">
           <article>
             <a href={`/news/${slugify(category.moreStories[1]?.title || "Elections")}`} className="block group">
               <div className="aspect-[16/9] overflow-hidden bg-[#f2f2f2] mb-5">
                 <img src="https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=800&q=80" alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
               </div>
               <h3 className="text-[26px] font-serif font-bold leading-[1.1] text-[#111] group-hover:text-[#d71920] sm:text-[32px]">
                 'Very Hard to See How This Ends'
               </h3>
               <p className="mt-2 text-[16px] text-[#555]">Where the U.S.-Canada trade war goes next, according to POLITICO's reporters.</p>
               <StoryMeta byline="BY SUE ALLAN" title="Elections" />
             </a>
           </article>
           <aside className="flex flex-col gap-6 lg:border-l border-[#e1e1e1] lg:pl-6">
             {category.moreStories.slice(1, 3).map((story, i) => (
                <article key={i} className="border-b border-[#e1e1e1] pb-6 last:border-0 last:pb-0">
                  <a href={`/news/${slugify(story.title)}`} className="grid grid-cols-[100px_minmax(0,1fr)] gap-4 group">
                    <div className="aspect-[4/3] overflow-hidden bg-[#f2f2f2]">
                      <img src={story.image} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-[16px] font-serif font-bold leading-[1.15] text-[#111] group-hover:text-[#d71920]">{story.title}</h4>
                      <div className="mt-1">
                        <StoryMeta byline={story.byline} />
                      </div>
                    </div>
                  </a>
                </article>
             ))}
             {/* POLITICOPRO Box */}
             <div className="bg-[#f9f9f9] p-5 border-t border-[#e1e1e1] mt-2">
                <div className="text-[14px] font-black text-[#d71920] mb-2 tracking-wide">POLITICOPRO</div>
                <p className="text-[13px] text-[#555] leading-[1.4] mb-2">Exclusive news, intelligence and tools for professionals on the front lines of policy.</p>
                <a href="#" className="text-[13px] font-bold text-[#111] hover:underline">Learn more »</a>
             </div>
           </aside>
        </div>
      </section>

      {/* Thematic Section 3: Magazine */}
      <section className="mb-12">
        <h2 className="text-[32px] font-serif font-bold tracking-[-0.02em] text-[#111] border-b border-[#111] pb-4 mb-6">
          Magazine
        </h2>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.8fr)_minmax(300px,1fr)]">
           <article>
             <a href={`/news/${slugify(category.moreStories[2]?.title || "Magazine")}`} className="block group">
               <div className="aspect-[16/9] overflow-hidden bg-[#f2f2f2] mb-5">
                 <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80" alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
               </div>
               <h3 className="text-[26px] font-serif font-bold leading-[1.1] text-[#111] group-hover:text-[#d71920] sm:text-[32px]">
                 Is Danielle Smith About to Break Up Canada?
               </h3>
               <p className="mt-2 text-[16px] text-[#555]">The Alberta premier called a referendum that could begin the process of secession from Canada. Will she regret it?</p>
               <StoryMeta byline="BY CATHERINE KIM" title="Magazine" />
             </a>
           </article>
           <aside className="flex flex-col gap-6 lg:border-l border-[#e1e1e1] lg:pl-6">
             {category.moreStories.slice(2, 5).map((story, i) => (
                <article key={i} className="border-b border-[#e1e1e1] pb-6 last:border-0 last:pb-0">
                  <a href={`/news/${slugify(story.title)}`} className="grid grid-cols-[100px_minmax(0,1fr)] gap-4 group">
                    <div className="aspect-[4/3] overflow-hidden bg-[#f2f2f2]">
                      <img src={story.image} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-[16px] font-serif font-bold leading-[1.15] text-[#111] group-hover:text-[#d71920]">{story.title}</h4>
                      <div className="mt-1">
                        <StoryMeta byline={story.byline} />
                      </div>
                    </div>
                  </a>
                </article>
             ))}
           </aside>
        </div>
      </section>

      {/* More Coverage Section */}
      <section className="mt-12 border-t-[3px] border-[#111] pt-6">
        <div className="mb-6 pb-2">
          <h2 className="text-[14px] font-bold uppercase tracking-[0.1em] text-[#111]">More of Politico's Coverage of {category.name} Politics and Policy</h2>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
          {/* Left Column: Long Feed of Stories */}
          <div className="flex flex-col gap-6">
            {allMoreStories.map((story, idx) => (
              <StoryRow key={`${story.title}-${idx}`} story={story} />
            ))}
          </div>

          {/* Right Column: Sticky Advertisement */}
          <aside className="hidden lg:block lg:border-l border-[#e1e1e1] lg:pl-6">
            <div className="sticky top-[120px] self-start">
              <div className="bg-[#f4f4f4] h-[600px] w-full flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                 <p className="text-[10px] uppercase tracking-wider font-bold mb-4">Advertisement</p>
                 <AdvertisementSlot variant="sidebar" />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
