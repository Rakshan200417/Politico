import { NextResponse } from 'next/server';
import { getObjectFromB2 } from '@/lib/b2Storage';

export const runtime = 'nodejs';

// GET: Stream or download a database backup file directly as an attachment
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    const filename = searchParams.get('filename') || (key ? key.split('/').pop() : 'backup.json');

    if (!key) {
      return NextResponse.json({ success: false, error: 'Key is required' }, { status: 400 });
    }

    const buffer = await getObjectFromB2(key);

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error('[database-backups/download] Download error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
