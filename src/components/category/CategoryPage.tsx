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
            <p className="mt-2 font-serif text-[15px] leading-[1.2] text-[#666] sm:text-[17px]">{story.deck}</p>
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
  return (
    <main className="mx-auto w-full max-w-[1080px] px-4 pb-16 font-sans sm:px-6">
      <div className="flex h-[150px] items-center justify-center border-b border-[#ededed] sm:h-[180px]">
        <div className="w-full max-w-[650px] bg-[#f2f2f2] px-5 py-4 text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#d71920]">POLITICO</span>
          <p className="mt-1 text-[15px] font-bold text-[#222] sm:text-[18px]">Your first read on {category.name} politics and policy</p>
          <button className="mt-2 rounded-full bg-[#d71920] px-5 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white">Subscribe now</button>
        </div>
      </div>

      <header className="border-b border-[#e3e3e3] py-7 text-center sm:py-8">
        <h1 className="text-[42px] font-normal tracking-[-0.04em] text-[#111] sm:text-[52px]">{category.name}</h1>
        <p className="mx-auto mt-3 max-w-[760px] text-[14px] leading-[1.35] text-[#111] sm:text-[16px]">{category.description}</p>
      </header>

      <section className="grid gap-7 pt-8 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
        <article>
          <a href={`/news/${slugify(category.lead.title)}`} className="block">
            <h2 className="max-w-[700px] text-[31px] font-bold leading-[1.02] tracking-[-0.03em] text-[#111] hover:text-[#d71920] sm:text-[40px]">
              {category.lead.title}
            </h2>
            <p className="mt-3 max-w-[700px] font-serif text-[17px] leading-[1.25] text-[#666] sm:text-[19px]">{category.lead.deck}</p>
            <StoryMeta
              byline={category.lead.byline}
              title={category.lead.title}
              slug={slugify(category.lead.title)}
              image={category.lead.image}
              deck={category.lead.deck}
              category={category.name}
            />
            <div className="mt-4 aspect-[16/9] overflow-hidden bg-[#f2f2f2]">
              <img src={category.lead.image} alt="" className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]" />
            </div>
          </a>
        </article>

        <aside className="border-l border-[#e1e1e1] pl-0 lg:pl-6">
          {category.sideStories.map((story) => (
            <article key={story.title} className="border-b border-[#e1e1e1] pb-5 pt-5 first:pt-0">
              <a href={`/news/${slugify(story.title)}`} className="grid grid-cols-[125px_minmax(0,1fr)] gap-4 sm:grid-cols-1">
                <div className="aspect-[4/3] overflow-hidden bg-[#f2f2f2]">
                  <img src={story.image} alt="" className="h-full w-full object-cover" />
                </div>
                <div>
                  <h3 className="mt-0 text-[17px] font-bold leading-[1.08] tracking-[-0.02em] text-[#111] hover:text-[#d71920] sm:mt-3 sm:text-[20px]">{story.title}</h3>
                  <StoryMeta
                    byline={story.byline}
                    title={story.title}
                    slug={slugify(story.title)}
                    image={story.image}
                    category={category.name}
                  />
                </div>
              </a>
            </article>
          ))}

          {/* Sidebar Advertisement Space */}
          <AdvertisementSlot variant="sidebar" />

          <div className="mt-7 border-t border-[#e1e1e1] pt-5">
            <h3 className="text-[20px] font-normal text-[#111]">Inside {category.name}</h3>
            <p className="mt-1 text-[14px] text-[#222]">Your first read on the latest news and analysis.</p>
            <a href="#" className="mt-2 inline-block text-[11px] font-bold text-[#d71920]">Sign Up &nbsp;|&nbsp; Read today's edition</a>
          </div>
        </aside>
      </section>

      {/* In-page Advertisement Space matching Image 3 */}
      <AdvertisementSlot variant="in-article" />

      <section className="mt-8 border-t border-[#e1e1e1] pt-8">
        <div className="mb-4 flex items-center gap-2 border-b border-[#d9d9d9] pb-2">
          <span className="h-2 w-2 rounded-full border border-[#d71920]" />
          <h2 className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#222]">More {category.name} news</h2>
        </div>
        <div className="max-w-[760px]">
          {category.moreStories.map((story) => <StoryRow key={story.title} story={story} />)}
        </div>
      </section>
    </main>
  );
}
