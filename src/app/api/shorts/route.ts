import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const runtime = 'nodejs';

// Ensure table exists with standard 4 dedicated slots
async function ensureShortsTable() {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS shorts_reels (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slot_number INT UNIQUE NOT NULL,
        title VARCHAR(500) NOT NULL,
        video_url TEXT NOT NULL,
        platform VARCHAR(50) DEFAULT 'YouTube Shorts',
        thumbnail_url LONGTEXT,
        duration VARCHAR(20) DEFAULT '0:45',
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Default 4 initial placeholder slots
    const defaultSlots = [
      {
        slot_number: 1,
        title: "Anthropic's Sarah Heck discusses the AI race, American voters and more",
        video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        platform: "YouTube",
        thumbnail_url: "https://picsum.photos/seed/91/800/600",
        duration: "0:45",
        active: 1
      },
      {
        slot_number: 2,
        title: "Rep. Greg Casar talks AI reform during Trump Presidency",
        video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        platform: "YouTube",
        thumbnail_url: "https://picsum.photos/seed/92/800/600",
        duration: "0:38",
        active: 1
      },
      {
        slot_number: 3,
        title: "Hugging Face CEO talks cyberattacks, regulatory enforcement and China",
        video_url: "https://rumble.com",
        platform: "Rumble",
        thumbnail_url: "https://picsum.photos/seed/93/800/600",
        duration: "0:41",
        active: 1
      },
      {
        slot_number: 4,
        title: "Gina Raimondo: 'You\\'re not going to beat China if you have destabilizing unemployment'",
        video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        platform: "YouTube",
        thumbnail_url: "https://picsum.photos/seed/94/800/600",
        duration: "0:52",
        active: 1
      }
    ];

    const [rows]: any = await pool.query('SELECT COUNT(*) as count FROM shorts_reels');
    if (rows && rows[0] && rows[0].count === 0) {
      for (const slot of defaultSlots) {
        await pool.execute(
          `INSERT INTO shorts_reels (slot_number, title, video_url, platform, thumbnail_url, duration, active)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [slot.slot_number, slot.title, slot.video_url, slot.platform, slot.thumbnail_url, slot.duration, slot.active]
        );
      }
    }
  } catch (err) {
    console.warn('[DB] Could not ensure shorts_reels table:', err);
  }
}

// GET all shorts/reels ordered by slot_number (1 to 4)
export async function GET(request: Request) {
  try {
    await ensureShortsTable();
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active_only') === 'true';

    let query = 'SELECT * FROM shorts_reels';
    let params: any[] = [];
    if (activeOnly) {
      query += ' WHERE active = 1';
    }
    query += ' ORDER BY slot_number ASC';

    const [rows]: any = await pool.query(query, params);
    return NextResponse.json({ success: true, videos: rows || [] });
  } catch (error: any) {
    console.error('Failed to fetch shorts/reels:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Add or replace video in a specific slot (1 to 4)
export async function POST(request: Request) {
  try {
    await ensureShortsTable();
    const body = await request.json();
    const {
      slot_number,
      title,
      video_url,
      platform = 'YouTube',
      thumbnail_url = '',
      duration = '0:45',
      active = 1,
    } = body;

    const slotNum = parseInt(slot_number, 10);
    if (!slotNum || slotNum < 1 || slotNum > 4) {
      return NextResponse.json({ success: false, error: 'Slot number must be between 1 and 4' }, { status: 400 });
    }

    if (!video_url || !title) {
      return NextResponse.json({ success: false, error: 'Video URL and Title are required' }, { status: 400 });
    }

    const isActiveVal = active === true || active === 1 || active === '1' || active === 'Active' ? 1 : 0;

    // Strict 1 video per slot: REPLACE / UPSERT
    await pool.execute(
      `INSERT INTO shorts_reels (slot_number, title, video_url, platform, thumbnail_url, duration, active)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         title = VALUES(title),
         video_url = VALUES(video_url),
         platform = VALUES(platform),
         thumbnail_url = VALUES(thumbnail_url),
         duration = VALUES(duration),
         active = VALUES(active),
         updated_at = CURRENT_TIMESTAMP`,
      [slotNum, title.trim(), video_url.trim(), platform, thumbnail_url, duration, isActiveVal]
    );

    return NextResponse.json({ success: true, message: `Slot #${slotNum} updated successfully` });
  } catch (error: any) {
    console.error('Failed to save short/reel:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: Update video details or toggle active/inactive status
export async function PUT(request: Request) {
  try {
    await ensureShortsTable();
    const body = await request.json();
    const { id, slot_number, title, video_url, platform, thumbnail_url, duration, active } = body;

    if (!id && !slot_number) {
      return NextResponse.json({ success: false, error: 'ID or Slot number is required' }, { status: 400 });
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (title !== undefined) {
      updates.push('title = ?');
      params.push(title);
    }
    if (video_url !== undefined) {
      updates.push('video_url = ?');
      params.push(video_url);
    }
    if (platform !== undefined) {
      updates.push('platform = ?');
      params.push(platform);
    }
    if (thumbnail_url !== undefined) {
      updates.push('thumbnail_url = ?');
      params.push(thumbnail_url);
    }
    if (duration !== undefined) {
      updates.push('duration = ?');
      params.push(duration);
    }
    if (active !== undefined) {
      const activeVal = active === true || active === 1 || active === '1' || active === 'Active' ? 1 : 0;
      updates.push('active = ?');
      params.push(activeVal);
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, error: 'No fields to update' }, { status: 400 });
    }

    let query = `UPDATE shorts_reels SET ${updates.join(', ')} WHERE `;
    if (id) {
      query += 'id = ?';
      params.push(id);
    } else {
      query += 'slot_number = ?';
      params.push(slot_number);
    }

    await pool.execute(query, params);
    return NextResponse.json({ success: true, message: 'Video updated successfully' });
  } catch (error: any) {
    console.error('Failed to update short/reel:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Clear a slot (or delete row)
export async function DELETE(request: Request) {
  try {
    await ensureShortsTable();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const slotNumber = searchParams.get('slot_number');

    if (id) {
      await pool.execute('DELETE FROM shorts_reels WHERE id = ?', [id]);
    } else if (slotNumber) {
      await pool.execute('DELETE FROM shorts_reels WHERE slot_number = ?', [slotNumber]);
    } else {
      return NextResponse.json({ success: false, error: 'ID or slot_number required' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Video slot cleared successfully' });
  } catch (error: any) {
    console.error('Failed to delete short/reel:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
