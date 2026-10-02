const mysql = require("mysql2/promise");

async function createNewsletterTable() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "politico_db",
  });

  try {
    console.log("Connected to MySQL. Creating newsletter_subscribers table...");
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        newsletters VARCHAR(255) NOT NULL,
        subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Table newsletter_subscribers created or already exists.");

    // Insert some mock data if empty
    const [rows] = await connection.execute("SELECT COUNT(*) as count FROM newsletter_subscribers");
    if (rows[0].count === 0) {
      console.log("Inserting mock subscribers...");
      await connection.execute(`
        INSERT INTO newsletter_subscribers (email, newsletters, subscribed_at) VALUES 
        ('akramyoonos1999@gmail.com', 'US', '2026-09-09 10:00:00'),
        ('oshidiishmitha@gmail.com', 'WORLD', '2026-08-30 14:00:00'),
        ('cxzm0990@gmail.com', 'US, POLITICS', '2026-08-18 09:30:00'),
        ('akramyoonos54354@gmail.com', 'US, ECONOMY & MARKETS', '2026-08-17 11:20:00'),
        ('circuitridergary@duck.com', 'US, WORLD, POLITICS, ECONOMY & MARKETS, BUSINESS, CRYPTO, TECHNOLOGY', '2026-08-14 16:45:00')
      `);
      console.log("Mock subscribers inserted.");
    }

  } catch (error) {
    console.error("Error setting up newsletter_subscribers table:", error);
  } finally {
    await connection.end();
  }
}

createNewsletterTable();
