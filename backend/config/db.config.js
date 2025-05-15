const mysql = require("mysql2");

const isProd = false;

const dbConfig = isProd
  ? {
      host: "your-hosting-db-host", // e.g., "mysql.uoplibrary.com"
      user: "your-prod-username", // Your hosting DB username
      password: "your-prod-password", // Your hosting DB password
      database: "admin",
      waitForConnections: true,
      queueLimit: 0,
      connectionLimit: 10,
      maxPreparedStatements: 100,
      enableKeepAlive: true,
      charset: "utf8mb4",
      maxAllowedPacket: "16M",
    }
  : {
      host: "localhost",
      user: "root",
      password: "",
      database: "admin",
      waitForConnections: true,
      queueLimit: 0,
      connectionLimit: 10,
      maxPreparedStatements: 100,
      enableKeepAlive: true,
      charset: "utf8mb4",
      maxAllowedPacket: "16M",
    };

const db = mysql.createPool(dbConfig);
module.exports = db.promise();
