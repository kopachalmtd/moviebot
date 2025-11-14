// lib/db.js
const Database = require('better-sqlite3');
const path = require('path');

const file = process.env.SQLITE_FILE || path.join(__dirname, '..', 'data.db');
const db = new Database(file);

db.prepare(`
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference TEXT UNIQUE,
  chat_id TEXT,
  amount REAL,
  status TEXT,
  payload TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

module.exports = {
  createPending: (reference, chatId, amount) =>
    db.prepare('INSERT INTO payments(reference, chat_id, amount, status) VALUES(?,?,?,?)')
      .run(reference, String(chatId), amount, 'PENDING'),
  markComplete: (reference, status, payload) =>
    db.prepare('UPDATE payments SET status = ?, payload = ? WHERE reference = ?')
      .run(status, JSON.stringify(payload), reference),
  findByReference: (reference) =>
    db.prepare('SELECT * FROM payments WHERE reference = ?').get(reference),
  all: () => db.prepare('SELECT * FROM payments ORDER BY id DESC').all()
};
