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
    <div className="mt-2 flex items-center justify-between gap-2">
      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#666] truncate">{byline}</p>
      <div className="shrink-0">
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
    </div>
  );
}

function StoryRow({ story }: { story: CategoryStory }) {
  const storySlug = story.slug || slugify(story.title);
  return (
    <article className="border-t border-[#e1e1e1] py-4 first:border-t-0 first:pt-0 overflow-hidden">
      <div className="grid grid-cols-[150px_minmax(0,1fr)] gap-5 sm:grid-cols-[208px_minmax(0,1fr)]">
        <a href={`/news/${storySlug}`} className="aspect-[4/3] w-full overflow-hidden bg-[#f2f2f2] block shrink-0">
          <img src={story.image} alt="" className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]" />
        </a>
        <div className="min-w-0 overflow-hidden">
          <a href={`/news/${storySlug}`} className="block">
            <h3 className="text-[18px] font-bold leading-[1.15] tracking-[-0.02em] text-[#111] hover:text-[#d71920] sm:text-[21px] break-words [overflow-wrap:anywhere]">
              {story.title}
            </h3>
            {story.deck && (
              <p className="mt-2 font-sans text-[15px] leading-[1.3] text-[#666] sm:text-[17px] break-words [overflow-wrap:anywhere]">
                {story.deck}
              </p>
            )}
          </a>
          <StoryMeta
            byline={story.byline}
            title={story.title}
            slug={storySlug}
            image={story.image}
            deck={story.deck}
          />
        </div>
      </div>
    </article>
  );
}

export default function CategoryPage({ category }: { category: CategoryPageData }) {
  const leadSlug = category.lead?.slug || slugify(category.lead?.title || "");

  return (
    <main className="mx-auto w-full max-w-[1080px] px-4 pb-16 font-sans sm:px-6 overflow-x-hidden">
      {/* Top Banner Box */}
      <div className="flex h-[150px] items-center justify-center border-b border-[#ededed] sm:h-[180px]">
        <div className="w-full max-w-[650px] bg-[#f2f2f2] px-5 py-4 text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#d71920]">POLITICO</span>
          <p className="mt-1 text-[15px] font-bold text-[#222] sm:text-[18px]">Your first read on {category.name} politics and policy</p>
          <button className="mt-2 rounded-full bg-[#d71920] px-5 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white">Subscribe now</button>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-[#e3e3e3] py-7 text-center sm:py-8">
        <h1 className="text-[42px] font-normal tracking-[-0.04em] text-[#111] sm:text-[52px]">{category.name}</h1>
        {category.description && (
          <p className="mx-auto mt-3 max-w-[760px] text-[14px] leading-[1.35] text-[#111] sm:text-[16px]">{category.description}</p>
        )}
      </header>

      {/* Lead Section: 1 Lead + Side Stories (Max 2 side stories to equal 3 top stories) */}
      <section className="grid gap-7 pt-8 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] overflow-hidden">
        {category.lead && (
          <article className="min-w-0 overflow-hidden">
            <a href={`/news/${leadSlug}`} className="block group">
              <h2 className="max-w-[700px] text-[31px] font-bold leading-[1.08] tracking-[-0.03em] text-[#111] group-hover:text-[#d71920] sm:text-[40px] break-words [overflow-wrap:anywhere]">
                {category.lead.title}
              </h2>
              {category.lead.deck && (
                <p className="mt-3 max-w-[700px] font-sans text-[17px] leading-[1.3] text-[#666] sm:text-[19px] break-words [overflow-wrap:anywhere]">
                  {category.lead.deck}
                </p>
              )}
              <div className="mt-2 mb-4">
                <StoryMeta
                  byline={category.lead.byline}
                  title={category.lead.title}
                  slug={leadSlug}
                  image={category.lead.image}
                  deck={category.lead.deck}
                  category={category.name}
                />
              </div>
              <div className="aspect-[16/9] w-full overflow-hidden bg-[#f2f2f2]">
                <img
                  src={category.lead.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
            </a>
          </article>
        )}

        <aside className="border-t border-[#e1e1e1] pt-6 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0 min-w-0 overflow-hidden">
          {category.sideStories && category.sideStories.map((story, i) => {
            const storySlug = story.slug || slugify(story.title);
            return (
              <article key={`${story.title}-${i}`} className="border-b border-[#e1e1e1] pb-5 pt-5 first:pt-0 overflow-hidden">
                <a href={`/news/${storySlug}`} className="grid grid-cols-[125px_minmax(0,1fr)] gap-4 sm:grid-cols-1 group">
                  <div className="aspect-[4/3] w-full overflow-hidden bg-[#f2f2f2]">
                    <img src={story.image} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
                  </div>
                  <div className="min-w-0 overflow-hidden">
                    <h3 className="mt-0 text-[17px] font-bold leading-[1.15] tracking-[-0.02em] text-[#111] group-hover:text-[#d71920] sm:mt-3 sm:text-[20px] break-words [overflow-wrap:anywhere]">
                      {story.title}
                    </h3>
                    <StoryMeta
                      byline={story.byline}
                      title={story.title}
                      slug={storySlug}
                      image={story.image}
                      category={category.name}
                    />
                  </div>
                </a>
              </article>
            );
          })}

          {/* Sidebar Advertisement Space */}
          <div className="mt-4">
            <AdvertisementSlot variant="sidebar" />
          </div>

          <div className="mt-7 border-t border-[#e1e1e1] pt-5">
            <h3 className="text-[20px] font-normal text-[#111]">Inside {category.name}</h3>
            <p className="mt-1 text-[14px] text-[#222]">Your first read on the latest news and analysis.</p>
            <a href="#" className="mt-2 inline-block text-[11px] font-bold text-[#d71920]">Sign Up &nbsp;|&nbsp; Read today's edition</a>
          </div>
        </aside>
      </section>

      {/* In-page Advertisement Space */}
      <div className="my-8">
        <AdvertisementSlot variant="in-article" />
      </div>

      {/* More News Section */}
      <section className="mt-8 border-t border-[#e1e1e1] pt-8">
        <div className="mb-4 flex items-center gap-2 border-b border-[#d9d9d9] pb-2">
          <span className="h-2 w-2 rounded-full border border-[#d71920]" />
          <h2 className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#222]">More {category.name} news</h2>
        </div>
        <div className="max-w-[760px]">
          {category.moreStories && category.moreStories.length > 0 ? (
            category.moreStories.map((story, i) => <StoryRow key={`${story.title}-${i}`} story={story} />)
          ) : (
            <p className="text-sm text-gray-500 py-4">No additional articles in this category.</p>
          )}

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
