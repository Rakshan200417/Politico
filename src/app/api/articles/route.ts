import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Ensure table exists and has all required columns
async function ensureArticlesTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        writer_email VARCHAR(255) NOT NULL,
        writer_name VARCHAR(255) DEFAULT '',
        title VARCHAR(500) NOT NULL,
        slug VARCHAR(500) DEFAULT '',
        deck TEXT,
        content LONGTEXT,
        category VARCHAR(100) NOT NULL,
        subcategories TEXT,
        tags TEXT,
        read_time VARCHAR(50) DEFAULT '5 min read',
        status ENUM('draft', 'pending', 'published', 'rejected', 'trash') DEFAULT 'draft',
        rejection_reason TEXT,
        card_summary TEXT,
        focus_keyword VARCHAR(255) DEFAULT '',
        meta_description VARCHAR(500) DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_writer_status (writer_email, status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Safely verify columns in case table was created with an older schema
    const optionalColumns = [
      { name: 'slug', definition: 'VARCHAR(500) DEFAULT ""' },
      { name: 'deck', definition: 'TEXT' },
      { name: 'subcategories', definition: 'TEXT' },
      { name: 'tags', definition: 'TEXT' },
      { name: 'read_time', definition: 'VARCHAR(50) DEFAULT "5 min read"' },
      { name: 'rejection_reason', definition: 'TEXT' },
      { name: 'card_summary', definition: 'TEXT' },
      { name: 'focus_keyword', definition: 'VARCHAR(255) DEFAULT ""' },
      { name: 'meta_description', definition: 'VARCHAR(500) DEFAULT ""' },
      { name: 'image', definition: 'VARCHAR(1000) DEFAULT ""' },
      { name: 'image_caption', definition: 'TEXT' },
      { name: 'image_credit', definition: 'VARCHAR(255) DEFAULT ""' },
    ];

    for (const col of optionalColumns) {
      try {
        await pool.query(`ALTER TABLE articles ADD COLUMN ${col.name} ${col.definition}`);
      } catch (e: any) {
        // Error code ER_DUP_FIELDNAME (1060) means column already exists, which is expected
        if (e.errno !== 1060 && !e.message?.includes('Duplicate column')) {
          // ignore or log
        }
      }
    }
  } catch (err) {
    console.warn('[DB] Could not ensure articles table:', err);
  }
}

// GET /api/articles?email=...&status=...
export async function GET(request: Request) {
  try {
    await ensureArticlesTable();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const status = searchParams.get('status');

    let query = 'SELECT * FROM articles';
    const params: any[] = [];

    if (email && status) {
      query += ' WHERE writer_email = ? AND status = ? ORDER BY updated_at DESC';
      params.push(email, status);
    } else if (email) {
      query += ' WHERE writer_email = ? ORDER BY updated_at DESC';
      params.push(email);
    } else if (status) {
      query += ' WHERE status = ? ORDER BY updated_at DESC';
      params.push(status);
    } else {
      query += ' ORDER BY updated_at DESC';
    }

    const [rows]: any = await pool.execute(query, params);

    // Parse subcategories and tags if they are JSON strings
    const articles = rows.map((article: any) => {
      let subcategories = [];
      let tags = [];
      try {
        subcategories = article.subcategories ? JSON.parse(article.subcategories) : [];
      } catch {
        subcategories = article.subcategories ? article.subcategories.split(',').map((s: string) => s.trim()) : [];
      }
      try {
        tags = article.tags ? JSON.parse(article.tags) : [];
      } catch {
        tags = article.tags ? article.tags.split(',').map((s: string) => s.trim()) : [];
      }
      return {
        ...article,
        subcategories,
        tags,
      };
    });

    return NextResponse.json({ articles }, { status: 200 });
  } catch (error: any) {
    console.error('[GET /api/articles Error]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles from database', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/articles (Create new article)
export async function POST(request: Request) {
  try {
    await ensureArticlesTable();

    const body = await request.json();
    const {
      writer_email,
      writer_name = '',
      title,
      slug = '',
      deck = '',
      content = '',
      category = 'Business',
      subcategories = [],
      tags = [],
      read_time = '5 min read',
      status = 'draft',
      card_summary = '',
      focus_keyword = '',
      meta_description = '',
      image = '',
      image_caption = '',
      image_credit = '',
      pending_images = [],
    } = body;

    if (!writer_email || !title) {
      return NextResponse.json(
        { error: 'Writer email and article title are required' },
        { status: 400 }
      );
    }

    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const subcategoriesJson = JSON.stringify(subcategories || []);
    const tagsJson = JSON.stringify(tags || []);

    const [result]: any = await pool.execute(
      `INSERT INTO articles (
        writer_email, writer_name, title, slug, deck, content,
        category, subcategories, tags, read_time, status,
        card_summary, focus_keyword, meta_description,
        image, image_caption, image_credit
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        writer_email,
        writer_name,
        title,
        generatedSlug,
        deck,
        content,
        category,
        subcategoriesJson,
        tagsJson,
        read_time,
        status,
        card_summary,
        focus_keyword,
        meta_description,
        image,
        image_caption,
        image_credit,
      ]
    );

    const insertedId = result.insertId;

    if (pending_images && pending_images.length > 0) {
      for (const img of pending_images) {
        try {
          await pool.execute(
            `INSERT INTO article_images (url, filename, uploader_email, caption, credit, seo_keywords)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [img.url, img.filename, writer_email, img.caption, img.credit, img.seo_keywords]
          );
        } catch (dbErr) {
          console.warn('[DB] Failed to record pending image:', dbErr);
        }
      }
    }

    return NextResponse.json(
      {
        message: 'Article saved successfully in database',
        id: insertedId,
        article: {
          id: insertedId,
          writer_email,
          writer_name,
          title,
          slug: generatedSlug,
          deck,
          content,
          category,
          subcategories,
          tags,
          read_time,
          status,
          card_summary,
          focus_keyword,
          meta_description,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[POST /api/articles Error]:', error);
    return NextResponse.json(
      { error: 'Failed to create article in database', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/articles (Update article content, SEO, or status e.g. trash, draft, pending)
export async function PUT(request: Request) {
  try {
    await ensureArticlesTable();

    const body = await request.json();
    const {
      id,
      writer_email,
      writer_name,
      title,
      slug,
      deck,
      content,
      category,
      subcategories,
      tags,
      read_time,
      status,
      rejection_reason,
      card_summary,
      focus_keyword,
      meta_description,
      image,
      image_caption,
      image_credit,
      pending_images = [],
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Article ID is required for update' }, { status: 400 });
    }

    // Dynamic field update builder
    const updates: string[] = [];
    const values: any[] = [];

    if (title !== undefined) { updates.push('title = ?'); values.push(title); }
    if (slug !== undefined) { updates.push('slug = ?'); values.push(slug); }
    if (deck !== undefined) { updates.push('deck = ?'); values.push(deck); }
    if (content !== undefined) { updates.push('content = ?'); values.push(content); }
    if (category !== undefined) { updates.push('category = ?'); values.push(category); }
    if (subcategories !== undefined) {
      updates.push('subcategories = ?');
      values.push(typeof subcategories === 'string' ? subcategories : JSON.stringify(subcategories));
    }
    if (tags !== undefined) {
      updates.push('tags = ?');
      values.push(typeof tags === 'string' ? tags : JSON.stringify(tags));
    }
    if (read_time !== undefined) { updates.push('read_time = ?'); values.push(read_time); }
    if (status !== undefined) { updates.push('status = ?'); values.push(status); }
    if (rejection_reason !== undefined) { updates.push('rejection_reason = ?'); values.push(rejection_reason); }
    if (card_summary !== undefined) { updates.push('card_summary = ?'); values.push(card_summary); }
    if (focus_keyword !== undefined) { updates.push('focus_keyword = ?'); values.push(focus_keyword); }
    if (meta_description !== undefined) { updates.push('meta_description = ?'); values.push(meta_description); }
    if (writer_name !== undefined) { updates.push('writer_name = ?'); values.push(writer_name); }
    if (image !== undefined) { updates.push('image = ?'); values.push(image); }
    if (image_caption !== undefined) { updates.push('image_caption = ?'); values.push(image_caption); }
    if (image_credit !== undefined) { updates.push('image_credit = ?'); values.push(image_credit); }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields provided for update' }, { status: 400 });
    }

    values.push(id);
    let whereClause = 'WHERE id = ?';

    if (writer_email) {
      whereClause += ' AND writer_email = ?';
      values.push(writer_email);
    }

    const sql = `UPDATE articles SET ${updates.join(', ')} ${whereClause}`;
    const [result]: any = await pool.execute(sql, values);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Article not found or unauthorized' },
        { status: 404 }
      );
    }

    if (pending_images && pending_images.length > 0) {
      for (const img of pending_images) {
        try {
          await pool.execute(
            `INSERT INTO article_images (url, filename, uploader_email, caption, credit, seo_keywords)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [img.url, img.filename, writer_email, img.caption, img.credit, img.seo_keywords]
          );
        } catch (dbErr) {
          console.warn('[DB] Failed to record pending image:', dbErr);
        }
      }
    }

    return NextResponse.json({
      message: 'Article updated successfully in database',
      id,
    });
  } catch (error: any) {
    console.error('[PUT /api/articles Error]:', error);
    return NextResponse.json(
      { error: 'Failed to update article in database', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/articles?id=...&email=...&action=permanent|trash
export async function DELETE(request: Request) {
  try {
    await ensureArticlesTable();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const email = searchParams.get('email');
    const action = searchParams.get('action') || 'trash'; // 'trash' = soft delete, 'permanent' = hard delete

    if (!id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
    }

    if (action === 'permanent') {
      let sql = 'DELETE FROM articles WHERE id = ?';
      const params: any[] = [id];
      if (email) {
        sql += ' AND writer_email = ?';
        params.push(email);
      }
      await pool.execute(sql, params);
      return NextResponse.json({ message: 'Article permanently deleted from database', id });
    } else {
      // Soft delete: move to trash status
      let sql = 'UPDATE articles SET status = "trash" WHERE id = ?';
      const params: any[] = [id];
      if (email) {
        sql += ' AND writer_email = ?';
        params.push(email);
      }
      await pool.execute(sql, params);
      return NextResponse.json({ message: 'Article moved to trash in database', id });
    }
  } catch (error: any) {
    console.error('[DELETE /api/articles Error]:', error);
    return NextResponse.json(
      { error: 'Failed to delete article in database', details: error.message },
      { status: 500 }
    );
  }
}
