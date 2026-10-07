import { NextResponse } from 'next/server';
import pool from '@/lib/db';

let isContactTableEnsured = false;

async function ensureContactTable() {
  if (isContactTableEnsured) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        name VARCHAR(255),
        company VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        whatsapp VARCHAR(50),
        inquiry_type VARCHAR(100),
        message TEXT,
        status VARCHAR(50) DEFAULT 'New'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    isContactTableEnsured = true;
  } catch (err) {
    console.warn('[DB] Could not ensure contact_submissions table:', err);
  }
}

export async function GET(request: Request) {
  try {
    await ensureContactTable();
    const [rows]: any = await pool.execute('SELECT * FROM contact_submissions ORDER BY created_at DESC');
    return NextResponse.json({ submissions: rows }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch contact submissions', details: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await ensureContactTable();
    const body = await request.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 });
    }
    await pool.execute('UPDATE contact_submissions SET status = ? WHERE id = ?', [status, id]);
    return NextResponse.json({ message: 'Status updated' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update status', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await ensureContactTable();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    await pool.execute('DELETE FROM contact_submissions WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete', details: error.message }, { status: 500 });
  }
}
