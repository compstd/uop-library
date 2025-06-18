const mysql = require("mysql2");
const isProd = process.env.NODE_ENV === "production";

let dbConfig;
if (process.env.DATABASE_URL) {
  console.log('Using DATABASE_URL for connection');
  const url = new URL(process.env.DATABASE_URL);
  dbConfig = {
    host: url.hostname,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
    port: url.port || 3306,
    ssl: {
      rejectUnauthorized: true,
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: "utf8mb4",
    // Add these connection management options
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
    idleTimeout: 300000, // 5 minutes
    // Handle connection errors
    handleDisconnects: true
  };
} else {
   console.log('Using individual environment variables');
  dbConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "uop_library",
    port: process.env.DB_PORT || 3306,
    ssl: isProd ? { rejectUnauthorized: false } : false,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: "utf8mb4",
  };
}

const pool = mysql.createPool(dbConfig);

// Enhanced error handling
pool.on("error", (err) => {
  console.error("MySQL Pool Error:", err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
    console.log('Database connection lost, will reconnect on next query');
  }
});

module.exports = pool.promise();
