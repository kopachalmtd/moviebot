// api/payhero/callback.js
require('dotenv').config();
const axios = require('axios');
const db = require('../../lib/db');

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

async function tgSend(chatId, text) {
  try {
    await axios.post(`${TELEGRAM_API}/sendMessage`, { chat_id: chatId, text });
  } catch (e) {
    console.error('tgSend error', e?.response?.data || e.message);
  }
}

module.exports = async (req, res) => {
  try {
    const body = req.body || {};

    // If PayHero provides a signature header, validate it here (recommended)
    const reference = body.reference || (body.data && body.data.reference);
    const status = body.status || (body.data && body.data.status);

    if (!reference) {
      console.warn('Callback missing reference', body);
      return res.status(200).send('ok');
    }

    const record = db.findByReference(reference);
    if (!record) {
      console.warn('Unknown reference', reference);
      return res.status(200).send('ok');
    }

    if (status === 'SUCCESS' || status === 'COMPLETED' || body.success === true) {
      db.markComplete(reference, 'SUCCESS', body);
      await tgSend(record.chat_id, `Payment successful. Reference: ${reference}. Amount: ${record.amount}`);
    } else {
      db.markComplete(reference, 'FAILED', body);
      await tgSend(record.chat_id, `Payment failed or cancelled. Reference: ${reference}.`);
    }

    return res.status(200).send('ok');
  } catch (err) {
    console.error('callback error', err);
    return res.status(500).send('error');
  }
};
