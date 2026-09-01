import React from "react";

interface LatestNewsItem {
  id: string;
  title: string;
  time: string;
  isRedTime?: boolean;
}

export default function LatestNewsList() {
  const latestNews: LatestNewsItem[] = [
    {
      id: "1",
      time: "3m",
      title: "Trump promises more strikes after US and Iran trade blows for first time in a month",
      isRedTime: true,
    },
    {
      id: "2",
      time: "31m",
      title: "Republicans ask Supreme Court to block campaign advertising ruling",
      isRedTime: true,
    },
    {
      id: "3",
      time: "34m",
      title: "Trump: Communities that reject data centers will end up 'backwards and poor'",
      isRedTime: true,
    },
    {
      id: "4",
      time: "28m",
      title: "Germany's far right eyes eastern state as springboard to national power",
      isRedTime: true,
    },
    {
      id: "5",
      time: "1h",
      title: "China will stop Russia from going nuclear, Finland's Stubb says",
      isRedTime: true,
    },
    {
      id: "6",
      time: "1h",
      title: "Capitol Agenda: Johnson faces pressure to cut out early",
      isRedTime: true,
    },
    {
      id: "7",
      time: "1h",
      title: "Belgium to US ambassador: Stop attacking our officials online",
      isRedTime: true,
    },
    {
      id: "8",
      time: "1h",
      title: "The Trump-shaped problems awaiting Andy Burnham, ranked",
      isRedTime: false,
    },
  ];

  return (
    <aside className="w-full pr-0 lg:pr-3 font-sans">
      {/* Section Header with Red Circle Indicator */}
      <div className="flex items-center gap-2 pb-2 mb-3 border-b-2 border-black">
        <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
        <h2 className="text-xs font-black tracking-widest text-[#111111] uppercase font-sans">
          LATEST NEWS
        </h2>
      </div>

      {/* News List */}
      <div className="divide-y divide-gray-200">
        {latestNews.map((item) => (
          <article key={item.id} className="py-3.5 group cursor-pointer">
            <a href="#" className="flex items-start gap-3">
              <span
                className={`text-[11px] font-bold shrink-0 min-w-[28px] pt-0.5 ${
                  item.isRedTime ? "text-[#d32f2f]" : "text-gray-500"
                }`}
              >
                {item.time}
              </span>
              <h3 className="text-[13px] font-extrabold leading-snug text-gray-900 group-hover:text-[#d32f2f] transition-colors duration-150 font-sans">
                {item.title}
              </h3>
            </a>
          </article>
        ))}
      </div>
    </aside>
  );
}
