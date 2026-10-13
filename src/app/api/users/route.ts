import { NextResponse } from 'next/server';
import pool from '@/lib/db';

const DEFAULT_ADMIN_EMAIL = 'akramyoonos006@gmail.com';
const DEFAULT_ADMIN_PASS = 'pass123#';

async function ensureDefaultAdmin() {
  try {
    const [rows]: any = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [DEFAULT_ADMIN_EMAIL]
    );
    if (rows.length === 0) {
      await pool.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Default Admin', DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASS, 'admin']
      );
    }
  } catch (err) {
    console.warn('Could not auto-ensure default admin in users table:', err);
  }
}

// GET /api/users
export async function GET() {
  try {
    await ensureDefaultAdmin();

    const [rows] = await pool.query(`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.role, 
        COALESCE(NULLIF(pd.avatar_url, ''), NULLIF(u.avatar_url, ''), '') AS avatar_url,
        COALESCE(pd.bio, '') AS bio,
        COALESCE(pd.linkedin_profile, '') AS linkedin_profile
      FROM users u
      LEFT JOIN profile_details pd ON u.email = pd.email
      ORDER BY u.created_at DESC
    `);
    return NextResponse.json({ users: rows });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST /api/users
export async function POST(request: Request) {
  try {
    await ensureDefaultAdmin();

    const { name, email, password, role, loggedInEmail } = await request.json();
    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Only default admin can create another admin
    if (role === 'admin' && loggedInEmail !== DEFAULT_ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Only default admin can create admin users' }, { status: 403 });
    }

    await pool.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name || '', email, password, role]
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error adding user:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to add user' }, { status: 500 });
  }
}

// DELETE /api/users?id=X&loggedInEmail=...
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const loggedInUserEmail = searchParams.get('loggedInEmail');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Check who we are deleting
    const [userRows]: any = await pool.execute('SELECT email, role FROM users WHERE id = ?', [id]);
    if (userRows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const userToDelete = userRows[0];

    // No one can delete default admin
    if (userToDelete.email === DEFAULT_ADMIN_EMAIL || userToDelete.email === 'admin@example.com') {
      return NextResponse.json({ error: 'Cannot delete the default admin' }, { status: 403 });
    }

    // Normal admin can ONLY delete reader and writer
    if (loggedInUserEmail !== DEFAULT_ADMIN_EMAIL) {
      if (userToDelete.role === 'admin') {
        return NextResponse.json({ error: 'Normal admin can only delete reader and writer accounts' }, { status: 403 });
      }
    }

    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}

// PUT /api/users
export async function PUT(request: Request) {
  try {
    const { id, name, email, password, role, loggedInEmail } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Check who we are editing
    const [userRows]: any = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    if (userRows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const userToUpdate = userRows[0];

    // No one can edit default admin data except default admin themselves
    const isTargetDefaultAdmin = userToUpdate.email === DEFAULT_ADMIN_EMAIL || userToUpdate.email === 'admin@example.com';
    if (isTargetDefaultAdmin && loggedInEmail !== DEFAULT_ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Cannot edit default admin account' }, { status: 403 });
    }

    // Cannot demote default admin role
    const newRole = role || userToUpdate.role;
    if (isTargetDefaultAdmin && newRole !== 'admin') {
      return NextResponse.json({ error: 'Cannot change default admin role' }, { status: 403 });
    }

    // Normal admin can ONLY edit reader and writer data (or their own name/password)
    if (loggedInEmail !== DEFAULT_ADMIN_EMAIL) {
      if (userToUpdate.role === 'admin' && userToUpdate.email !== loggedInEmail) {
        return NextResponse.json({ error: 'Normal admin can only edit reader and writer accounts' }, { status: 403 });
      }
      if (newRole === 'admin' && userToUpdate.role !== 'admin') {
        return NextResponse.json({ error: 'Normal admin cannot promote users to admin' }, { status: 403 });
      }
    }

    // Check email uniqueness if email changed
    const targetEmail = email ? email.trim() : userToUpdate.email;
    if (targetEmail.toLowerCase() !== userToUpdate.email.toLowerCase()) {
      const [emailCheck]: any = await pool.execute('SELECT id FROM users WHERE email = ? AND id != ?', [targetEmail, id]);
      if (emailCheck.length > 0) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
      }
    }

    const newName = name !== undefined ? name : userToUpdate.name;

    // If password is provided and non-empty, update password as well
    if (password && password.trim() !== '') {
      await pool.execute(
        'UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?',
        [newName, targetEmail, password, newRole, id]
      );
    } else {
      await pool.execute(
        'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
        [newName, targetEmail, newRole, id]
      );
    }

    // Keep articles synced with updated user name and email
    try {
      await pool.execute(
        'UPDATE articles SET writer_name = ?, writer_email = ? WHERE writer_email = ? OR writer_name = ?',
        [newName, targetEmail, userToUpdate.email, userToUpdate.name]
      );
    } catch (e) {
      console.warn('Could not sync articles author info:', e);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating user:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
