import { NextResponse } from 'next/server';
import pool from '@/lib/db';

let isAdvertiseTableEnsured = false;

async function ensureAdvertiseTable() {
  if (isAdvertiseTableEnsured) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS advertise_leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        name VARCHAR(255),
        company VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        whatsapp VARCHAR(50),
        service_option VARCHAR(100),
        requirements TEXT,
        status VARCHAR(50) DEFAULT 'New'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    isAdvertiseTableEnsured = true;
  } catch (err) {
    console.warn('[DB] Could not ensure advertise_leads table:', err);
  }
}

export async function GET(request: Request) {
  try {
    await ensureAdvertiseTable();
    const [rows]: any = await pool.execute('SELECT * FROM advertise_leads ORDER BY created_at DESC');
    return NextResponse.json({ leads: rows }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch advertise leads', details: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await ensureAdvertiseTable();
    const body = await request.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 });
    }
    await pool.execute('UPDATE advertise_leads SET status = ? WHERE id = ?', [status, id]);
    return NextResponse.json({ message: 'Status updated' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update status', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await ensureAdvertiseTable();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    await pool.execute('DELETE FROM advertise_leads WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete', details: error.message }, { status: 500 });
  }
}
