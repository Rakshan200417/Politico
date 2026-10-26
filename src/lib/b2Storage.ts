import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

const endpoint = process.env.B2_ENDPOINT?.startsWith('http')
  ? process.env.B2_ENDPOINT
  : `https://${process.env.B2_ENDPOINT || 's3.us-east-005.backblazeb2.com'}`;

export const s3Client = new S3Client({
  endpoint,
  region: process.env.B2_REGION || 'us-east-005',
  credentials: {
    accessKeyId: process.env.B2_KEY_ID || '',
    secretAccessKey: process.env.B2_APPLICATION_KEY || '',
  },
  forcePathStyle: true,
});

export const B2_BUCKET = process.env.B2_BUCKET_NAME || 'Politico';

/**
 * Standard project folders in Backblaze B2
 */
export const B2_FOLDERS = {
  ADS: 'ads',
  ARTICLES: 'articles',
  AVATARS: 'avatars',
  DATABASE: 'database',
  DATABASE_BACKUPS: 'database-backups',
  MEDIA: 'media',
  REELS: 'reels',
} as const;

export type B2Folder = typeof B2_FOLDERS[keyof typeof B2_FOLDERS];

/**
 * Uploads a file buffer directly to a specific folder in the Backblaze B2 bucket.
 * e.g. uploadToFolder('articles', 'image123.webp', buffer, 'image/webp')
 */
export async function uploadToFolder(
  folder: B2Folder | string,
  fileName: string,
  buffer: Buffer,
  contentType: string = 'image/webp'
): Promise<string> {
  const sanitizedFolder = folder.replace(/^\/+|\/+$/g, '');
  const sanitizedFileName = fileName.replace(/^\/+/, '');
  const key = `${sanitizedFolder}/${sanitizedFileName}`;

  const command = new PutObjectCommand({
    Bucket: B2_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await s3Client.send(command);

  const publicBase =
    process.env.NEXT_PUBLIC_B2_PUBLIC_URL ||
    `https://${B2_BUCKET}.${(process.env.B2_ENDPOINT || 's3.us-east-005.backblazeb2.com').replace(/^https?:\/\//, '')}`;

  return `${publicBase.replace(/\/+$/, '')}/${key}`;
}

/**
 * Uploads a buffer directly to Backblaze B2 using a full key path.
 */
export async function uploadToB2(
  buffer: Buffer,
  key: string,
  contentType: string = 'image/webp'
): Promise<string> {
  const sanitizedKey = key.replace(/^\/+/, '');

  const command = new PutObjectCommand({
    Bucket: B2_BUCKET,
    Key: sanitizedKey,
    Body: buffer,
    ContentType: contentType,
  });

  await s3Client.send(command);

  const publicBase =
    process.env.NEXT_PUBLIC_B2_PUBLIC_URL ||
    `https://${B2_BUCKET}.${(process.env.B2_ENDPOINT || 's3.us-east-005.backblazeb2.com').replace(/^https?:\/\//, '')}`;

  return `${publicBase.replace(/\/+$/, '')}/${sanitizedKey}`;
}

/**
 * Deletes a file from Backblaze B2 bucket by key or URL.
 */
export async function deleteFromB2(keyOrUrl: string): Promise<void> {
  let key = keyOrUrl;
  if (keyOrUrl.startsWith('http')) {
    try {
      const urlObj = new URL(keyOrUrl);
      key = urlObj.pathname.replace(/^\/+/, '');
      if (key.startsWith(`${B2_BUCKET}/`)) {
        key = key.replace(`${B2_BUCKET}/`, '');
      }
    } catch {
      // keep as is
    }
  }

  const command = new DeleteObjectCommand({
    Bucket: B2_BUCKET,
    Key: key,
  });

  await s3Client.send(command);
}

/**
 * Fetches an object buffer from Backblaze B2.
 */
export async function getObjectFromB2(key: string): Promise<Buffer> {
  const command = new GetObjectCommand({
    Bucket: B2_BUCKET,
    Key: key,
  });

  const response = await s3Client.send(command);
  const stream = response.Body as Readable;

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

/**
 * Lists all files inside a specific folder in the bucket (e.g., 'articles', 'ads', 'reels').
 */
export async function listFolderFiles(folder: B2Folder | string) {
  const prefix = folder.replace(/^\/+|\/+$/g, '') + '/';
  const command = new ListObjectsV2Command({
    Bucket: B2_BUCKET,
    Prefix: prefix,
  });

  const response = await s3Client.send(command);
  return (response.Contents || [])
    .filter(item => item.Key && !item.Key.endsWith('.bzEmpty'))
    .map(item => ({
      key: item.Key!,
      size: item.Size || 0,
      lastModified: item.LastModified,
      url: `${(process.env.NEXT_PUBLIC_B2_PUBLIC_URL || `https://${B2_BUCKET}.${(process.env.B2_ENDPOINT || 's3.us-east-005.backblazeb2.com').replace(/^https?:\/\//, '')}`).replace(/\/+$/, '')}/${item.Key}`,
    }));
}

