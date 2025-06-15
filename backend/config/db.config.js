const mysql = require("mysql2");

const isProd = process.env.NODE_ENV === "production";

const dbConfig = isProd
  ? {
      // Production PlanetScale config
      host: "aws.connect.psdb.cloud",
      user: "uhmgjk6elfwax15wuija",
      password: "pscale_pw_ztLngXHhHbSQvLoTn8rlegKwJstmEOU0y2paZLQAzHU",
      database: "uop_library",
      ssl: {
        rejectUnauthorized: true,
      },
      waitForConnections: true,
      queueLimit: 0,
      connectionLimit: 10,
      maxPreparedStatements: 100,
      enableKeepAlive: true,
      charset: "utf8mb4",
    }
  : {
      // Development PlanetScale config (same as production)
      host: "aws.connect.psdb.cloud",
      user: "uhmgjk6elfwax15wuija",
      password: "pscale_pw_ztLngXHhHbSQvLoTn8rlegKwJstmEOU0y2paZLQAzHU",
      database: "uop_library",
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

const db = mysql.createPool(dbConfig);
module.exports = db.promise();
