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
    lower.startsWith('log in • instagram') ||
    lower.startsWith('log in') ||
    lower.includes('log in to facebook') ||
    lower.startsWith('watch this reel') ||
    lower.includes('see instagram photos') ||
    lower === 'facebook' ||
    lower.startsWith('discover popular videos') ||
    lower.includes('security check') ||
    lower === 'just a moment...' ||
    lower.includes('cloudflare') ||
    lower.includes('attention required') ||
    lower.includes('access denied') ||
    lower === 'rumble' ||
    lower === 'youtube'
  );
}

function cleanFbTitle(raw?: string | null, desc?: string | null): string {
  let t = (raw || '').trim();
  t = t
    .replace(/&#xb7;/g, '·')
    .replace(/&middot;/g, '·')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');

  // If title is generic "Facebook" or "Log in to Facebook", use description if available
  const lower = t.toLowerCase();
  if (lower === 'facebook' || lower.startsWith('log in') || !t) {
    if (desc && desc.trim()) {
      return desc
        .replace(/&#xb7;/g, '·')
        .replace(/&middot;/g, '·')
        .replace(/&amp;/g, '&')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .trim();
    }
  }

  // Strip "2.8M views · 1.3K reactions | "
  t = t.replace(/^[0-9.,KMkmB]+\s*views\s*[·•\-|]+\s*[0-9.,KMkmB]+\s*reactions\s*[·•\-|]+\s*/i, '');
  // Strip trailing " | Facebook", " | Reels"
  t = t.replace(/\s*[|•\-]+\s*Facebook.*$/i, '');
  t = t.replace(/\s*[|•\-]+\s*Reels.*$/i, '');
  return t.trim();
}

function cleanInstagramCaption(raw?: string | null): string {
  if (!raw) return '';
  let t = raw
    .replace(/&#xb7;/g, '·')
    .replace(/&middot;/g, '·')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#x2019;/g, "’")
    .replace(/&#x2018;/g, "‘")
    .replace(/&#x201c;/g, "“")
    .replace(/&#x201d;/g, "”")
    // Decodes &#x... hex entities
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    // Decodes &#... decimal entities
    .replace(/&#([0-9]+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .trim();

  // Pattern: '... - user on Date: "Actual caption here"'
  const quoteMatch = t.match(/:\s*["“]([^"”]+)["”]/);
  if (quoteMatch && quoteMatch[1] && quoteMatch[1].length > 3) {
    t = quoteMatch[1];
  }

  // Strip "Username on Instagram: "
  t = t.replace(/^[^:]+\s+on\s+Instagram:\s*["“]?/i, '');
  t = t.replace(/["”]$/, '');
  t = t.replace(/[\r\n]+/g, ' ').trim();

  // If text is super long, truncate to first sentence or clean headline
  if (t.length > 120) {
    const firstPeriod = t.indexOf('.');
    if (firstPeriod > 15 && firstPeriod < 120) {
      t = t.substring(0, firstPeriod + 1);
    } else {
      t = t.substring(0, 110) + '...';
    }
  }

  return t.trim();
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
    const rawUrl = searchParams.get('url') || '';
    const matchUrl = rawUrl.match(/https?:\/\/[^\s"']+/i);
    const videoUrl = matchUrl ? matchUrl[0] : rawUrl.trim();

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

    // 2. Rumble metadata via official oEmbed API
    if (detectedPlatform === 'Rumble') {
      try {
        const rumbleOembedUrl = `https://rumble.com/api/Media/oembed.json?url=${encodeURIComponent(videoUrl)}`;
        const rumbleRes = await fetch(rumbleOembedUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          },
          signal: AbortSignal.timeout(4000),
        });
        if (rumbleRes.ok) {
          const rData = await rumbleRes.json();
          if (rData.title) title = rData.title;
          if (rData.thumbnail_url) thumbnail_url = rData.thumbnail_url;
          if (rData.duration && !isNaN(Number(rData.duration))) {
            duration = formatDurationFromSeconds(Number(rData.duration));
          }
        }
      } catch (rErr) {
        console.warn('Rumble oembed error:', rErr);
      }
    }

    // 3. Facebook Reels metadata via official oEmbed API and page inspection
    if (detectedPlatform === 'Facebook Reels') {
      try {
        const fbOembedUrl = `https://www.facebook.com/plugins/video/oembed.json/?url=${encodeURIComponent(videoUrl)}`;
        const fbRes = await fetch(fbOembedUrl, {
          headers: {
            'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
          },
          signal: AbortSignal.timeout(6000),
        });
        if (fbRes.ok) {
          const fbData = await fbRes.json();
          if (fbData.title) title = cleanFbTitle(fbData.title);
          if (fbData.thumbnail_url) thumbnail_url = fbData.thumbnail_url;
        }
      } catch (fbErr) {
        console.warn('Facebook oembed error:', fbErr);
      }

      // Page scrape with facebookexternalhit to get title, duration, and cover
      if (!title || !thumbnail_url || isBadTitle(title)) {
        try {
          const pageRes = await fetch(videoUrl, {
            headers: {
              'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            },
            signal: AbortSignal.timeout(10000),
          });
          if (pageRes.ok) {
            const html = await pageRes.text();
            const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
            const ogDescMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
            const rawTitle = ogTitleMatch ? ogTitleMatch[1] : '';
            const rawDesc = ogDescMatch ? ogDescMatch[1] : '';
            const cleaned = cleanFbTitle(rawTitle, rawDesc);
            if (cleaned && !isBadTitle(cleaned)) {
              title = cleaned;
            }

            // Duration in ms: playable_duration_in_ms
            const durMsMatch = html.match(/playable_duration_in_ms["']:\s*(\d+)/);
            if (durMsMatch && durMsMatch[1]) {
              duration = formatDurationFromSeconds(Math.floor(parseInt(durMsMatch[1], 10) / 1000));
            } else {
              const durSecMatch = html.match(/duration["']:\s*["']?(\d+)["']?/);
              if (durSecMatch && durSecMatch[1]) {
                const s = parseInt(durSecMatch[1], 10);
                if (s > 0 && s < 7200) duration = formatDurationFromSeconds(s);
              }
            }

            // Facebook thumbnail in og:image or JSON
            const ogImgMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
            if (ogImgMatch && ogImgMatch[1]) {
              thumbnail_url = ogImgMatch[1].replace(/&amp;/g, '&');
            } else {
              const jsonThumbMatch = html.match(/lookaside\.fbsbx\.com\\\/lookaside\\\/crawler\\\/media\\\/[^"'\s\\]+/i);
              if (jsonThumbMatch && jsonThumbMatch[0]) {
                thumbnail_url = `https://${jsonThumbMatch[0].replace(/\\u0026/g, '&').replace(/\\\//g, '/')}`;
              }
            }
          }
        } catch (fbScrapeErr) {
          console.warn('Facebook page scrape error:', fbScrapeErr);
        }
      }
    }

    // 4. Instagram Reels metadata via direct bot inspection
    if (detectedPlatform === 'Instagram Reels') {
      const igInfo = extractInstagramInfoFromUrl(videoUrl);
      const igCode = igInfo.code;
      if (igCode) {
        try {
          const igDirectUrl = `https://www.instagram.com/reel/${igCode}/`;
          const igRes = await fetch(igDirectUrl, {
            headers: {
              'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            },
            signal: AbortSignal.timeout(10000),
          });
          if (igRes.ok) {
            const html = await igRes.text();
            const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
            const ogDescMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
            const rawTitle = ogTitleMatch ? ogTitleMatch[1] : (ogDescMatch ? ogDescMatch[1] : '');
            if (rawTitle) {
              const cleaned = cleanInstagramCaption(rawTitle);
              if (cleaned && !isBadTitle(cleaned)) {
                title = cleaned;
              }
            }

            const ogImgMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
            if (ogImgMatch && ogImgMatch[1]) {
              thumbnail_url = ogImgMatch[1].replace(/&amp;/g, '&');
            }
          }
        } catch (igErr) {
          console.warn('Instagram fetch error:', igErr);
        }
      }
      duration = '0:30';
    }

    // 5. OpenGraph fallback for other URLs
    if ((!title || isBadTitle(title) || !thumbnail_url) && detectedPlatform !== 'YouTube' && detectedPlatform !== 'Instagram Reels') {
      try {
        const targetUrl = videoUrl.includes('?') && !videoUrl.includes('facebook.com') ? videoUrl.split('?')[0] : videoUrl;
        const pageRes = await fetch(targetUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
          },
          signal: AbortSignal.timeout(3500),
        });

        if (pageRes.ok) {
          const html = await pageRes.text();

          // Extract title
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

          // Extract thumbnail
          if (!thumbnail_url) {
            const ogImgMatch =
              html.match(/<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']+)["']/i) ||
              html.match(/<meta\s+(?:property|name)=["']twitter:image["']\s+content=["']([^"']+)["']/i);
            if (ogImgMatch && ogImgMatch[1] && !ogImgMatch[1].startsWith('data:')) {
              thumbnail_url = ogImgMatch[1].trim();
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

    // Persist thumbnail directly to Backblaze B2 in the reels folder
    if (thumbnail_url && thumbnail_url.startsWith('http') && !thumbnail_url.includes('backblazeb2.com')) {
      let uploadedToB2 = false;
      try {
        const imgRes = await fetch(thumbnail_url, {
          signal: AbortSignal.timeout(5000),
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          },
        });
        const contentType = imgRes.headers.get('content-type') || '';
        if (imgRes.ok && !contentType.includes('text/html')) {
          const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
          const sharp = (await import('sharp')).default;
          const webpBuffer = await sharp(imgBuffer).webp({ quality: 85 }).toBuffer();
          const { uploadToFolder } = await import('@/lib/b2Storage');
          const filename = `reel_thumb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.webp`;
          const b2Url = await uploadToFolder('reels', filename, webpBuffer, 'image/webp');
          thumbnail_url = b2Url;
          uploadedToB2 = true;
        }
      } catch (uploadErr) {
        console.warn('[fetch-metadata] Could not persist original thumbnail to Backblaze B2:', uploadErr);
      }

      // If remote image could not be fetched or was blocked by login wall, upload high-res poster to Backblaze B2
      if (!uploadedToB2) {
        try {
          const fallbackUrl = detectedPlatform === 'Facebook Reels'
            ? 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=80'
            : detectedPlatform === 'Instagram Reels'
            ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&auto=format&fit=crop&q=80';

          const fRes = await fetch(fallbackUrl, { signal: AbortSignal.timeout(5000) });
          if (fRes.ok) {
            const fBuf = Buffer.from(await fRes.arrayBuffer());
            const sharp = (await import('sharp')).default;
            const webpBuf = await sharp(fBuf).webp({ quality: 85 }).toBuffer();
            const { uploadToFolder } = await import('@/lib/b2Storage');
            const filename = `reel_thumb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.webp`;
            thumbnail_url = await uploadToFolder('reels', filename, webpBuf, 'image/webp');
          }
        } catch (fErr) {
          console.warn('[fetch-metadata] Fallback B2 upload error:', fErr);
        }
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
