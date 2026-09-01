import React from "react";

export default function TopNewsGrid() {
  return (
    <div className="w-full font-sans">
      <div className="flex items-center gap-2 pb-2 mb-4 border-b-2 border-black">
        <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block" />
        <h2 className="text-xs font-black tracking-[0.16em] text-[#111111] uppercase font-sans">
          TOP NEWS
        </h2>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-6 items-start">
        <article className="group cursor-pointer">
          <a href="#" className="block">
            <h1 className="text-[42px] sm:text-[52px] lg:text-[62px] font-black leading-[0.9] tracking-[-0.06em] text-[#1f9fe3] group-hover:text-[#0f6db1] transition-colors duration-150 mb-3 font-sans">
              Republicans are losing
              <span className="block">patience with Trump&apos;s Iran</span>
              <span className="block">whiplash</span>
            </h1>

            <p className="text-[17px] lg:text-[18px] text-[#111111] font-sans leading-[1.4] mb-4">
              Just days after Treasury Secretary Scott Bessent announced a new “economic D-Day” to choke Iran, the U.S. carried out its first known attack on Iran since July.
            </p>

            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.18em] mb-4 font-sans">
              BY MEGAN MESSERLY AND ALEX GANGITANO
            </p>

            <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1400&q=80"
                alt="Trump portrait"
                className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          </a>
        </article>

        <div className="space-y-5 pt-1">
          <article className="group cursor-pointer">
            <a href="#" className="block space-y-2.5">
              <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80"
                  alt="White House building"
                  className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                />
              </div>

              <h3 className="text-[20px] lg:text-[22px] font-black leading-[1] tracking-[-0.05em] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans">
                Supreme Court allows Trump&apos;s ballroom construction, but Roberts says project is &lsquo;likely unlawful&rsquo;
              </h3>

              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.18em] font-sans">
                BY JOSH GERSTEIN
              </p>
            </a>
          </article>

          <article className="group cursor-pointer border-t border-gray-200 pt-4">
            <a href="#" className="block space-y-2.5">
              <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80"
                  alt="Podium and politics"
                  className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                />
              </div>

              <h3 className="text-[20px] lg:text-[22px] font-black leading-[1] tracking-[-0.05em] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans">
                Trump welcomes Russia back to the G20. Europe isn&apos;t having it.
              </h3>

              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.18em] font-sans">
                BY MICHAEL STRATFORD AND RASMUS BUCHHAVE
              </p>
            </a>
          </article>
        </div>
      </div>
    </div>
  );
}
