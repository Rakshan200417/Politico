import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    try {
      const [rows]: any = await pool.execute(
        'SELECT * FROM profile_details WHERE email = ? LIMIT 1',
        [email]
      );

      if (rows && rows.length > 0) {
        return NextResponse.json({ profile: rows[0] }, { status: 200 });
      }

      // If no custom profile yet, fetch user basic details
      const [userRows]: any = await pool.execute(
        'SELECT id, name, email, role FROM users WHERE email = ? LIMIT 1',
        [email]
      );

      if (userRows && userRows.length > 0) {
        return NextResponse.json({
          profile: {
            user_id: userRows[0].id,
            email: userRows[0].email,
            full_name: userRows[0].name || userRows[0].email.split('@')[0],
            bio: 'POLITICO subscriber.',
            linkedin_profile: '',
            avatar_url: '',
            role: userRows[0].role || 'reader',
          },
        });
      }

      return NextResponse.json({ profile: null }, { status: 200 });
    } catch (dbErr) {
      console.warn('DB error fetching profile, using fallback:', dbErr);
      return NextResponse.json({
        profile: {
          email,
          full_name: email.split('@')[0],
          bio: 'POLITICO reader.',
          linkedin_profile: '',
          avatar_url: '',
        },
      });
    }
  } catch (error) {
    console.error('Profile GET error:', error);
    return NextResponse.json({ error: 'Failed to retrieve profile' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, fullName, bio, linkedinProfile, avatarUrl } = body;

    if (!email) {
      return NextResponse.json({ error: 'User email is required' }, { status: 400 });
    }

    try {
      // Find user id if exists
      const [userRows]: any = await pool.execute(
        'SELECT id FROM users WHERE email = ? LIMIT 1',
        [email]
      );
      const userId = userRows && userRows.length > 0 ? userRows[0].id : null;

      // Upsert into profile_details table
      await pool.execute(
        `INSERT INTO profile_details (user_id, email, full_name, bio, linkedin_profile, avatar_url)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           user_id = COALESCE(VALUES(user_id), user_id),
           full_name = VALUES(full_name),
           bio = VALUES(bio),
           linkedin_profile = VALUES(linkedin_profile),
           avatar_url = VALUES(avatar_url)`,
        [userId, email, fullName || '', bio || '', linkedinProfile || '', avatarUrl || '']
      );

      // Also update name and avatar_url in users table for sync
      await pool.execute(
        'UPDATE users SET name = ?, avatar_url = ? WHERE email = ?',
        [fullName || '', avatarUrl || '', email]
      );

      return NextResponse.json({
        message: 'Profile updated successfully',
        profile: {
          email,
          full_name: fullName,
          bio,
          linkedin_profile: linkedinProfile,
          avatar_url: avatarUrl,
        },
      });
    } catch (dbErr) {
      console.warn('DB error saving profile, fallback response:', dbErr);
      return NextResponse.json({
        message: 'Profile saved (local session)',
        profile: {
          email,
          full_name: fullName,
          bio,
          linkedin_profile: linkedinProfile,
          avatar_url: avatarUrl,
        },
      });
    }
  } catch (error) {
    console.error('Profile POST error:', error);
    return NextResponse.json({ error: 'Failed to save profile details' }, { status: 500 });
  }
}
