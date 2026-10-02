const mysql = require('mysql2/promise');

const authors = [
  { name: 'Sarah Jenkins', email: 'sarah.jenkins@politico.mock' },
  { name: 'Marcus Sterling', email: 'marcus.sterling@politico.mock' },
  { name: 'Elena Rostova', email: 'elena.rostova@politico.mock' },
  { name: 'David Chen', email: 'david.chen@politico.mock' },
  { name: 'Aisha Rahman', email: 'aisha.rahman@politico.mock' },
  { name: 'James O\'Connor', email: 'james.oconnor@politico.mock' },
  { name: 'Chloe Dubois', email: 'chloe.dubois@politico.mock' },
  { name: 'Michael Chang', email: 'michael.chang@politico.mock' },
  { name: 'Sophia Martinez', email: 'sophia.martinez@politico.mock' },
  { name: 'William Bradley', email: 'william.bradley@politico.mock' },
  { name: 'Olivia Kim', email: 'olivia.kim@politico.mock' },
  { name: 'Daniel Foster', email: 'daniel.foster@politico.mock' },
  { name: 'Isabella Silva', email: 'isabella.silva@politico.mock' },
  { name: 'Lucas Thompson', email: 'lucas.thompson@politico.mock' },
  { name: 'Emma Patel', email: 'emma.patel@politico.mock' },
  { name: 'Alexander Wright', email: 'alexander.wright@politico.mock' },
  { name: 'Mia Johnson', email: 'mia.johnson@politico.mock' },
  { name: 'Benjamin Lee', email: 'benjamin.lee@politico.mock' },
  { name: 'Charlotte Brown', email: 'charlotte.brown@politico.mock' },
  { name: 'Samuel Davis', email: 'samuel.davis@politico.mock' }
];

async function seedAuthors() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'politico_db'
  });

  try {
    console.log('Connected to database. Seeding authors...');
    
    for (const author of authors) {
      // In a real app, passwords should be hashed. Using a simple mock password for these generated authors.
      const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(author.name)}`;
      
      const query = `
        INSERT IGNORE INTO users (name, email, password, role, avatar_url)
        VALUES (?, ?, ?, 'writer', ?)
      `;
      
      await connection.execute(query, [
        author.name,
        author.email,
        'writer123', // Default mock password
        avatarUrl
      ]);
      console.log(`Inserted writer: ${author.name}`);
    }
    
    console.log('Successfully seeded 20 authors.');
  } catch (error) {
    console.error('Error seeding authors:', error);
  } finally {
    await connection.end();
  }
}

seedAuthors();
