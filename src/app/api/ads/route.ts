import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  try {
    const [rows]: any = await pool.execute('SELECT * FROM ads ORDER BY id ASC');
    return NextResponse.json({ ads: rows }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch ads', details: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, link, active, image } = body;
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const updates = [];
    const values = [];
    
    if (link !== undefined) { updates.push('link = ?'); values.push(link); }
    if (active !== undefined) { updates.push('active = ?'); values.push(active); }
    if (image !== undefined) { updates.push('image = ?'); values.push(image); }
    
    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields provided to update' }, { status: 400 });
    }
    
    values.push(id);
    const sql = `UPDATE ads SET ${updates.join(', ')} WHERE id = ?`;
    await pool.execute(sql, values);
    
    return NextResponse.json({ message: 'Ad updated' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update ad', details: error.message }, { status: 500 });
  }
}
