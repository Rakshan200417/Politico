import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET /api/users
export async function GET() {
  try {
    const [rows] = await pool.query('SELECT id, name, email, role, avatar_url FROM users ORDER BY created_at DESC');
    return NextResponse.json({ users: rows });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST /api/users
export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();
    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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

// DELETE /api/users?id=X
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const loggedInUserEmail = searchParams.get('loggedInEmail');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Check who we are deleting
    const [userRows]: any = await pool.execute('SELECT email FROM users WHERE id = ?', [id]);
    if (userRows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const userToDelete = userRows[0];

    // Cannot delete default admin
    if (userToDelete.email === 'admin@example.com') {
      return NextResponse.json({ error: 'Cannot delete the default admin' }, { status: 403 });
    }

    // Only default admin can delete other admins
    if (loggedInUserEmail !== 'admin@example.com' && userToDelete.role === 'admin') {
      return NextResponse.json({ error: 'Only default admin can delete other admins' }, { status: 403 });
    }

    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
