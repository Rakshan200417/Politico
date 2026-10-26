import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { listFolderFiles, deleteFromB2 } from '@/lib/b2Storage';
import { createDatabaseBackup } from '@/lib/backupService';
import { checkAndRunAutomated24hBackup } from '@/app/api/cron/daily-backup/route';

export const runtime = 'nodejs';

// GET: List all database backups stored in Backblaze B2 database-backups/ folder
export async function GET() {
  try {
    // Automatically evaluate if 24 hours have elapsed since the last backup
    try {
      await checkAndRunAutomated24hBackup();
    } catch (checkErr) {
      console.warn('[database-backups] 24h auto-backup check skipped:', checkErr);
    }

    const files = await listFolderFiles('database-backups');
    const backups = files.map((file, idx) => {
      const parts = file.key.split('/');
      const filename = parts[parts.length - 1];
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      
      const dateStr = file.lastModified
        ? new Date(file.lastModified).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'Recent';

      return {
        id: `b2_${idx}_${filename}`,
        filename,
        key: file.key,
        date: dateStr,
        size: `${sizeMB} MB`,
        url: file.url,
        source: 'Backblaze B2',
        status: 'available',
      };
    });

    return NextResponse.json({ success: true, backups }, { status: 200 });
  } catch (error: any) {
    console.error('[database-backups] Failed to list B2 backups:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Generate a new real MySQL database JSON snapshot and upload it to Backblaze B2 database-backups/
export async function POST() {
  try {
    const backup = await createDatabaseBackup('manual');

    return NextResponse.json({
      success: true,
      message: 'Database snapshot backed up to Backblaze B2 successfully!',
      backup,
    }, { status: 200 });
  } catch (error: any) {
    console.error('[database-backups] Failed to create B2 backup:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Delete a backup from Backblaze B2
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    if (!key) {
      return NextResponse.json({ success: false, error: 'Key is required' }, { status: 400 });
    }

    await deleteFromB2(key);
    return NextResponse.json({ success: true, message: `Backup ${key} deleted from Backblaze B2` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
