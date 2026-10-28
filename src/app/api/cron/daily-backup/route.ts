import { NextResponse } from 'next/server';
import { checkAndRunAutomated24hBackup } from '@/lib/backupService';

export const runtime = 'nodejs';

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
