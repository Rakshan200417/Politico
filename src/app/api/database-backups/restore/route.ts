import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getObjectFromB2, uploadToFolder } from '@/lib/b2Storage';

export const runtime = 'nodejs';

// POST: Restore database from either a Backblaze B2 key or uploaded JSON snapshot payload
export async function POST(request: Request) {
  let connection;
  try {
    const contentType = request.headers.get('content-type') || '';
    let snapshotData: any = null;
    let backupName = 'uploaded_snapshot.json';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json({ success: false, error: 'No JSON file provided' }, { status: 400 });
      }
      backupName = file.name;
      const fileText = await file.text();
      snapshotData = JSON.parse(fileText);

      // Optionally also save the uploaded file to B2 database-backups so it's backed up in cloud
      try {
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        await uploadToFolder('database-backups', backupName, fileBuffer, 'application/json');
      } catch (uploadErr) {
        console.warn('[restore] Could not mirror uploaded file to B2:', uploadErr);
      }
    } else {
      const body = await request.json();
      const { key, snapshot } = body;

      if (key) {
        backupName = key.split('/').pop() || key;
        const buffer = await getObjectFromB2(key);
        const fileText = buffer.toString('utf-8');
        snapshotData = JSON.parse(fileText);
      } else if (snapshot) {
        snapshotData = snapshot;
      } else {
        return NextResponse.json(
          { success: false, error: 'Either "key" or snapshot data is required' },
          { status: 400 }
        );
      }
    }

    if (!snapshotData || !snapshotData.tables) {
      return NextResponse.json(
        { success: false, error: 'Invalid backup file structure: missing tables object.' },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');

    const restoredTables: string[] = [];

    for (const [tableName, rowsData] of Object.entries(snapshotData.tables)) {
      if (!Array.isArray(rowsData) || rowsData.length === 0) {
        continue;
      }

      // Check if table exists
      const [tableExists]: any = await connection.query(
        `SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
        [tableName]
      );
      if (!tableExists || tableExists.length === 0) {
        continue;
      }

      // Truncate table before restoring
      await connection.query(`TRUNCATE TABLE \`${tableName}\``);

      // Insert in chunks of 50 to avoid max_allowed_packet limits
      const chunkSize = 50;
      for (let i = 0; i < rowsData.length; i += chunkSize) {
        const chunk = rowsData.slice(i, i + chunkSize);
        for (const row of chunk) {
          const keys = Object.keys(row);
          if (keys.length === 0) continue;

          const columns = keys.map((k) => `\`${k}\``).join(', ');
          const placeholders = keys.map(() => '?').join(', ');
          const values = keys.map((k) => {
            const val = row[k];
            if (val === undefined) return null;
            if (typeof val === 'object' && val !== null) {
              return JSON.stringify(val);
            }
            return val;
          });

          const sql = `INSERT INTO \`${tableName}\` (${columns}) VALUES (${placeholders})`;
          await connection.query(sql, values);
        }
      }

      restoredTables.push(`${tableName} (${rowsData.length} records)`);
    }

    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    return NextResponse.json({
      success: true,
      message: `Database successfully restored from ${backupName}!`,
      restoredTables,
    });
  } catch (error: any) {
    if (connection) {
      try {
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
      } catch {
        // ignore
      }
    }
    console.error('[restore] Error during database restore:', error);
    return NextResponse.json({ success: false, error: error.message || 'Restore failed' }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
