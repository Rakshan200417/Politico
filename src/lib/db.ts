import mysql from 'mysql2/promise';

declare global {
  var _mysqlPool: mysql.Pool | undefined;
}

// Create a connection pool to XAMPP MySQL database
// Default XAMPP credentials are user: 'root' with no password
// Force recreate the pool to pick up the new 1GB max_allowed_packet limit
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Default XAMPP password is empty
  database: 'politico_db', // Ensure this matches what you created in phpMyAdmin
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

if (process.env.NODE_ENV !== 'production') {
  global._mysqlPool = pool;
}

export default pool;
