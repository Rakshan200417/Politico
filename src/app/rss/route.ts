import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;

    // Fetch the latest 50 published articles
    const [rows]: any = await pool.query(`
      SELECT id, title, slug, deck, content, category, writer_name, image, created_at, updated_at
      FROM articles 
      WHERE status = 'published' 
      ORDER BY created_at DESC 
      LIMIT 50
    `);

    const itemsXml = (rows || [])
      .map((article: any) => {
        const articleUrl = `${baseUrl}/news/${article.slug}`;
        const pubDate = new Date(article.created_at).toUTCString();

        // Extract clean description from deck or content
        let desc = article.deck || '';
        if (!desc && article.content) {
          desc = article.content
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 250);
          if (article.content.length > 250) desc += '…';
        }

        // Format image enclosure URL (Backblaze B2 or absolute URL)
        let enclosureTag = '';
        if (article.image) {
          let imgUrl = article.image;
          if (imgUrl.startsWith('/')) {
            imgUrl = `${baseUrl}${imgUrl}`;
          }
          const isWebp = imgUrl.toLowerCase().includes('.webp');
          const isPng = imgUrl.toLowerCase().includes('.png');
          const mimeType = isWebp ? 'image/webp' : isPng ? 'image/png' : 'image/jpeg';
          enclosureTag = `\n<enclosure url="${imgUrl}" length="0" type="${mimeType}"/>`;
        }

        const authorName = article.writer_name || 'Florida 24 Editorial';
        const categoryName = article.category || 'General';

        return `<item>
<title>
<![CDATA[ ${article.title} ]]>
</title>
<link>${articleUrl}</link>
<guid isPermaLink="true">${articleUrl}</guid>
<description>
<![CDATA[ ${desc} ]]>
</description>
<pubDate>${pubDate}</pubDate>
<author>
<![CDATA[ ${authorName} ]]>
</author>
<category>
<![CDATA[ ${categoryName} ]]>
</category>${enclosureTag}
</item>`;
      })
      .join('\n');

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
<channel>
<title>Florida 24</title>
<link>${baseUrl}</link>
<description>Latest news, politics, business, technology, sports and health updates from Florida 24 News Network LLC.</description>
<language>en-us</language>
<atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
<image>
<url>${baseUrl}/images/logo.svg</url>
<title>Florida 24</title>
<link>${baseUrl}</link>
</image>
${itemsXml}
</channel>
</rss>`;

    return new NextResponse(rssXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 's-maxage=1200, stale-while-revalidate=600',
      },
    });
  } catch (error: any) {
    console.error('RSS Feed error:', error);
    return new NextResponse('Error generating RSS feed', { status: 500 });
  }
}
