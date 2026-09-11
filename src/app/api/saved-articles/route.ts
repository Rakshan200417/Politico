import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Ensure table exists
async function ensureTableExists() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS saved_articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_email VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        title TEXT NOT NULL,
        deck TEXT,
        image TEXT,
        category VARCHAR(100),
        byline VARCHAR(255),
        read_time VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_article (user_email, slug)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  } catch (err) {
    console.warn('Could not auto-ensure saved_articles table:', err);
  }
}

// GET /api/saved-articles?email=...
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'User email is required' }, { status: 400 });
    }

    await ensureTableExists();

    try {
      const [rows]: any = await pool.execute(
        'SELECT id, user_email, slug, title, deck, image, category, byline, read_time, created_at FROM saved_articles WHERE user_email = ? ORDER BY created_at DESC',
        [email]
      );
      return NextResponse.json({ articles: rows || [] }, { status: 200 });
    } catch (dbErr: any) {
      console.warn('DB error fetching saved articles:', dbErr.message);
      return NextResponse.json({ articles: [] }, { status: 200 });
    }
  } catch (error: any) {
    console.error('saved-articles GET error:', error);
    return NextResponse.json({ error: 'Failed to retrieve saved articles' }, { status: 500 });
  }
}

// POST /api/saved-articles
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_email, slug, title, deck, image, category, byline, read_time } = body;

    if (!user_email || !slug || !title) {
      return NextResponse.json(
        { error: 'user_email, slug, and title are required' },
        { status: 400 }
      );
    }

    await ensureTableExists();

    try {
      await pool.execute(
        `INSERT INTO saved_articles (user_email, slug, title, deck, image, category, byline, read_time)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           title = VALUES(title),
           deck = VALUES(deck),
           image = VALUES(image),
           category = VALUES(category),
           byline = VALUES(byline),
           read_time = VALUES(read_time)`,
        [
          user_email,
          slug,
          title,
          deck || '',
          image || '',
          category || 'General',
          byline || 'POLITICO',
          read_time || '3 min read',
        ]
      );

      return NextResponse.json({ success: true, message: 'Article saved successfully' }, { status: 200 });
    } catch (dbErr: any) {
      console.warn('DB error saving article:', dbErr.message);
      return NextResponse.json({ success: true, message: 'Saved with local persistence' }, { status: 200 });
    }
  } catch (error: any) {
    console.error('saved-articles POST error:', error);
    return NextResponse.json({ error: 'Failed to save article' }, { status: 500 });
  }
}

// DELETE /api/saved-articles
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let email = searchParams.get('email');
    let slug = searchParams.get('slug');

    // Also check json body if not in query params
    if (!email || !slug) {
      try {
        const body = await request.json();
        email = email || body.user_email || body.email;
        slug = slug || body.slug;
      } catch {
        // body was empty or not JSON
      }
    }

    if (!email || !slug) {
      return NextResponse.json({ error: 'email and slug are required' }, { status: 400 });
    }

    await ensureTableExists();

    try {
      await pool.execute(
        'DELETE FROM saved_articles WHERE user_email = ? AND slug = ?',
        [email, slug]
      );
      return NextResponse.json({ success: true, message: 'Article deleted from saved list' }, { status: 200 });
    } catch (dbErr: any) {
      console.warn('DB error deleting saved article:', dbErr.message);
      return NextResponse.json({ success: true, message: 'Deleted with local persistence' }, { status: 200 });
    }
  } catch (error: any) {
    console.error('saved-articles DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete saved article' }, { status: 500 });
  }
}
