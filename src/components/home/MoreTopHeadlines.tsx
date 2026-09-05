import React from "react";

const secondaryStories = [
  {
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    title: "MAHA has arrived in Iowa — and Big Ag is reeling",
    author: "BY ELLIE BORST",
  },
  {
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
    title: "California Dems hand Newsom rare defeat on wildfires",
    author: "BY NOAH BAUSTIN, JEREMY B. WHITE, MARISA GUERRA ECHERVRIA AND CAMILLE VON KAENEL",
  },
  {
    image:
      "https://images.unsplash.com/photo-1521790797524-b2497295b8a0?auto=format&fit=crop&w=1200&q=80",
    title: "The House is back in session. Many Republicans hope it won’t be for long.",
    author: "BY MIA MCCARTHY AND JORDAIN CARNEY",
  },
];

export default function MoreTopHeadlines() {
  return (
    <div className="w-full font-sans border-t border-[#d9d9d9] pt-4">
      <div className="flex items-center gap-2 pb-2 mb-4 border-b border-[#d9d9d9]">
        <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block" />
        <h2 className="text-[9px] font-bold tracking-[0.12em] text-[#222222] uppercase font-sans">
          MORE TOP HEADLINES
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <article className="group cursor-pointer">
          <a href="#" className="block space-y-2.5">
            <div className="aspect-[16/10] bg-gray-100 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80"
                alt="Treasury AI productivity"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="text-[16px] lg:text-[18px] font-bold leading-[1.05] text-[#222222] group-hover:text-[#d32f2f] transition-colors tracking-tight font-sans">
              Treasury offers Chalmers an AI productivity prize — with strings attached
            </h3>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider font-sans">
              BY RYAN HEATH
            </p>
          </a>
        </article>

        <article className="group cursor-pointer">
          <a href="#" className="block space-y-2.5">
            <div className="aspect-[16/10] bg-gray-100 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
                alt="G20 Bessent"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="text-[16px] lg:text-[18px] font-bold leading-[1.05] text-[#222222] group-hover:text-[#333333] transition-colors tracking-tight font-sans">
              Bessent&apos;s G20 pitch collides with anxieties over US debt and Iran war
            </h3>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider font-sans">
              BY MICHAEL STRATFORD
            </p>
          </a>
        </article>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 pb-2">
        {secondaryStories.map((story, index) => (
          <article key={index} className="group cursor-pointer border-t border-gray-200 pt-4">
            <a href="#" className="block space-y-2.5">
              <div className="aspect-[16/10] bg-gray-100 overflow-hidden">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-[18px] lg:text-[20px] font-extrabold leading-snug text-gray-900 group-hover:text-[#d32f2f] transition-colors tracking-tight font-sans">
                {story.title}
              </h3>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider font-sans">
                {story.author}
              </p>
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
