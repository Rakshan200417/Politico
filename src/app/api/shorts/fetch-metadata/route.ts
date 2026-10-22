import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

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

    // 1. YouTube metadata via oEmbed & page scrape for exact duration
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
            // 1. Check approxDurationMs
            const durMsMatch = ytHtml.match(/"approxDurationMs":\s*"(\d+)"/);
            if (durMsMatch && durMsMatch[1]) {
              const totalSec = Math.floor(parseInt(durMsMatch[1], 10) / 1000);
              const m = Math.floor(totalSec / 60);
              const s = totalSec % 60;
              duration = `${m}:${s < 10 ? '0' : ''}${s}`;
            } else {
              // 2. Check lengthSeconds
              const lengthSecMatch = ytHtml.match(/"lengthSeconds":\s*"(\d+)"/);
              if (lengthSecMatch && lengthSecMatch[1]) {
                const totalSec = parseInt(lengthSecMatch[1], 10);
                const m = Math.floor(totalSec / 60);
                const s = totalSec % 60;
                duration = `${m}:${s < 10 ? '0' : ''}${s}`;
              }
            }
          }
        } catch (e) {
          console.warn('YouTube duration fetch error:', e);
        }
      }
    }

    // 2. OpenGraph metadata parser for Rumble, Instagram, Facebook, etc.
    if (!title || !thumbnail_url || duration === '0:45') {
      try {
        const pageRes = await fetch(videoUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
          next: { revalidate: 3600 }
        });

        if (pageRes.ok) {
          const html = await pageRes.text();

          // Extract title (og:title or <title>)
          if (!title) {
            const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
                                 html.match(/<meta\s+name=["']twitter:title["']\s+content=["']([^"']+)["']/i);
            if (ogTitleMatch && ogTitleMatch[1]) {
              title = ogTitleMatch[1].trim();
            } else {
              const htmlTitleMatch = html.match(/<title>([^<]+)<\/title>/i);
              if (htmlTitleMatch && htmlTitleMatch[1]) {
                title = htmlTitleMatch[1].replace(/[-|].*$/, '').trim();
              }
            }
          }

          // Extract thumbnail (og:image or twitter:image)
          if (!thumbnail_url) {
            const ogImgMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
                               html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i);
            if (ogImgMatch && ogImgMatch[1]) {
              thumbnail_url = ogImgMatch[1].trim();
            }
          }

          // Extract duration
          // A. ISO-8601 PT#M#S or PT#S
          const isoDurMatch = html.match(/"duration":\s*"PT(?:(\d+)M)?(?:(\d+)S)?"/i) ||
                              html.match(/itemprop=["']duration["']\s+content=["']PT(?:(\d+)M)?(?:(\d+)S)?["']/i);
          if (isoDurMatch && (isoDurMatch[1] || isoDurMatch[2])) {
            const m = parseInt(isoDurMatch[1] || '0', 10);
            const s = parseInt(isoDurMatch[2] || '0', 10);
            duration = `${m}:${s < 10 ? '0' : ''}${s}`;
          } else {
            // B. Direct seconds
            const durationMatch = html.match(/<meta\s+property=["']og:video:duration["']\s+content=["']([^"']+)["']/i) ||
                                  html.match(/"duration":\s*"?(\d+)"?/i);
            if (durationMatch && durationMatch[1]) {
              const num = parseInt(durationMatch[1], 10);
              if (!isNaN(num) && num > 0) {
                const m = Math.floor(num / 60);
                const s = num % 60;
                duration = `${m}:${s < 10 ? '0' : ''}${s}`;
              }
            }
          }
        }
      } catch (e) {
        console.warn('Scraping error:', e);
      }
    }

    // Default clean-ups & fallbacks
    if (!title) {
      if (detectedPlatform === 'Rumble') {
        title = 'Rumble Video Broadcast';
      } else if (detectedPlatform === 'Instagram Reels') {
        title = 'Instagram Reel Video';
      } else if (detectedPlatform === 'Facebook Reels') {
        title = 'Facebook Reel Video';
      } else {
        title = 'Featured Video Story';
      }
    }

    if (!thumbnail_url) {
      thumbnail_url = 'https://picsum.photos/seed/' + Math.floor(Math.random() * 999) + '/800/600';
    }

    return NextResponse.json({
      success: true,
      platform: detectedPlatform,
      title: title.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"'),
      thumbnail_url,
      duration: duration || '0:45'
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
