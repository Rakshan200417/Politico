import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const [rows]: any = await pool.query(`
      SELECT id, title, slug, deck, category, writer_name, created_at 
      FROM articles 
      WHERE status = 'published' 
      ORDER BY created_at DESC 
      LIMIT 30
    `);

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const itemsXml = (rows || [])
      .map((article: any) => {
        const url = `${baseUrl}/news/${article.slug}`;
        const pubDate = new Date(article.created_at).toUTCString();
        return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${article.deck || ''}]]></description>
      <category><![CDATA[${article.category || 'News'}]]></category>
      <author><![CDATA[${article.writer_name || 'POLITICO'}]]></author>
      <pubDate>${pubDate}</pubDate>
    </item>`;
      })
      .join('');

    const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>POLITICO - Latest News &amp; Analysis</title>
    <link>${baseUrl}</link>
    <description>Authoritative political journalism, policy intelligence, and breaking insights.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss" rel="self" type="application/rss+xml" />
    ${itemsXml}
  </channel>
</rss>`;

    return new NextResponse(rssXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      },
    });
  } catch (error: any) {
    console.error('RSS Feed error:', error);
    return new NextResponse('Error generating RSS feed', { status: 500 });
  }
}

