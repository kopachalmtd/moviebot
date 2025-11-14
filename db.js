// lib/db.js - PostgreSQL (node-postgres)
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // For Supabase, you may need to enable SSL:
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
}

async function createPending(reference, chatId, amount) {
  const q = 'INSERT INTO payments(reference, chat_id, amount, status) VALUES($1,$2,$3,$4)';
  return pool.query(q, [reference, String(chatId), amount, 'PENDING']);
}

async function markComplete(reference, status, payload) {
  const q = 'UPDATE payments SET status=$1, payload=$2 WHERE reference=$3';
  return pool.query(q, [status, payload || null, reference]);
}

async function findByReference(reference) {
  const q = 'SELECT * FROM payments WHERE reference=$1';
  const r = await pool.query(q, [reference]);
  return r.rows[0] || null;
}

async function all() {
  const r = await pool.query('SELECT * FROM payments ORDER BY id DESC');
  return r.rows;
}

// initialize table once (fire-and-forget)
init().catch(err => {
  console.error('DB init error', err);
});

module.exports = {
  createPending,
  markComplete,
  findByReference,
  all,
  pool
};
