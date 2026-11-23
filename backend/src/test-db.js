import { pool } from "./db.js";

async function testDatabase() {
  try {
    const result = await pool.query(
      "SELECT id, content, embedding FROM learning_vectors"
    );

    console.log("Connected to PostgreSQL!");
    console.table(result.rows);
  } catch (error) {
    console.error("Database connection failed:", error.message);
  } finally {
    await pool.end();
  }
}

testDatabase();