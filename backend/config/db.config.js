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
      rejectUnauthorized: true, // Secure connection
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: "utf8mb4",
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

// Optional: log errors
pool.on("error", (err) => {
  console.error("MySQL Pool Error:", err);
});

module.exports = pool.promise();

