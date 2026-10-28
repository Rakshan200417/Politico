import pool from '@/lib/db';
import { uploadToFolder, listFolderFiles } from '@/lib/b2Storage';

export interface BackupResult {
  filename: string;
  url: string;
  size: string;
  date: string;
}

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

/**
 * Creates a complete JSON snapshot of all core MySQL tables and uploads to Backblaze B2 database-backups/
 * @param prefix Prefix for the filename, e.g. 'manual' or 'auto_daily'
 */
export async function createDatabaseBackup(prefix: 'manual' | 'auto_daily' = 'manual'): Promise<BackupResult> {
  // Query all tables in project
  const [userRows]: any = await pool.query('SELECT * FROM `users` ORDER BY `id` ASC');
  const [profileRows]: any = await pool.query('SELECT * FROM `profile_details`');
  const [savedArticleRows]: any = await pool.query('SELECT * FROM `saved_articles`');
  const [articleRows]: any = await pool.query('SELECT * FROM `articles` ORDER BY `id` ASC');
  const [commentRows]: any = await pool.query('SELECT * FROM `comments` ORDER BY `id` ASC');
  const [subscriberRows]: any = await pool.query('SELECT * FROM `newsletter_subscribers` ORDER BY `id` ASC');
  const [adRows]: any = await pool.query('SELECT * FROM `ads` ORDER BY `id` ASC');
  const [contactRows]: any = await pool.query('SELECT * FROM `contact_submissions` ORDER BY `id` ASC');
  const [advertiseLeadRows]: any = await pool.query('SELECT * FROM `advertise_leads` ORDER BY `id` ASC');
  const [shortsReelsRows]: any = await pool.query('SELECT * FROM `shorts_reels` ORDER BY `id` ASC');

  // Build lookup maps
  const profileByEmail = new Map<string, any>();
  for (const p of profileRows) {
    if (p.email) profileByEmail.set(p.email.toLowerCase().trim(), p);
  }

  const bookmarksByEmail = new Map<string, string[]>();
  for (const sa of savedArticleRows) {
    if (!sa.user_email) continue;
    const em = sa.user_email.toLowerCase().trim();
    if (!bookmarksByEmail.has(em)) bookmarksByEmail.set(em, []);
    bookmarksByEmail.get(em)!.push(sa.slug || String(sa.id));
  }

  const commentsByArticleSlug = new Map<string, any[]>();
  for (const c of commentRows) {
    const slug = c.article_slug || '';
    if (!commentsByArticleSlug.has(slug)) commentsByArticleSlug.set(slug, []);
    commentsByArticleSlug.get(slug)!.push({
      id: `comment-${c.id}`,
      date: c.created_at ? new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
      userId: '',
      content: c.comment_text,
      userName: c.commenter_name,
      userRole: 'Reader',
    });
  }

  // 1. Format Users
  const formattedUsers = userRows.map((u: any) => {
    const emailKey = (u.email || '').toLowerCase().trim();
    const prof = profileByEmail.get(emailKey);
    const bookmarks = bookmarksByEmail.get(emailKey) || [];

    // Role display format
    let roleStr = 'Reader';
    if (String(u.role).toLowerCase() === 'admin') roleStr = 'Admin';
    else if (String(u.role).toLowerCase() === 'writer') roleStr = 'Writer';

    return {
      id: `user-${u.id}`,
      name: u.name || prof?.full_name || '',
      email: u.email,
      password: u.password,
      role: roleStr,
      bookmarks,
      likes: [],
      bio: prof?.bio || '',
      avatar: u.avatar_url || prof?.avatar_url || '',
      linkedin: prof?.linkedin_profile || null,
    };
  });

  // 2. Format Articles
  const formattedArticles = articleRows.map((a: any) => {
    let subCategories: string[] = [];
    if (a.subcategories) {
      try {
        subCategories = typeof a.subcategories === 'string' ? JSON.parse(a.subcategories) : a.subcategories;
      } catch {
        subCategories = String(a.subcategories).split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    let tags: string[] = [];
    if (a.tags) {
      try {
        tags = typeof a.tags === 'string' ? JSON.parse(a.tags) : a.tags;
      } catch {
        tags = String(a.tags).split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    const dateFormatted = a.created_at
      ? new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : '';

    const articleComments = commentsByArticleSlug.get(a.slug || '') || [];

    let statusDisplay = 'Published';
    if (a.status) {
      statusDisplay = a.status.charAt(0).toUpperCase() + a.status.slice(1).toLowerCase();
    }

    return {
      id: `art-${a.id}`,
      title: a.title,
      subtitle: a.deck || '',
      category: a.category,
      subCategories,
      tags,
      summary: a.card_summary || a.deck || '',
      fullContent: a.content || '',
      image: a.image || '',
      readTime: a.read_time || '5 min read',
      author: a.writer_name || '',
      writerId: a.writer_email || '',
      status: statusDisplay,
      date: dateFormatted,
      likes: [],
      comments: articleComments,
      spotlightPosition: a.homepage_placement || null,
      homeSection: a.homepage_placement || '',
      newsletterBanner: a.targeted_email_distribution || 'middle',
      focusKeyword: a.focus_keyword || '',
      metaDescription: a.meta_description || '',
      customRecipients: null,
      views: a.views || 0,
    };
  });

  // 3. Format Newsletter Subscribers
  const formattedSubscribers = subscriberRows.map((s: any) => {
    let newsletters: string[] = [];
    if (s.newsletters) {
      try {
        newsletters = typeof s.newsletters === 'string' && s.newsletters.startsWith('[')
          ? JSON.parse(s.newsletters)
          : String(s.newsletters).split(',').map(item => item.trim()).filter(Boolean);
      } catch {
        newsletters = [String(s.newsletters)];
      }
    }

    return {
      id: `nl-${s.id}`,
      email: s.email,
      newsletters,
      subscribedAt: s.subscribed_at
        ? new Date(s.subscribed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'Recent',
    };
  });

  // 4. Submissions (pending/review queue articles or submissions)
  const formattedSubmissions: any[] = [];

  // 5. Format Ads
  const formattedAds = adRows.map((ad: any) => ({
    id: `ad-${ad.slot_key || ad.id}`,
    slotName: ad.slot_key || ad.name,
    imageUrl: ad.image || '',
    targetType: ad.action_type || 'url',
    targetValue: ad.link || '',
    isActive: ad.active ? 1 : 0,
  }));

  // 6. Format Contact Messages
  const formattedContactMessages = contactRows.map((cm: any) => ({
    id: `msg-${cm.id}`,
    name: cm.name || '',
    email: cm.email || '',
    phone: cm.phone || '',
    whatsapp: cm.whatsapp || '',
    company: cm.company || '',
    inquiryType: cm.inquiry_type || 'Editorial',
    message: cm.message || '',
    status: cm.status || 'New',
    submittedAt: cm.created_at ? new Date(cm.created_at).toISOString() : new Date().toISOString(),
  }));

  // 7. Format Advertise Leads
  const formattedAdvertiseLeads = advertiseLeadRows.map((al: any) => ({
    id: `lead-${al.id}`,
    name: al.name || '',
    company: al.company || '',
    email: al.email || '',
    phone: al.phone || '',
    whatsapp: al.whatsapp || '',
    leadType: al.service_option || 'Publish Company Article',
    message: al.requirements || '',
    status: al.status || 'New',
    submittedAt: al.created_at ? new Date(al.created_at).toISOString() : new Date().toISOString(),
  }));

  // Construct complete snapshot preserving both the requested project format and table schema format
  const snapshotData = {
    version: 1,
    backupDate: new Date().toISOString(),
    timestamp: new Date().toISOString(),
    type: prefix === 'auto_daily' ? 'automated_24h_snapshot' : 'manual_snapshot',
    database: process.env.DB_NAME || 'politico_db',
    // 1. Users, 2. Articles, 3. Newsletter, 4. Submissions, 5. Ads, 6. Contact, 7. Advertise leads, 8. Shorts & reels
    data: {
      users: formattedUsers,
      articles: formattedArticles,
      newsletter_subscribers: formattedSubscribers,
      submissions: formattedSubmissions,
      ads: formattedAds,
      contact_messages: formattedContactMessages,
      advertise_leads: formattedAdvertiseLeads,
      shorts_reels: shortsReelsRows,
    },
    // Raw table rows for direct SQL restore compatibility
    tables: {
      users: userRows,
      profile_details: profileRows,
      saved_articles: savedArticleRows,
      articles: articleRows,
      comments: commentRows,
      newsletter_subscribers: subscriberRows,
      ads: adRows,
      contact_submissions: contactRows,
      advertise_leads: advertiseLeadRows,
      shorts_reels: shortsReelsRows,
    },
  };

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
