import mysql from 'mysql2/promise';

declare global {
  var _mysqlPool: mysql.Pool | undefined;
}

// Reuse existing global pool in development to prevent "Too many connections" during hot reloading
const pool =
  global._mysqlPool ||
  mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '', // Default XAMPP password is empty
    database: process.env.DB_NAME || 'politico_db', // Ensure this matches what you created in phpMyAdmin
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
