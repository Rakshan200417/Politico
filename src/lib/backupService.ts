import pool from '@/lib/db';
import { uploadToFolder } from '@/lib/b2Storage';

export interface BackupResult {
  filename: string;
  url: string;
  size: string;
  date: string;
}

/**
 * Creates a complete JSON snapshot of all core MySQL tables and uploads to Backblaze B2 database-backups/
 * @param prefix Prefix for the filename, e.g. 'manual' or 'auto_daily'
 */
export async function createDatabaseBackup(prefix: 'manual' | 'auto_daily' = 'manual'): Promise<BackupResult> {
  const tables = ['articles', 'ads', 'users', 'shorts_reels', 'comments', 'newsletter_subscribers'];
  const snapshotData: Record<string, any> = {
    timestamp: new Date().toISOString(),
    type: prefix === 'auto_daily' ? 'automated_24h_snapshot' : 'manual_snapshot',
    database: process.env.DB_NAME || 'politico_db',
    tables: {},
  };

  for (const table of tables) {
    try {
      const [rows]: any = await pool.query(`SELECT * FROM \`${table}\``);
      snapshotData.tables[table] = rows;
    } catch (tableErr: any) {
      snapshotData.tables[table] = { error: tableErr.message };
    }
  }

  const jsonString = JSON.stringify(snapshotData, null, 2);
  const buffer = Buffer.from(jsonString, 'utf-8');

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const timestampName = `${now.getFullYear()}_${pad(now.getMonth() + 1)}_${pad(now.getDate())}_${pad(now.getHours())}_${pad(now.getMinutes())}_${pad(now.getSeconds())}`;
  const filename = `db_backup_${prefix}_${timestampName}.json`;

  const uploadedUrl = await uploadToFolder('database-backups', filename, buffer, 'application/json');

  return {
    filename,
    url: uploadedUrl,
    size: `${(buffer.length / (1024 * 1024)).toFixed(2)} MB`,
    date: now.toLocaleString(),
  };
}
