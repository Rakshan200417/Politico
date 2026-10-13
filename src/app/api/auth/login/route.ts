import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const DEFAULT_ADMIN_EMAIL = 'akramyoonos006@gmail.com';
    const DEFAULT_ADMIN_PASS = 'pass123#';

    if (email === DEFAULT_ADMIN_EMAIL && password === DEFAULT_ADMIN_PASS) {
      try {
        await pool.execute(
          `INSERT INTO users (name, email, password, role)
           VALUES ('Default Admin', ?, ?, 'admin')
           ON DUPLICATE KEY UPDATE password = ?, role = 'admin'`,
          [DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASS, DEFAULT_ADMIN_PASS]
        );
      } catch (e) {}
    }

    // Connect to XAMPP MySQL and query the user
    const [rows]: any = await pool.execute(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = rows[0];

    // In a production app, you MUST use a library like bcrypt to hash and compare passwords.
    // For this XAMPP test setup, we compare directly to the 'password' column:
    const isValid = password === user.password; 

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Success! Return user info (excluding password)
    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name || user.email.split('@')[0],
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url || '',
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { error: 'Internal server error connecting to the database' },
      { status: 500 }
    );
  }
}
