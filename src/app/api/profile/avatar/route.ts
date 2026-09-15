import { NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';
import pool from '@/lib/db';

export const runtime = 'nodejs';

async function safelyDeleteFile(urlPath: string) {
  if (!urlPath || typeof urlPath !== 'string') return;
  // Only delete files under /uploads/
  if (!urlPath.startsWith('/uploads/')) return;

  try {
    const relativePath = urlPath.replace(/^\//, '');
    const absolutePath = path.join(process.cwd(), 'public', relativePath);
    await unlink(absolutePath);
    console.log('[Avatar Cleanup] Deleted old avatar file from disk:', absolutePath);
  } catch (err: any) {
    // It's normal if the file was already deleted or doesn't exist on disk
    console.warn('[Avatar Cleanup] File deletion note:', err?.message || err);
  }
}

async function ensureProfileDetailsTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS profile_details (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        full_name VARCHAR(255) DEFAULT '',
        bio TEXT,
        linkedin_profile VARCHAR(500) DEFAULT '',
        avatar_url TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  } catch (err) {
    console.warn('[DB] ensureProfileDetailsTable warning:', err);
  }
}

// DELETE /api/profile/avatar - Instantly removes avatar and resets to default icon
export async function DELETE(request: Request) {
  try {
    await ensureProfileDetailsTable();
    const body = await request.json();
    const { email, oldAvatarUrl } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    let targetOldAvatar = oldAvatarUrl || '';

    // If oldAvatarUrl wasn't provided, fetch current avatar_url from database
    if (!targetOldAvatar) {
      try {
        const [rows]: any = await pool.execute(
          'SELECT avatar_url FROM profile_details WHERE email = ? LIMIT 1',
          [email]
        );
        if (rows && rows.length > 0 && rows[0].avatar_url) {
          targetOldAvatar = rows[0].avatar_url;
        } else {
          const [userRows]: any = await pool.execute(
            'SELECT avatar_url FROM users WHERE email = ? LIMIT 1',
            [email]
          );
          if (userRows && userRows.length > 0 && userRows[0].avatar_url) {
            targetOldAvatar = userRows[0].avatar_url;
          }
        }
      } catch (e) {
        console.warn('Could not query previous avatar for deletion:', e);
      }
    }

    // 1. Instantly clear avatar_url in profile_details table
    try {
      await pool.execute(
        `INSERT INTO profile_details (email, avatar_url)
         VALUES (?, '')
         ON DUPLICATE KEY UPDATE avatar_url = ''`,
        [email]
      );
    } catch (e) {
      console.warn('[DB] Failed to update profile_details avatar:', e);
    }

    // 2. Instantly clear avatar_url in users table
    try {
      await pool.execute(
        'UPDATE users SET avatar_url = ? WHERE email = ?',
        ['', email]
      );
    } catch (e) {
      console.warn('[DB] Failed to update users avatar:', e);
    }

    // 3. Delete old image entry from article_images table
    if (targetOldAvatar) {
      try {
        await pool.execute(
          'DELETE FROM article_images WHERE url = ?',
          [targetOldAvatar]
        );
      } catch (e) {
        console.warn('[DB] Failed to delete from article_images:', e);
      }

      // 4. Delete old file from public/uploads/
      await safelyDeleteFile(targetOldAvatar);
    }

    return NextResponse.json({
      success: true,
      message: 'Avatar instantly deleted from database and filesystem',
      avatarUrl: '',
    });
  } catch (error: any) {
    console.error('Delete avatar error:', error);
    return NextResponse.json({ error: 'Failed to delete avatar: ' + error.message }, { status: 500 });
  }
}

// POST /api/profile/avatar - Instantly updates avatar and deletes previous image on DB & disk
export async function POST(request: Request) {
  try {
    await ensureProfileDetailsTable();
    const body = await request.json();
    const { email, avatarUrl, oldAvatarUrl } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Determine old avatar if not explicitly passed
    let previousAvatar = oldAvatarUrl || '';
    if (!previousAvatar) {
      try {
        const [rows]: any = await pool.execute(
          'SELECT avatar_url FROM profile_details WHERE email = ? LIMIT 1',
          [email]
        );
        if (rows && rows.length > 0 && rows[0].avatar_url) {
          previousAvatar = rows[0].avatar_url;
        }
      } catch (e) {
        console.warn('Could not query previous avatar:', e);
      }
    }

    // 1. Instantly update profile_details table
    try {
      await pool.execute(
        `INSERT INTO profile_details (email, avatar_url)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE avatar_url = VALUES(avatar_url)`,
        [email, avatarUrl || '']
      );
    } catch (e) {
      console.warn('[DB] Failed to update profile_details avatar:', e);
    }

    // 2. Instantly update users table
    try {
      await pool.execute(
        'UPDATE users SET avatar_url = ? WHERE email = ?',
        [avatarUrl || '', email]
      );
    } catch (e) {
      console.warn('[DB] Failed to update users avatar:', e);
    }

    // 3. Delete previous old avatar from article_images and disk (if it's different)
    if (previousAvatar && previousAvatar !== avatarUrl) {
      try {
        await pool.execute(
          'DELETE FROM article_images WHERE url = ?',
          [previousAvatar]
        );
      } catch (e) {
        console.warn('[DB] Failed to delete old avatar record:', e);
      }

      await safelyDeleteFile(previousAvatar);
    }

    return NextResponse.json({
      success: true,
      message: 'New avatar saved and old image deleted from database',
      avatarUrl: avatarUrl || '',
    });
  } catch (error: any) {
    console.error('Update avatar error:', error);
    return NextResponse.json({ error: 'Failed to update avatar: ' + error.message }, { status: 500 });
  }
}
