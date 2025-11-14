// lib/db.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function init() {
  const sql = `
  CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    reference TEXT UNIQUE,
    chat_id TEXT,
    amount NUMERIC,
    status TEXT,
    payload JSONB,
    created_at TIMESTAMP DEFAULT now()
  );`;
  await pool.query(sql);
  console.log('DB init done');
}

init().catch(err => console.error('DB init error', err));

module.exports = {
  createPending: (reference, chatId, amount) =>
    pool.query('INSERT INTO payments(reference, chat_id, amount, status) VALUES($1,$2,$3,$4)', [reference, String(chatId), amount, 'PENDING']),
  markComplete: (reference, status, payload) =>
    pool.query('UPDATE payments SET status=$1, payload=$2 WHERE reference=$3', [status, payload || null, reference]),
  findByReference: async (reference) => {
    const r = await pool.query('SELECT * FROM payments WHERE reference=$1', [reference]);
    return r.rows[0] || null;
  },
  all: async () => {
    const r = await pool.query('SELECT * FROM payments ORDER BY id DESC');
    return r.rows;
  },
  pool
};
