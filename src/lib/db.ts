import mysql from 'mysql2/promise';

declare global {
  var _mysqlPool: mysql.Pool | undefined;
}

// Reuse existing global pool in development to prevent "Too many connections" during hot reloading
const pool =
  global._mysqlPool ||
  mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // Default XAMPP password is empty
    database: 'politico_db', // Ensure this matches what you created in phpMyAdmin
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    queueLimit: 0,
  });

if (process.env.NODE_ENV !== 'production') {
  global._mysqlPool = pool;
}

export default pool;
