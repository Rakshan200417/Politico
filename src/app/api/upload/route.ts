import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import pool from '@/lib/db';

export const runtime = 'nodejs';

async function ensureArticleImagesTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS article_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        url TEXT NOT NULL,
        filename VARCHAR(255),
        uploader_email VARCHAR(255) DEFAULT '',
        caption TEXT,
        credit VARCHAR(255) DEFAULT '',
        seo_keywords TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  } catch (err) {
    console.warn('[DB] Could not ensure article_images table:', err);
  }
}

export async function POST(request: Request) {
  try {
    await ensureArticleImagesTable();

    const contentType = request.headers.get('content-type') || '';
    const { searchParams } = new URL(request.url);
    const folderType = searchParams.get('type') || 'articles'; // default to articles

    let buffer: Buffer;
    let extension = '.png';
    let originalName = '';
    let caption = '';
    let credit = '';
    let seoKeywords = '';
    let uploaderEmail = '';

    // Ensure upload directory exists
    const subDir = folderType === 'avatars' ? 'avatars' : 'articles';
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', subDir);
    await mkdir(uploadDir, { recursive: true });

    if (contentType.includes('application/json')) {
      const body = await request.json();
      const {
        image,
        name,
        caption: c = '',
        credit: cr = '',
        seo_keywords = '',
        uploader_email = '',
      } = body;

      caption = c;
      credit = cr;
      seoKeywords = Array.isArray(seo_keywords) ? seo_keywords.join(', ') : seo_keywords;
      uploaderEmail = uploader_email;

      if (!image) {
        return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
      }

      originalName = name || 'image';
      if (name) {
        extension = path.extname(name) || '.png';
      }

      // Handle data URL format: data:image/jpeg;base64,...
      const match = image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (match) {
        extension = `.${match[1].replace('+xml', '')}`;
        buffer = Buffer.from(match[2], 'base64');
      } else {
        buffer = Buffer.from(image, 'base64');
      }
    } else {
      // FormData upload
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      caption = (formData.get('caption') as string) || '';
      credit = (formData.get('credit') as string) || '';
      seoKeywords = (formData.get('seo_keywords') as string) || '';
      uploaderEmail = (formData.get('uploader_email') as string) || '';

      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }

      originalName = file.name;
      extension = path.extname(file.name) || '.png';
      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
    }

    const prefix = folderType === 'avatars' ? 'avatar' : 'article';
    const filename = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${extension}`;
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${subDir}/${filename}`;

    // Save image metadata into article_images table in MySQL
    try {
      await pool.execute(
        `INSERT INTO article_images (url, filename, uploader_email, caption, credit, seo_keywords)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [publicUrl, originalName, uploaderEmail, caption, credit, seoKeywords]
      );
    } catch (dbErr) {
      console.warn('[DB] Failed to record image in article_images table:', dbErr);
    }

    return NextResponse.json({
      url: publicUrl,
      filename: originalName,
      message: 'Image uploaded and saved to database successfully',
    }, { status: 200 });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'File upload failed: ' + error.message }, { status: 500 });
  }
}
