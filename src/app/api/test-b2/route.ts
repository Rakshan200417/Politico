import { NextResponse } from 'next/server';
import { uploadToFolder, listFolderFiles, deleteFromB2, B2_BUCKET } from '@/lib/b2Storage';

export const runtime = 'nodejs';

export async function GET() {
  const results: Record<string, any> = {
    bucket: B2_BUCKET,
    timestamp: new Date().toISOString(),
    tests: {},
  };

  const testKey = `test_ping_${Date.now()}.txt`;
  const testBuffer = Buffer.from(`Politico Backend Self-Test at ${new Date().toISOString()}`);

  try {
    // 1. Upload Test
    const uploadedUrl = await uploadToFolder('media', testKey, testBuffer, 'text/plain');
    results.tests.upload = {
      status: 'PASSED',
      folder: 'media',
      file: testKey,
      url: uploadedUrl,
    };

    // 2. List Test
    const files = await listFolderFiles('media');
    results.tests.list = {
      status: 'PASSED',
      folder: 'media',
      foundCount: files.length,
      files: files.map(f => f.key),
    };

    // 3. Delete Test (cleanup)
    await deleteFromB2(`media/${testKey}`);
    results.tests.delete = {
      status: 'PASSED',
      deletedKey: `media/${testKey}`,
    };

    results.status = 'SUCCESS';
    results.message = 'Backblaze B2 backend integration is 100% operational!';
    return NextResponse.json(results, { status: 200 });
  } catch (error: any) {
    results.status = 'FAILED';
    results.error = error.message;
    return NextResponse.json(results, { status: 500 });
  }
}
