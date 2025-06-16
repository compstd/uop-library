const mysql = require("mysql2");

const isProd = process.env.NODE_ENV === "production";

let dbConfig;

if (process.env.DATABASE_URL) {
  const url = new URL(process.env.DATABASE_URL);
  dbConfig = {
    host: url.hostname,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1), // Remove leading slash
    port: url.port || 3306,
    ssl: {
      rejectUnauthorized: true,
    },
    waitForConnections: true,
    queueLimit: 0,
    connectionLimit: 10,
    maxPreparedStatements: 100,
    enableKeepAlive: true,
    charset: "utf8mb4",
  };
} else {
  // Fallback to individual environment variables
  dbConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "uop_library",
    port: process.env.DB_PORT || 3306,
    ssl: isProd
      ? {
          rejectUnauthorized: true,
        }
      : false,
    waitForConnections: true,
    queueLimit: 0,
    connectionLimit: 10,
    maxPreparedStatements: 100,
    enableKeepAlive: true,
    charset: "utf8mb4",
  };
}

const db = mysql.createPool(dbConfig);
module.exports = db.promise();
