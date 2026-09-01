export default function MoreTopSidebar() {
  return (
    <aside className="w-full font-sans pl-0 xl:pl-2">
      <div className="space-y-5 border-l border-gray-200 pl-4">
        <div className="border-b border-gray-200 pb-4">
          <div className="flex items-center gap-2 pb-2 mb-4 border-b-2 border-black">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block" />
            <h2 className="text-xs font-black tracking-[0.16em] text-[#111111] uppercase font-sans">
              PODCASTS
            </h2>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <div className="overflow-hidden bg-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80"
                  alt="Podcast feature"
                  className="h-[170px] w-full object-cover"
                />
              </div>

              <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[#111111] font-sans">
                Aug. 31, 2026
              </div>

              <h3 className="text-[18px] font-black leading-[1.04] tracking-[-0.04em] text-[#111111] font-sans">
                CAN AMERICA&apos;S OIL AND GAS INDUSTRY ACTUALLY POWER AI?
              </h3>

              <div className="flex items-center gap-3 rounded-md bg-[#f5f5f5] px-2 py-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6d73d9] text-base font-bold text-white">
                  ▶
                </span>

                <div className="flex-1 min-w-0">
                  <div className="mb-1 text-[9px] font-black uppercase tracking-[0.18em] text-[#111111] font-sans">
                    POLITICO Energy
                  </div>
                  <div className="text-[12px] font-medium leading-snug text-[#111111] font-sans">
                    EQT CEO Toby Rice on the future of natural gas...
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#d6d6d6]">
                    <div className="h-full w-[35%] rounded-full bg-[#4b58d9]" />
                  </div>
                </div>

                <span className="text-[10px] font-bold text-[#6b6b6b] font-sans">00:00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <div className="flex items-center gap-2 pb-2 mb-4 border-b-2 border-black">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block" />
            <h2 className="text-xs font-black tracking-[0.16em] text-[#111111] uppercase font-sans">
              NEWSLETTERS
            </h2>
          </div>

          <div>
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-[30px] font-black leading-[0.95] tracking-[-0.06em] text-[#111111] font-sans">
                Playbook
              </h3>
              <div className="mt-1 h-10 w-10 rounded-full border-[3px] border-[#d32f2f] bg-[#f6f6f6]" />
            </div>

            <p className="mt-3 text-[17px] leading-[1.1] text-[#111111] font-sans">
              The unofficial guide to official Washington, every morning and weekday afternoons.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <div className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#111111] font-sans">
                  Email
                </div>
                <div className="border-b border-black pb-2 text-[16px] text-[#555] font-sans">
                  Your Email
                </div>
              </div>

              <div>
                <div className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#111111] font-sans">
                  Employer
                </div>
                <div className="border-b border-black pb-2 text-[16px] text-[#555] font-sans">
                  Employer
                </div>
              </div>

              <div>
                <div className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#111111] font-sans">
                  Job Title
                </div>
                <div className="border-b border-black pb-2 text-[16px] text-[#555] font-sans">
                  Job Title
                </div>
              </div>
            </div>

            <button className="mt-5 w-full rounded-full bg-[#b1b5b9] py-3 text-[12px] font-black uppercase tracking-[0.2em] text-[#111111] font-sans">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
