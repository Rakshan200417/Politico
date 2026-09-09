import mysql from 'mysql2/promise';

// Create a connection pool to XAMPP MySQL database
// Default XAMPP credentials are user: 'root' with no password
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Default XAMPP password is empty
  database: 'politico_db', // Ensure this matches what you created in phpMyAdmin
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
