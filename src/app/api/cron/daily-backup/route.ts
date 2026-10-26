import { NextResponse } from 'next/server';
import { createDatabaseBackup } from '@/lib/backupService';
import { listFolderFiles } from '@/lib/b2Storage';

export const runtime = 'nodejs';

// In-process memory state for last automated backup check
declare global {
  var _lastAutoBackupCheck: number | undefined;
}

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

/**
 * Checks if the most recent backup in Backblaze B2 is older than 24 hours.
 * If older (or no backup exists), it automatically creates and uploads a new 24h snapshot.
 */
export async function checkAndRunAutomated24hBackup() {
  const now = Date.now();

  // Throttle in-memory check to at most once every 10 minutes to avoid unnecessary B2 listing
  if (global._lastAutoBackupCheck && now - global._lastAutoBackupCheck < 10 * 60 * 1000) {
    return { executed: false, reason: 'Checked recently (throttle 10m)' };
  }
  global._lastAutoBackupCheck = now;

  const files = await listFolderFiles('database-backups');
  if (files.length === 0) {
    // No backup exists, create first auto backup
    const backup = await createDatabaseBackup('auto_daily');
    return { executed: true, reason: 'No prior backup found. Initial backup created.', backup };
  }

  // Sort newest first
  files.sort((a, b) => {
    const timeA = a.lastModified ? new Date(a.lastModified).getTime() : 0;
    const timeB = b.lastModified ? new Date(b.lastModified).getTime() : 0;
    return timeB - timeA;
  });

  const latestFile = files[0];
  const latestTime = latestFile.lastModified ? new Date(latestFile.lastModified).getTime() : 0;
  const elapsed = now - latestTime;

  if (elapsed >= TWENTY_FOUR_HOURS_MS) {
    const backup = await createDatabaseBackup('auto_daily');
    return {
      executed: true,
      reason: `Latest backup was ${Math.round(elapsed / (1000 * 60 * 60))} hours old. New daily snapshot created.`,
      backup,
    };
  }

  return {
    executed: false,
    reason: `Latest backup is recent (${Math.round(elapsed / (1000 * 60))} minutes old). Next backup due in ${Math.round((TWENTY_FOUR_HOURS_MS - elapsed) / (1000 * 60 * 60))} hours.`,
  };
}

// GET or POST: Trigger automated daily backup evaluation
// Can be called by:
// 1. Vercel Cron (schedule: "0 0 * * *")
// 2. An external cron service / Windows Task Scheduler / curl
// 3. Automated check routine
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const cronSecret = process.env.CRON_SECRET;

    // If CRON_SECRET is configured, enforce protection
    if (cronSecret && authHeader !== `Bearer ${cronSecret}` && secret !== cronSecret) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const result = await checkAndRunAutomated24hBackup();
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error('[cron/daily-backup] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}
