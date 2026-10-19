import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Ensure table and standard ad slots exist
async function ensureAdsTable() {
  try {
    // 1. Create table if not exists with slot_key
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS ads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slot_key VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        slot_type VARCHAR(50) NOT NULL,
        dimensions VARCHAR(50) NOT NULL,
        description TEXT,
        active BOOLEAN DEFAULT TRUE,
        image LONGTEXT,
        action_type VARCHAR(50) DEFAULT 'External Link (URL)',
        link VARCHAR(500) DEFAULT '',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Add slot_key column if it doesn't exist on legacy tables
    try {
      await pool.execute(`ALTER TABLE ads ADD COLUMN slot_key VARCHAR(50) UNIQUE`);
    } catch {
      // Column may already exist
    }

    // Default slots matching user exact structure:
    // - Banner Ad: Shared across all pages (970 x 250)
    // - Ad 01 to Ad 05: Square ads (300 x 250) on Homepage
    // - Ad 06: Square ad (300 x 250) on Article Page
    // - Ad 07: Skyscraper/half-page ad (300 x 600) on Author Page
    // - Category In-Feed Banner: 970 x 250 on Category Page
    const defaultSlots = [
      {
        slot_key: 'banner_global',
        name: 'Top Banner Ad (Global - All Pages)',
        slot_type: 'banner',
        dimensions: '970 x 250',
        description: 'Displays in the beige gap header across all pages (Homepage, Category, Article pages).',
      },
      {
        slot_key: 'ad_01',
        name: 'Homepage Sidebar Top (Ad 01)',
        slot_type: 'home',
        dimensions: '300 x 250',
        description: 'Square ad slot displayed at the top of the homepage main right sidebar.',
      },
      {
        slot_key: 'ad_02',
        name: 'Homepage Middle Left Sidebar (Ad 02)',
        slot_type: 'home',
        dimensions: '300 x 250',
        description: 'Square ad slot displayed in the homepage middle section left column.',
      },
      {
        slot_key: 'ad_03',
        name: 'Homepage Middle Left Sticky (Ad 03)',
        slot_type: 'home',
        dimensions: '300 x 250',
        description: 'Square ad slot displayed right below Ad 02 in the homepage middle section.',
      },
      {
        slot_key: 'ad_04',
        name: 'Homepage Middle Right Sidebar (Ad 04)',
        slot_type: 'home',
        dimensions: '300 x 250',
        description: 'Square ad slot displayed in the homepage middle section right column.',
      },
      {
        slot_key: 'ad_05',
        name: 'Homepage Middle Right Sticky (Ad 05)',
        slot_type: 'home',
        dimensions: '300 x 250',
        description: 'Square ad slot displayed right below Ad 04 in the homepage middle section.',
      },
      {
        slot_key: 'ad_06',
        name: 'Article Page Sidebar (Ad 06)',
        slot_type: 'article',
        dimensions: '300 x 250',
        description: 'Square ad slot displayed in the right sidebar of every single article page above Related Stories.',
      },
      {
        slot_key: 'ad_07',
        name: 'Author Page Sidebar (Ad 07)',
        slot_type: 'author',
        dimensions: '300 x 600',
        description: 'Tall skyscraper ad slot displayed in the right sidebar of author profile pages.',
      },
      {
        slot_key: 'banner_category_mid',
        name: 'Category In-Feed Banner',
        slot_type: 'category',
        dimensions: '970 x 250',
        description: 'Wide horizontal banner displayed directly beneath top stories on Category pages.',
      },
    ];

    for (const slot of defaultSlots) {
      await pool.execute(
        `INSERT INTO ads (slot_key, name, slot_type, dimensions, description, active, image, action_type, link)
         VALUES (?, ?, ?, ?, ?, TRUE, '', 'External Link (URL)', '')
         ON DUPLICATE KEY UPDATE 
           name = VALUES(name),
           slot_type = VALUES(slot_type),
           dimensions = VALUES(dimensions),
           description = VALUES(description)`,
        [slot.slot_key, slot.name, slot.slot_type, slot.dimensions, slot.description]
      );
    }
  } catch (err) {
    console.error('Error ensuring ads table:', err);
  }
}

export async function GET(request: Request) {
  try {
    await ensureAdsTable();
    const { searchParams } = new URL(request.url);
    const slotKey = searchParams.get('slot_key');

    if (slotKey) {
      const [rows]: any = await pool.execute('SELECT * FROM ads WHERE slot_key = ? LIMIT 1', [slotKey]);
      if (rows.length > 0) {
        return NextResponse.json({ ad: rows[0] }, { status: 200 });
      }
      return NextResponse.json({ ad: null }, { status: 404 });
    }

    const [rows]: any = await pool.execute('SELECT * FROM ads ORDER BY id ASC');
    return NextResponse.json({ ads: rows }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch ads', details: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    let { id, slot_key, link, active, image } = body;
    if (!id && !slot_key) {
      return NextResponse.json({ error: 'ID or slot_key is required' }, { status: 400 });
    }

    // If an image is uploaded (e.g. data URL base64), convert it to WEBP format
    if (image && typeof image === 'string' && image.startsWith('data:image/')) {
      try {
        const sharp = (await import('sharp')).default;
        const match = image.match(/^data:image\/[a-zA-Z0-9+]+;base64,(.+)$/);
        if (match) {
          const inputBuffer = Buffer.from(match[1], 'base64');
          const webpBuffer = await sharp(inputBuffer).webp({ quality: 85 }).toBuffer();
          image = `data:image/webp;base64,${webpBuffer.toString('base64')}`;
        }
      } catch (sharpErr) {
        console.warn('[ads] Sharp WebP conversion failed, saving original:', sharpErr);
      }
    }
    
    const updates = [];
    const values = [];
    
    if (link !== undefined) { updates.push('link = ?'); values.push(link); }
    if (active !== undefined) { updates.push('active = ?'); values.push(active); }
    if (image !== undefined) { updates.push('image = ?'); values.push(image); }
    
    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields provided to update' }, { status: 400 });
    }
    
    if (id) {
      values.push(id);
      const sql = `UPDATE ads SET ${updates.join(', ')} WHERE id = ?`;
      await pool.execute(sql, values);
    } else {
      values.push(slot_key);
      const sql = `UPDATE ads SET ${updates.join(', ')} WHERE slot_key = ?`;
      await pool.execute(sql, values);
    }
    
    return NextResponse.json({ message: 'Ad updated', image }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update ad', details: error.message }, { status: 500 });
  }
}
