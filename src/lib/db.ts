import "server-only";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "srv2216.hstgr.io",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "u564667558_storeuser",
  password: process.env.DB_PASSWORD || "GetDB@026",
  database: process.env.DB_NAME || "u564667558_storedb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 3000,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
