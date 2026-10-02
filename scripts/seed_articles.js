const mysql = require('mysql2/promise');

const categories = [
  'Politics', 'Policy', 'World', 'Companies', 'Startups', 
  'Markets', 'Economy', 'Finance', 'Technology', 'Industries', 'Leaders'
];

function getRandomItems(arr, count) {
  const shuffled = arr.slice(0).sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function seedArticles() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'politico_db'
  });

  try {
    console.log('Connected to database. Fetching authors...');
    const [users] = await connection.query("SELECT * FROM users WHERE role = 'writer'");
    
    if (users.length === 0) {
      console.log('No writers found. Please run seed_authors.js first.');
      return;
    }

    console.log(`Found ${users.length} writers. Generating articles...`);
    
    let globalArticleCount = 1;
    
    for (const writer of users) {
      for (let i = 1; i <= 21; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const subcats = getRandomItems(categories.filter(c => c !== category), 2);
        
        const title = `${category} Update: Major Developments By ${writer.name} Part ${i}`;
        const slug = generateSlug(title) + '-' + globalArticleCount;
        const deck = `This is a comprehensive overview of the latest events in ${category}, bringing you the details that matter most.`;
        const content = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`;
        
        const cardSummary = `A brief summary of the latest ${category} news by ${writer.name}.`;
        const image = `https://picsum.photos/seed/${globalArticleCount}/800/600`;
        const status = 'published';
        
        const query = `
          INSERT INTO articles (
            writer_email, writer_name, title, slug, deck, content, category, 
            subcategories, tags, read_time, status, card_summary, image, 
            image_caption, image_credit
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        await connection.execute(query, [
          writer.email,
          writer.name,
          title,
          slug,
          deck,
          content,
          category,
          JSON.stringify(subcats),
          'news,update',
          '5 min read',
          status,
          cardSummary,
          image,
          'A representative photo',
          'Unsplash'
        ]);
        
        globalArticleCount++;
      }
      console.log(`Created 21 articles for writer: ${writer.name}`);
    }
    
    console.log('Successfully seeded 420 articles.');
  } catch (error) {
    console.error('Error seeding articles:', error);
  } finally {
    await connection.end();
  }
}

seedArticles();
