import React from "react";
import pool from "@/lib/db";

interface VideoItem {
  id?: number;
  slot_number: number;
  title: string;
  video_url: string;
  platform: string;
  thumbnail_url: string;
  duration?: string;
  active: boolean | number;
}

const fallbackVideos: VideoItem[] = [
  {
    slot_number: 1,
    title: "Anthropic's Sarah Heck discusses the AI race, American voters and more",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    platform: "YouTube",
    thumbnail_url: "https://picsum.photos/seed/91/800/600",
    active: 1
  },
  {
    slot_number: 2,
    title: "Rep. Greg Casar talks AI reform during Trump Presidency",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    platform: "YouTube",
    thumbnail_url: "https://picsum.photos/seed/92/800/600",
    active: 1
  },
  {
    slot_number: 3,
    title: "Hugging Face CEO talks cyberattacks, regulatory enforcement and China",
    video_url: "https://rumble.com",
    platform: "Rumble",
    thumbnail_url: "https://picsum.photos/seed/93/800/600",
    active: 1
  },
  {
    slot_number: 4,
    title: "Gina Raimondo: 'You\\'re not going to beat China if you have destabilizing unemployment'",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    platform: "YouTube",
    thumbnail_url: "https://picsum.photos/seed/94/800/600",
    active: 1
  }
];

async function getActiveVideos(): Promise<VideoItem[]> {
  try {
    const [rows]: any = await pool.query(
      "SELECT * FROM shorts_reels WHERE active = 1 ORDER BY slot_number ASC"
    );
    if (rows && rows.length > 0) {
      return rows;
    }
  } catch (err) {
    // Table might not exist yet or connection error, return fallback
  }
  return fallbackVideos;
}

export default async function HomeVideoSection() {
  const activeVideos = await getActiveVideos();

  // If all slots are inactive, don't show the video widget
  if (activeVideos.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center gap-2 pb-2 mb-4 border-b border-[#d9d9d9]">
        <span className="w-2.5 h-2.5 rounded-full border-2 border-[#d32f2f] bg-transparent inline-block"></span>
        <h2 className="text-[10px] font-extrabold tracking-[0.12em] text-[#222222] uppercase font-sans">
          VIDEO
        </h2>
      </div>

      <ul className="space-y-4">
        {activeVideos.map((video, idx) => (
          <li
            key={video.id || video.slot_number || idx}
            className={idx > 0 ? "pt-4 border-t border-gray-100" : ""}
          >
            <a
              href={video.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-3 group block cursor-pointer"
            >
              <div className="w-[80px] h-[55px] bg-gray-200 shrink-0 overflow-hidden relative">
                <img
                  src={video.thumbnail_url || `https://picsum.photos/seed/${video.slot_number * 31}/800/600`}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-300"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-[#d32f2f] flex items-center justify-center shadow">
                    <div className="w-0 h-0 border-t-[3px] border-l-[5px] border-b-[3px] border-transparent border-l-white ml-0.5"></div>
                  </div>
                </div>
              </div>
              <h3 className="text-[14px] font-bold leading-[1.2] text-[#111111] group-hover:text-[#d32f2f] transition-colors font-sans mt-0.5 line-clamp-2 overflow-hidden text-ellipsis break-words">
                {video.title}
              </h3>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
