import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

function formatDurationFromSeconds(totalSec: number): string {
  if (isNaN(totalSec) || totalSec <= 0) return '0:45';
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function isValidDurationString(str: string): boolean {
  if (!str) return false;
  const trimmed = str.trim();
  return /^\d{1,2}:\d{2}(?::\d{2})?$/.test(trimmed);
}

function isBadTitle(t?: string | null): boolean {
  if (!t || !t.trim()) return true;
  const lower = t.toLowerCase().trim();
  return (
    lower === 'instagram' ||
    lower.startsWith('login • instagram') ||
    lower.startsWith('watch this reel') ||
    lower.includes('see instagram photos') ||
    lower === 'facebook' ||
    lower.startsWith('log in to facebook') ||
    lower.includes('security check') ||
    lower === 'just a moment...' ||
    lower.includes('cloudflare') ||
    lower.includes('attention required') ||
    lower.includes('access denied') ||
    lower === 'rumble' ||
    lower === 'youtube'
  );
}

function extractRumbleTitleFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.split('/').filter(Boolean).pop() || '';
    const cleanName = filename.replace(/\.html$/i, '');
    
    // Pattern: v[alphanumeric]-[title-slug]
    const match = cleanName.match(/^v[a-zA-Z0-9]+-(.+)$/);
    if (match && match[1]) {
      const slug = match[1];
      const words = slug.split(/[-_]+/).filter(Boolean);
      if (words.length > 0) {
        return words
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(' ');
      }
    }
  } catch {}
  return null;
}

function extractInstagramInfoFromUrl(url: string): { code?: string; username?: string } {
  try {
    const urlObj = new URL(url);
    const parts = urlObj.pathname.split('/').filter(Boolean);
    if (parts.length >= 2) {
      if (parts[0] === 'reel' || parts[0] === 'p' || parts[0] === 'reels') {
        return { code: parts[1] };
      }
      if (parts[1] === 'reel' || parts[1] === 'p' || parts[1] === 'reels') {
        return { username: parts[0], code: parts[2] };
      }
    }
  } catch {}
  return {};
}

function extractFacebookInfoFromUrl(url: string): { id?: string } {
  try {
    const urlObj = new URL(url);
    const vParam = urlObj.searchParams.get('v');
    if (vParam) return { id: vParam };
    const parts = urlObj.pathname.split('/').filter(Boolean);
    const lastPart = parts[parts.length - 1];
    if (lastPart && /^\d+$/.test(lastPart)) {
      return { id: lastPart };
    }
  } catch {}
  return {};
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoUrl = searchParams.get('url');

    if (!videoUrl) {
      return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
    }

    let detectedPlatform = 'YouTube';
    if (videoUrl.includes('rumble.com')) {
      detectedPlatform = 'Rumble';
    } else if (videoUrl.includes('instagram.com')) {
      detectedPlatform = 'Instagram Reels';
    } else if (videoUrl.includes('facebook.com') || videoUrl.includes('fb.watch')) {
      detectedPlatform = 'Facebook Reels';
    } else if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      detectedPlatform = 'YouTube';
    }

    let title = '';
    let thumbnail_url = '';
    let duration = '0:45';

    // 1. YouTube metadata via official oEmbed & page scrape
    if (detectedPlatform === 'YouTube') {
      try {
        const oembedRes = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`);
        if (oembedRes.ok) {
          const data = await oembedRes.json();
          title = data.title || '';
          thumbnail_url = data.thumbnail_url || '';
        }
      } catch (err) {
        console.warn('YouTube oembed error:', err);
      }

      // Extract YouTube exact duration and HQ thumbnail
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = videoUrl.match(regExp);
      const ytId = match && match[2].length === 11 ? match[2] : null;
      if (ytId) {
        if (!thumbnail_url) {
          thumbnail_url = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
        }
        try {
          const ytPageRes = await fetch(`https://www.youtube.com/watch?v=${ytId}`, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept-Language': 'en-US,en;q=0.9',
            },
          });
          if (ytPageRes.ok) {
            const ytHtml = await ytPageRes.text();
            const durMsMatch = ytHtml.match(/"approxDurationMs":\s*"(\d+)"/);
            if (durMsMatch && durMsMatch[1]) {
              duration = formatDurationFromSeconds(Math.floor(parseInt(durMsMatch[1], 10) / 1000));
            } else {
              const lengthSecMatch = ytHtml.match(/"lengthSeconds":\s*"(\d+)"/);
              if (lengthSecMatch && lengthSecMatch[1]) {
                duration = formatDurationFromSeconds(parseInt(lengthSecMatch[1], 10));
              }
            }
          }
        } catch (e) {
          console.warn('YouTube duration fetch error:', e);
        }
      }
    }

    // 2. OpenGraph / HTML metadata scraper for Rumble, Instagram, Facebook
    if (detectedPlatform !== 'YouTube' || !title || !thumbnail_url) {
      try {
        const cleanUrl = videoUrl.split('?')[0];
        const pageRes = await fetch(cleanUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
          },
          next: { revalidate: 3600 },
        });

        if (pageRes.ok) {
          const html = await pageRes.text();

          // Extract title (og:title, og:description, twitter:title, or <title>)
          if (!title || isBadTitle(title)) {
            const ogTitleMatch =
              html.match(/<meta\s+(?:property|name)=["']og:title["']\s+content=["']([^"']+)["']/i) ||
              html.match(/<meta\s+(?:property|name)=["']twitter:title["']\s+content=["']([^"']+)["']/i);

            if (ogTitleMatch && ogTitleMatch[1] && !isBadTitle(ogTitleMatch[1])) {
              title = ogTitleMatch[1].trim();
            } else {
              const ogDescMatch = html.match(/<meta\s+(?:property|name)=["'](?:og:description|description)["']\s+content=["']([^"']+)["']/i);
              if (ogDescMatch && ogDescMatch[1] && !isBadTitle(ogDescMatch[1])) {
                title = ogDescMatch[1].trim();
              } else {
                const htmlTitleMatch = html.match(/<title>([^<]+)<\/title>/i);
                if (htmlTitleMatch && htmlTitleMatch[1] && !isBadTitle(htmlTitleMatch[1])) {
                  title = htmlTitleMatch[1].replace(/[-|].*$/, '').trim();
                }
              }
            }
          }

          // Extract thumbnail (og:image or twitter:image)
          if (!thumbnail_url) {
            const ogImgMatch =
              html.match(/<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']+)["']/i) ||
              html.match(/<meta\s+(?:property|name)=["']twitter:image["']\s+content=["']([^"']+)["']/i);
            if (ogImgMatch && ogImgMatch[1] && !ogImgMatch[1].startsWith('data:')) {
              thumbnail_url = ogImgMatch[1].trim();
            }
          }

          // Extract duration strictly (avoid CSS matching bugs)
          const isoDurMatch = html.match(/(?:itemprop=["']duration["']\s+content=["']|"duration":\s*["'])PT(?:(\d+)M)?(?:(\d+)S)?["']/i);
          if (isoDurMatch && (isoDurMatch[1] || isoDurMatch[2])) {
            const m = parseInt(isoDurMatch[1] || '0', 10);
            const s = parseInt(isoDurMatch[2] || '0', 10);
            duration = `${m}:${s < 10 ? '0' : ''}${s}`;
          } else {
            const ogDurMatch = html.match(/<meta\s+property=["']og:video:duration["']\s+content=["'](\d+)["']/i);
            if (ogDurMatch && ogDurMatch[1]) {
              const num = parseInt(ogDurMatch[1], 10);
              if (!isNaN(num) && num > 0 && num < 7200) {
                duration = formatDurationFromSeconds(num);
              }
            }
          }
        }
      } catch (e) {
        console.warn('Scraping error:', e);
      }
    }

    // 3. Intelligent Platform Fallbacks for Heading / Title
    if (!title || isBadTitle(title)) {
      if (detectedPlatform === 'Rumble') {
        const slugTitle = extractRumbleTitleFromUrl(videoUrl);
        title = slugTitle || 'Rumble Video Broadcast';
      } else if (detectedPlatform === 'Instagram Reels') {
        const igInfo = extractInstagramInfoFromUrl(videoUrl);
        if (igInfo.username) {
          title = `Instagram Reel by @${igInfo.username}`;
        } else if (igInfo.code) {
          title = `Instagram Reel (${igInfo.code})`;
        } else {
          title = 'Instagram Reel Video';
        }
      } else if (detectedPlatform === 'Facebook Reels') {
        const fbInfo = extractFacebookInfoFromUrl(videoUrl);
        if (fbInfo.id) {
          title = `Facebook Reel (${fbInfo.id})`;
        } else {
          title = 'Facebook Reel Video';
        }
      } else {
        title = 'Featured Video Story';
      }
    }

    // Clean up title entity codes
    title = title
      .replace(/&amp;/g, '&')
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();

    // 4. Validate Duration
    if (!isValidDurationString(duration)) {
      duration = detectedPlatform === 'Instagram Reels' ? '0:30' : '0:45';
    }

    // 5. High-Quality News Thumbnail Fallbacks
    if (!thumbnail_url) {
      if (detectedPlatform === 'Rumble') {
        thumbnail_url = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80';
      } else if (detectedPlatform === 'Instagram Reels') {
        thumbnail_url = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
      } else if (detectedPlatform === 'Facebook Reels') {
        thumbnail_url = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=80';
      } else {
        thumbnail_url = 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&auto=format&fit=crop&q=80';
      }
    }

    return NextResponse.json({
      success: true,
      platform: detectedPlatform,
      title,
      thumbnail_url,
      duration,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
