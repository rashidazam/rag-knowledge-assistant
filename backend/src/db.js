
import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

const isCloudDatabase = Boolean(process.env.DATABASE_URL);

export const pool = new Pool(
  isCloudDatabase
    ? {
        connectionString: process.env.DATABASE_URL,
      }
    : {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 5432),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      }
);

console.log(
  `Database mode: ${isCloudDatabase ? "Neon Cloud" : "Local PostgreSQL"}`
);
