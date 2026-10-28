import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getObjectFromB2, uploadToFolder } from '@/lib/b2Storage';

export const runtime = 'nodejs';

// POST: Restore database from either a Backblaze B2 key or uploaded JSON snapshot payload
export async function POST(request: Request) {
  let connection: any;
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

    if (!snapshotData || (!snapshotData.tables && !snapshotData.data)) {
      return NextResponse.json(
        { success: false, error: 'Invalid backup file structure: missing tables or data object.' },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');

    const restoredTables: string[] = [];

    // Helper to check table existence
    const checkTableExists = async (tableName: string) => {
      const [tableExists]: any = await connection.query(
        `SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
        [tableName]
      );
      return tableExists && tableExists.length > 0;
    };

    // Helper to insert arbitrary rows into a table
    const insertRows = async (tableName: string, rows: any[]) => {
      if (!Array.isArray(rows) || rows.length === 0) return 0;
      if (!(await checkTableExists(tableName))) return 0;

      await connection.query(`TRUNCATE TABLE \`${tableName}\``);
      const chunkSize = 50;
      for (let i = 0; i < rows.length; i += chunkSize) {
        const chunk = rows.slice(i, i + chunkSize);
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
      return rows.length;
    };

    if (snapshotData.tables && typeof snapshotData.tables === 'object') {
      // 1. Direct table schema restore
      for (const [tableName, rowsData] of Object.entries(snapshotData.tables)) {
        if (!Array.isArray(rowsData) || rowsData.length === 0) continue;
        const count = await insertRows(tableName, rowsData);
        if (count > 0) {
          restoredTables.push(`${tableName} (${count} records)`);
        }
      }
    } else if (snapshotData.data && typeof snapshotData.data === 'object') {
      // 2. Structured data restore (Users, Articles, Newsletter, Ads, Contact, Advertise Leads, etc.)
      const data = snapshotData.data;

      // 1. Restore Users & profile_details
      if (Array.isArray(data.users) && data.users.length > 0) {
        await connection.query('TRUNCATE TABLE `users`');
        if (await checkTableExists('profile_details')) {
          await connection.query('TRUNCATE TABLE `profile_details`');
        }
        if (await checkTableExists('saved_articles')) {
          await connection.query('TRUNCATE TABLE `saved_articles`');
        }

        for (const u of data.users) {
          const userNumId = parseInt(String(u.id || '').replace(/^user-/, ''), 10);
          const roleNormalized = String(u.role || 'reader').toLowerCase();
          const roleVal = ['admin', 'writer', 'reader'].includes(roleNormalized) ? roleNormalized : 'reader';

          if (!isNaN(userNumId) && userNumId > 0) {
            await connection.query(
              'INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `avatar_url`) VALUES (?, ?, ?, ?, ?, ?)',
              [userNumId, u.name || '', u.email, u.password || '', roleVal, u.avatar || null]
            );
          } else {
            await connection.query(
              'INSERT INTO `users` (`name`, `email`, `password`, `role`, `avatar_url`) VALUES (?, ?, ?, ?, ?)',
              [u.name || '', u.email, u.password || '', roleVal, u.avatar || null]
            );
          }

          // Insert into profile_details
          if (await checkTableExists('profile_details')) {
            await connection.query(
              'INSERT INTO `profile_details` (`email`, `full_name`, `bio`, `linkedin_profile`, `avatar_url`) VALUES (?, ?, ?, ?, ?)',
              [u.email, u.name || '', u.bio || '', u.linkedin || null, u.avatar || '']
            );
          }

          // Insert bookmarks into saved_articles if present
          if (Array.isArray(u.bookmarks) && u.bookmarks.length > 0 && (await checkTableExists('saved_articles'))) {
            for (const b of u.bookmarks) {
              const bSlug = String(b).replace(/^art-/, '');
              await connection.query(
                'INSERT INTO `saved_articles` (`user_email`, `slug`, `title`, `category`) VALUES (?, ?, ?, ?)',
                [u.email, bSlug, bSlug, 'General']
              );
            }
          }
        }
        restoredTables.push(`users (${data.users.length} records)`);
      }

      // 2. Restore Articles & Comments
      if (Array.isArray(data.articles) && data.articles.length > 0) {
        await connection.query('TRUNCATE TABLE `articles`');
        if (await checkTableExists('comments')) {
          await connection.query('TRUNCATE TABLE `comments`');
        }

        const articleChunkSize = 50;
        for (let i = 0; i < data.articles.length; i += articleChunkSize) {
          const chunk = data.articles.slice(i, i + articleChunkSize);
          for (const a of chunk) {
            const artNumId = parseInt(String(a.id || '').replace(/^art-/, ''), 10);
            const slug = (a.title || 'article')
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)+/g, '') || `article-${artNumId || i}`;

            const subcatsStr = Array.isArray(a.subCategories) ? JSON.stringify(a.subCategories) : (a.subCategories || null);
            const tagsStr = Array.isArray(a.tags) ? JSON.stringify(a.tags) : (a.tags || null);
            const statusNormalized = String(a.status || 'published').toLowerCase();
            const validStatus = ['draft', 'pending', 'published', 'rejected', 'trash'].includes(statusNormalized)
              ? statusNormalized
              : 'published';

            let createdAtVal: any = new Date();
            if (a.date) {
              const parsedDate = new Date(a.date);
              if (!isNaN(parsedDate.getTime())) createdAtVal = parsedDate;
            }

            if (!isNaN(artNumId) && artNumId > 0) {
              await connection.query(
                `INSERT INTO \`articles\` 
                (\`id\`, \`writer_email\`, \`writer_name\`, \`title\`, \`slug\`, \`deck\`, \`content\`, \`category\`, \`subcategories\`, \`tags\`, \`read_time\`, \`status\`, \`card_summary\`, \`focus_keyword\`, \`meta_description\`, \`image\`, \`views\`, \`homepage_placement\`, \`targeted_email_distribution\`, \`created_at\`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  artNumId,
                  a.writerId || '',
                  a.author || '',
                  a.title,
                  slug,
                  a.subtitle || '',
                  a.fullContent || a.summary || '',
                  a.category || 'General',
                  subcatsStr,
                  tagsStr,
                  a.readTime || '5 min read',
                  validStatus,
                  a.summary || a.subtitle || null,
                  a.focusKeyword || '',
                  a.metaDescription || '',
                  a.image || '',
                  a.views || 0,
                  a.spotlightPosition || a.homeSection || '',
                  a.newsletterBanner || 'middle',
                  createdAtVal,
                ]
              );
            } else {
              await connection.query(
                `INSERT INTO \`articles\` 
                (\`writer_email\`, \`writer_name\`, \`title\`, \`slug\`, \`deck\`, \`content\`, \`category\`, \`subcategories\`, \`tags\`, \`read_time\`, \`status\`, \`card_summary\`, \`focus_keyword\`, \`meta_description\`, \`image\`, \`views\`, \`homepage_placement\`, \`targeted_email_distribution\`, \`created_at\`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  a.writerId || '',
                  a.author || '',
                  a.title,
                  slug,
                  a.subtitle || '',
                  a.fullContent || a.summary || '',
                  a.category || 'General',
                  subcatsStr,
                  tagsStr,
                  a.readTime || '5 min read',
                  validStatus,
                  a.summary || a.subtitle || null,
                  a.focusKeyword || '',
                  a.metaDescription || '',
                  a.image || '',
                  a.views || 0,
                  a.spotlightPosition || a.homeSection || '',
                  a.newsletterBanner || 'middle',
                  createdAtVal,
                ]
              );
            }

            // Insert comments for this article if any
            if (Array.isArray(a.comments) && a.comments.length > 0 && (await checkTableExists('comments'))) {
              for (const c of a.comments) {
                await connection.query(
                  'INSERT INTO `comments` (`article_slug`, `category`, `article_author`, `commenter_name`, `comment_text`) VALUES (?, ?, ?, ?, ?)',
                  [slug, a.category || 'General', a.author || '', c.userName || 'Reader', c.content || '']
                );
              }
            }
          }
        }
        restoredTables.push(`articles (${data.articles.length} records)`);
      }

      // 3. Restore Newsletter Subscribers
      if (Array.isArray(data.newsletter_subscribers) && data.newsletter_subscribers.length > 0) {
        await connection.query('TRUNCATE TABLE `newsletter_subscribers`');
        for (const s of data.newsletter_subscribers) {
          const newslettersVal = Array.isArray(s.newsletters) ? s.newsletters.join(', ') : (s.newsletters || '');
          let subDate = new Date();
          if (s.subscribedAt) {
            const p = new Date(s.subscribedAt);
            if (!isNaN(p.getTime())) subDate = p;
          }
          await connection.query(
            'INSERT INTO `newsletter_subscribers` (`email`, `newsletters`, `subscribed_at`) VALUES (?, ?, ?)',
            [s.email, newslettersVal, subDate]
          );
        }
        restoredTables.push(`newsletter_subscribers (${data.newsletter_subscribers.length} records)`);
      }

      // 4. Restore Ads
      if (Array.isArray(data.ads) && data.ads.length > 0) {
        await connection.query('TRUNCATE TABLE `ads`');
        for (const ad of data.ads) {
          await connection.query(
            'INSERT INTO `ads` (`name`, `slot_key`, `slot_type`, `dimensions`, `active`, `image`, `action_type`, `link`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
              ad.slotName || 'Ad',
              ad.slotName || '',
              'banner',
              '300 x 250',
              ad.isActive ? 1 : 0,
              ad.imageUrl || '',
              ad.targetType || 'External Link (URL)',
              ad.targetValue || '',
            ]
          );
        }
        restoredTables.push(`ads (${data.ads.length} records)`);
      }

      // 5. Restore Contact Messages
      if (Array.isArray(data.contact_messages) && data.contact_messages.length > 0 && (await checkTableExists('contact_submissions'))) {
        await connection.query('TRUNCATE TABLE `contact_submissions`');
        for (const cm of data.contact_messages) {
          await connection.query(
            'INSERT INTO `contact_submissions` (`name`, `company`, `email`, `phone`, `whatsapp`, `inquiry_type`, `message`, `status`, `created_at`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              cm.name || '',
              cm.company || '',
              cm.email || '',
              cm.phone || '',
              cm.whatsapp || '',
              cm.inquiryType || 'Editorial',
              cm.message || '',
              cm.status || 'New',
              cm.submittedAt ? new Date(cm.submittedAt) : new Date(),
            ]
          );
        }
        restoredTables.push(`contact_submissions (${data.contact_messages.length} records)`);
      }

      // 6. Restore Advertise Leads
      if (Array.isArray(data.advertise_leads) && data.advertise_leads.length > 0 && (await checkTableExists('advertise_leads'))) {
        await connection.query('TRUNCATE TABLE `advertise_leads`');
        for (const al of data.advertise_leads) {
          await connection.query(
            'INSERT INTO `advertise_leads` (`name`, `company`, `email`, `phone`, `whatsapp`, `service_option`, `requirements`, `status`, `created_at`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              al.name || '',
              al.company || '',
              al.email || '',
              al.phone || '',
              al.whatsapp || '',
              al.leadType || 'Publish Company Article',
              al.message || '',
              al.status || 'New',
              al.submittedAt ? new Date(al.submittedAt) : new Date(),
            ]
          );
        }
        restoredTables.push(`advertise_leads (${data.advertise_leads.length} records)`);
      }

      // 7. Restore Shorts & Reels if present in data
      if (Array.isArray(data.shorts_reels) && data.shorts_reels.length > 0 && (await checkTableExists('shorts_reels'))) {
        await insertRows('shorts_reels', data.shorts_reels);
        restoredTables.push(`shorts_reels (${data.shorts_reels.length} records)`);
      }
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
