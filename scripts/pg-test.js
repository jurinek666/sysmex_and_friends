import "dotenv/config";
import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});

try {
  const r = await pool.query("select now() as now");
  console.log("OK:", r.rows[0]);
} catch (e) {
  console.error("FAIL:", e);
} finally {
  await pool.end();
}
