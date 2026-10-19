export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import pool from '@/lib/db';
import { processArticleImagesForPublish, convertToWebP } from '@/lib/imageConverter';

let isArticlesTableEnsured = false;

// Ensure table exists and has all required columns
async function ensureArticlesTable() {
  if (isArticlesTableEnsured) return;
  
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

    // Ensure title can hold full length headlines without truncation
    try {
      await pool.query(`ALTER TABLE articles MODIFY COLUMN title TEXT NOT NULL`);
    } catch (e) {}

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
      { name: 'image', definition: 'LONGTEXT' },
      { name: 'image_caption', definition: 'TEXT' },
      { name: 'image_credit', definition: 'VARCHAR(255) DEFAULT ""' },
      { name: 'is_sponsored', definition: 'BOOLEAN DEFAULT FALSE' },
      { name: 'homepage_placement', definition: 'VARCHAR(255) DEFAULT ""' },
      { name: 'targeted_email_distribution', definition: 'TEXT' },
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
    
    isArticlesTableEnsured = true;
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
    const search = searchParams.get('search');

    let query = `
      SELECT 
        a.*,
        COUNT(c.id) AS comments_count
      FROM articles a
      LEFT JOIN comments c ON a.slug = c.article_slug
      WHERE 1=1
    `;
    const params: any[] = [];

    if (email) {
      const nameParam = searchParams.get('name') || '';
      if (nameParam) {
        query += ' AND (a.writer_email = ? OR a.writer_name = ?)';
        params.push(email, nameParam);
      } else {
        query += ' AND (a.writer_email = ? OR a.writer_name = ?)';
        params.push(email, email.split('@')[0]);
      }
    }
    if (status) {
      query += ' AND a.status = ?';
      params.push(status);
    }
    if (search) {
      query += ' AND (a.title LIKE ? OR a.writer_name LIKE ? OR a.deck LIKE ? OR a.category LIKE ?)';
      const likeSearch = `%${search}%`;
      params.push(likeSearch, likeSearch, likeSearch, likeSearch);
    }

    query += ' GROUP BY a.id ORDER BY a.updated_at DESC';

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
      category = 'World',
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
      homepage_placement = '',
      targeted_email_distribution = '',
      is_sponsored = false,
    } = body;

    if (!writer_email || !title) {
      return NextResponse.json(
        { error: 'Writer email and article title are required' },
        { status: 400 }
      );
    }

    let finalImage = image;
    let finalContent = content;

    // Convert article image and content images to WebP when approved/published
    if (status === 'published') {
      try {
        const processed = await processArticleImagesForPublish({
          image: finalImage,
          content: finalContent,
        });
        if (processed.image !== undefined) finalImage = processed.image;
        if (processed.content !== undefined) finalContent = processed.content;
      } catch (convErr) {
        console.warn('[imageConverter] Post publish WebP conversion error:', convErr);
      }
    }

    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const subcategoriesJson = JSON.stringify(subcategories || []);
    const tagsJson = JSON.stringify(tags || []);

    const [result]: any = await pool.execute(
      `INSERT INTO articles (
        writer_email, writer_name, title, slug, deck, content,
        category, subcategories, tags, read_time, status,
        card_summary, focus_keyword, meta_description,
        image, image_caption, image_credit, homepage_placement, targeted_email_distribution, is_sponsored
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        writer_email,
        writer_name,
        title,
        generatedSlug,
        deck,
        finalContent,
        category,
        subcategoriesJson,
        tagsJson,
        read_time,
        status,
        card_summary,
        focus_keyword,
        meta_description,
        finalImage,
        image_caption,
        image_credit,
        homepage_placement,
        targeted_email_distribution,
        is_sponsored,
      ]
    );

    const insertedId = result.insertId;

    if (pending_images && pending_images.length > 0) {
      for (const img of pending_images) {
        try {
          const imgUrl = status === 'published' ? await convertToWebP(img.url) : img.url;
          await pool.execute(
            `INSERT INTO article_images (url, filename, uploader_email, caption, credit, seo_keywords)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [imgUrl, img.filename, writer_email, img.caption, img.credit, img.seo_keywords]
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
          content: finalContent,
          category,
          subcategories,
          tags,
          read_time,
          status,
          card_summary,
          focus_keyword,
          meta_description,
          image: finalImage,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[POST /api/articles Error]:', error);
    try {
      require('fs').appendFileSync('C:/Users/EX BOOK/Desktop/Jadetimes Internship/Politico/db_error.log', new Date().toISOString() + ' ' + error.message + '\n');
    } catch (e) {}
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
      homepage_placement,
      targeted_email_distribution,
      is_sponsored,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Article ID is required for update' }, { status: 400 });
    }

    let finalImage = image;
    let finalContent = content;

    // When status is 'published' (admin approves), convert image(s) to WebP format
    if (status === 'published') {
      try {
        // If image or content weren't passed in this PUT request, fetch existing values from DB
        if (finalImage === undefined || finalContent === undefined) {
          const [existingRows]: any = await pool.execute(
            'SELECT image, content FROM articles WHERE id = ?',
            [id]
          );
          if (existingRows && existingRows.length > 0) {
            if (finalImage === undefined) finalImage = existingRows[0].image || '';
            if (finalContent === undefined) finalContent = existingRows[0].content || '';
          }
        }

        const processed = await processArticleImagesForPublish({
          image: finalImage,
          content: finalContent,
        });
        if (processed.image !== undefined) finalImage = processed.image;
        if (processed.content !== undefined) finalContent = processed.content;
      } catch (convErr) {
        console.warn('[imageConverter] PUT publish WebP conversion error:', convErr);
      }
    }

    // Dynamic field update builder
    const updates: string[] = [];
    const values: any[] = [];

    if (title !== undefined) { updates.push('title = ?'); values.push(title); }
    if (slug !== undefined) { updates.push('slug = ?'); values.push(slug); }
    if (deck !== undefined) { updates.push('deck = ?'); values.push(deck); }
    if (finalContent !== undefined && (content !== undefined || status === 'published')) {
      updates.push('content = ?');
      values.push(finalContent);
    } else if (content !== undefined) {
      updates.push('content = ?');
      values.push(content);
    }
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
    if (finalImage !== undefined && (image !== undefined || status === 'published')) {
      updates.push('image = ?');
      values.push(finalImage);
    } else if (image !== undefined) {
      updates.push('image = ?');
      values.push(image);
    }
    if (image_caption !== undefined) { updates.push('image_caption = ?'); values.push(image_caption); }
    if (image_credit !== undefined) { updates.push('image_credit = ?'); values.push(image_credit); }
    if (homepage_placement !== undefined) { updates.push('homepage_placement = ?'); values.push(homepage_placement); }
    if (targeted_email_distribution !== undefined) { updates.push('targeted_email_distribution = ?'); values.push(targeted_email_distribution); }
    if (is_sponsored !== undefined) { updates.push('is_sponsored = ?'); values.push(is_sponsored); }
    updates.push('updated_at = NOW()');

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields provided for update' }, { status: 400 });
    }

    values.push(id);
    let whereClause = 'WHERE id = ?';

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
          const imgUrl = status === 'published' ? await convertToWebP(img.url) : img.url;
          await pool.execute(
            `INSERT INTO article_images (url, filename, uploader_email, caption, credit, seo_keywords)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [imgUrl, img.filename, writer_email, img.caption, img.credit, img.seo_keywords]
          );
        } catch (dbErr) {
          console.warn('[DB] Failed to record pending image:', dbErr);
        }
      }
    }

    // Invalidate the cache for the home page and categories so changes show up immediately
    revalidatePath('/', 'layout');

    return NextResponse.json({
      message: 'Article updated successfully in database',
      id,
      image: finalImage,
      content: finalContent,
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
      await pool.execute('DELETE FROM articles WHERE id = ?', [id]);
      revalidatePath('/', 'layout');
      return NextResponse.json({ message: 'Article permanently deleted from database', id });
    } else {
      // Soft delete: move to trash status
      await pool.execute('UPDATE articles SET status = "trash" WHERE id = ?', [id]);
      revalidatePath('/', 'layout');
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
