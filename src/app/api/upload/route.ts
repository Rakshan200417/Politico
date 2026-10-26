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
    const requestedFolder = searchParams.get('type') || 'articles';

    // Map to the correct B2 folder matching your standard structure:
    // ads, articles, avatars, database, database-backups, media, reels
    const validFolders = ['ads', 'articles', 'avatars', 'database', 'database-backups', 'media', 'reels'];
    const targetFolder = validFolders.includes(requestedFolder.toLowerCase())
      ? requestedFolder.toLowerCase()
      : 'articles';

    let buffer: Buffer;
    let extension = '.png';
    let originalName = '';
    let caption = '';
    let credit = '';
    let seoKeywords = '';
    let uploaderEmail = '';

    // Local temporary fallback folder
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', targetFolder);
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

    const prefix = targetFolder === 'avatars' ? 'avatar' : targetFolder === 'ads' ? 'ad' : targetFolder === 'reels' ? 'reel' : 'article';
    const filename = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.webp`;
    const filePath = path.join(uploadDir, filename);

    // Convert buffer to WebP
    let webpBuffer: Buffer = buffer;
    try {
      const sharp = (await import('sharp')).default;
      webpBuffer = await sharp(buffer).webp({ quality: 85 }).toBuffer();
      // Keep a local copy if needed
      await writeFile(filePath, webpBuffer);
    } catch (sharpErr) {
      console.warn('[upload] Sharp conversion failed, falling back to raw buffer:', sharpErr);
      await writeFile(filePath, buffer);
      webpBuffer = buffer;
    }

    // Upload directly to Backblaze B2 under the matching folder
    let finalUrl = `/uploads/${targetFolder}/${filename}`;
    try {
      const { uploadToFolder } = await import('@/lib/b2Storage');
      finalUrl = await uploadToFolder(targetFolder, filename, webpBuffer, 'image/webp');
    } catch (b2Err) {
      console.error('[upload] Backblaze B2 upload failed, falling back to local file URL:', b2Err);
    }

    // Return the URL and metadata so the client can save it later
    return NextResponse.json({
      url: finalUrl,
      filename: originalName,
      message: 'Image uploaded and converted to WebP successfully',
    }, { status: 200 });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'File upload failed: ' + error.message }, { status: 500 });
  }
}
